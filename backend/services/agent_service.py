"""
Product Search Service
Integrates smolagents and Perplexity API for intelligent product discovery
"""

import os
import logging
import json
from typing import Dict, List, Optional, Any
from datetime import datetime
import requests
from openai import OpenAI
from smolagents import CodeAgent, tool, LiteLLMModel, ToolCallingAgent

logger = logging.getLogger(__name__)


# System prompt for the shopping agent - defines behavior and multi-step pipeline
# The agent automatically enriches products with real-time data in a multi-step process
SYSTEM_PROMPT = (
    "You are a shopping agent called 'redmerce'. Your job is to help users find the best products with complete details.\n\n"
    + 
    "RESPONSE FORMAT: Always respond with a JSON object containing these fields:\n"
    + 
    "{\n"
    +
    "  \"status\": \"success\",\n"
    +
    "  \"response\": \"Your conversational response to the user\",\n"
    +
    "  \"products\": [], // Empty array for conversation, filled array with complete product details\n"
    +
    "  \"type\": \"conversational\" or \"product_search\",\n"
    +
    "  \"timestamp\": \"ISO timestamp\"\n"
    +
    "}\n\n"
    +
    "BEHAVIOR RULES:\n"
    +
    "1. If from the chat history you need clarification about their shopping needs, respond conversationally with an empty products array. You need to call final_answer() with this response to talk back to the user and receive the next user message later. \n"
    +
    "2. If the user has clearly specified what they want to buy, follow this MULTI-STEP PIPELINE:\n"
    +
    "   a) Use 'find_products' tool to search for 3-5 products via Perplexity API\n"
    +
    "   b) For EACH product found, use 'get_product_details' tool to get real-time price, purchase link, and product image\n"
    +
    "   c) Return the complete enriched product data in the products array\n\n"
    +
    "3. Always complete both steps (search + details) before responding to ensure users get complete product information.\n\n"
    +
    "4. Be helpful and ask specific questions about budget, features, or preferences when needed.\n"
)

class AgentService:
    """
    Service for intelligent product search with multi-step enrichment pipeline
    
    This service implements a two-step process:
    1. Search for products using Perplexity API
    2. Enrich each product with real-time details using SERP API
    
    The agent automatically completes both steps to provide complete product information.
    """
    
    def __init__(self):
        """Initialize the product search service with API keys and configurations"""
        # Load API keys from environment variables
        # Required for multi-step pipeline:
        # - PERPLEXITY_API_KEY: For product search (step 1)
        # - SERP_API_KEY: For real-time product details (step 2) 
        # - OPENAI_API_KEY: For conversational responses (optional)
        self.perplexity_api_key = os.getenv('PERPLEXITY_API_KEY')
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.serp_api_key = os.getenv('SERP_API_KEY')
        
        # Warn if critical API keys are missing 
        if not self.perplexity_api_key:
            logger.warning("PERPLEXITY_API_KEY not found in environment variables - product search will fail")
        
        if not self.openai_api_key:
            logger.warning("OPENAI_API_KEY not found in environment variables - using fallback responses")
            
        if not self.serp_api_key:
            logger.warning("SERP_API_KEY not found in environment variables - product details will fail")
        
        # Initialize OpenAI client for fallback responses if needed
        if self.openai_api_key:
            self.openai_client = OpenAI(api_key=self.openai_api_key)
        else:
            self.openai_client = None
        
        # Bind instance methods to static tool functions using closures
        # This pattern allows the smolagents tools to access instance methods and state
        service = self

        @tool
        def find_products(search_query: str) -> str:
            """
            STEP 1: Find the best products based on a search query using Perplexity API
            
            Args:
                search_query: The search query to find products (e.g., "best wireless headphones", "gaming laptop under $1000")
                
            Returns:
                JSON string containing basic product information including name, brand, description, and features
            """
            return service._find_products(search_query)

        @tool
        def get_product_details(product_name: str) -> str:
            """
            STEP 2: Get real-time details for a specific product using SERP API
            
            Args:
                product_name: The name of the product to find details for
                
            Returns:
                JSON containing enriched product details including price, product image, and purchase link
            """
            return service._get_product_details(product_name)

        # Initialize the smolagents CodeAgent with our pipeline tools
        # CodeAgent can execute Python code and call tools to accomplish tasks
        tools = [find_products, get_product_details]
        llm = LiteLLMModel(model_id="gpt-4o")  # Use GPT-4o for intelligent reasoning
        
        # additional_authorized_imports allows the agent to use specific Python modules
        self.agent = CodeAgent(tools, llm, additional_authorized_imports=["json", "datetime"])
    
    def process_message(self, message: str, context: Dict = None) -> Dict[str, Any]:
        """
        Process a message using smolagents shopping agent
        
        Args:
            message: User's message
            context: Optional context for the message including chat history
            
        Returns:
            Dictionary containing the response with conversational text and optional products
        """
        try:
            logger.info(f"Processing message: {message}")
            
            # Prepare the chat context
            chat_context = {
                "message": message,
                "context": context or {},
                "timestamp": datetime.utcnow().isoformat()
            }

            # Create the full prompt for the agent
            full_prompt = (
                SYSTEM_PROMPT + "\n\n" +
                f"User message: \"{message}\"\n" +
                f"Chat context: {json.dumps(chat_context)}\n\n" +
                "Analyze the user's message and respond appropriately:\n\n" +
                "- If they're being conversational or need clarification, respond directly with a JSON object containing empty products array.\n" +
                "- If they want to shop for something specific, follow the MULTI-STEP PIPELINE:\n" +
                "  1. First, call find_products() to search for products\n" +
                "  2. Then, for each product found, call get_product_details() to get complete details\n" +
                "  3. Finally, return a JSON response with the complete enriched product data. Make sure to provide details for every product that you recommend, what are the pros and cons for each product, and why you recommend it. \n\n" +
                "Always complete both steps of the pipeline before responding with final results."
            )
            
            logger.info("Starting agent execution...")
            
            # Run the agent with the prepared prompt
            agent_response = self.agent.run(full_prompt)
            
            logger.info(f"Agent execution completed. Response type: {type(agent_response)}")
            
            # Process the agent response
            if isinstance(agent_response, str):
                # Try to parse JSON response
                try:
                    parsed_response = json.loads(agent_response)
                    logger.info("Successfully parsed JSON response from agent")
                    return self._validate_response(parsed_response)
                except json.JSONDecodeError:
                    # If not JSON, create a conversational response
                    logger.info("Agent returned string response, formatting as conversational")
                    return {
                        "status": "success",
                        "response": agent_response,
                        "products": [],
                        "type": "conversational",
                        "timestamp": datetime.utcnow().isoformat()
                    }
            else:
                # If it's already a dict/object, validate and return
                logger.info("Agent returned structured response")
                return self._validate_response(agent_response)
            
        except Exception as e:
            logger.error(f"Error in process_message: {str(e)}")
            return {
                "status": "error",
                "response": "I apologize, but I encountered an error while processing your request. Please try again.",
                "products": [],
                "type": "conversational",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def _validate_response(self, response: Dict) -> Dict[str, Any]:
        """
        Validate and ensure the response has the correct format
        
        Args:
            response: The response dictionary to validate
            
        Returns:
            Validated response dictionary with required fields
        """
        # Ensure required fields exist
        validated = {
            "status": response.get("status", "success"),
            "response": response.get("response", ""),
            "products": response.get("products", []),
            "type": response.get("type", "conversational"),
            "timestamp": response.get("timestamp", datetime.utcnow().isoformat())
        }
        
        # Preserve any additional fields
        for key, value in response.items():
            if key not in validated:
                validated[key] = value
        
        return validated
        
    def _find_products(self, search_query: str) -> str:
        """
        STEP 1 of multi-step pipeline: Find products using Perplexity API
        
        This method searches for products based on user query and returns basic product information.
        The agent will then automatically call get_product_details() for each product found.
        
        Args:
            search_query: The search query to find products (e.g., "best wireless headphones under $200")
            
        Returns:
            JSON string containing array of products with name, brand, description, and features
            Format: [{"name": "Product Name", "brand": "Brand", "description": "...", "features": [...]}]
        """
        if not self.perplexity_api_key:
            return json.dumps({"error": "Perplexity API key not configured"})
        
        try:
            headers = {
                'Authorization': f'Bearer {self.perplexity_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'sonar',
                'messages': [
                    {
                        'role': 'user',
                        'content': f"Find the 3-5 best products for: {search_query}. Ideally these products should be available in Germany. Return a JSON array where each product has these exact fields: 'name' (full product name with brand), 'brand', 'description', 'features' (array of key features). Focus on finding high-quality, well-reviewed products with clear, searchable product names. Make sure product names are detailed enough to find in shopping searches."
                    }
                ],
                'max_tokens': 3000,
                'temperature': 0.1
            }
            
            response = requests.post(
                'https://api.perplexity.ai/chat/completions',
                headers=headers,
                json=data,
                timeout=120
            )
            
            if response.status_code == 200:
                result = response.json()
                # Extract the content from the response
                content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
                return content
            else:
                logger.error(f"Perplexity API error: {response.status_code} - {response.text}")
                return json.dumps({"error": f"Search failed with status {response.status_code}"})
                
        except Exception as e:
            logger.error(f"Error in find_products: {str(e)}")
            return json.dumps({"error": f"Search error: {str(e)}"})

    def _get_product_details(self, product_name: str) -> str:
        """
        STEP 2 of multi-step pipeline: Get real-time product details using SERP API
        
        This method enriches basic product information from step 1 with real-time data:
        - Current price from shopping sites
        - Product images
        - Purchase links  
        - Ratings and reviews
        - Shipping information
        
        The agent calls this method for each product found in find_products() to provide
        complete product information to the user.
        
        Args:
            product_name: The full product name from step 1 (e.g., "Sony WH-1000XM5 Wireless Headphones")
            
        Returns:
            JSON string with enriched product details including:
            {"name": "...", "price": "...", "image_url": "...", "purchase_link": "...", 
             "source": "...", "rating": "...", "reviews": "...", "shipping": "..."}
        """
        if not self.serp_api_key:
            return json.dumps({"error": "SERP API key not configured"})

        try:
            # Use SERP API to search for the product on Google Shopping
            params = {
                'api_key': self.serp_api_key,
                'engine': 'google_shopping',
                'q': product_name,
                'num': 5,  # Get top 5 results
                'gl': 'de',                     # Country code for Germany
                'hl': 'de',                     # Language set to German
                'location': 'Germany'          # Optional, more precise targeting   
            }

            response = requests.get(
                'https://serpapi.com/search.json',
                params=params,
                timeout=60
            )

            if response.status_code == 200:
                result = response.json()
                shopping_results = result.get('shopping_results', [])
                if shopping_results:
                    # Extract only essential product information from SERP API response
                    # Remove any additional fields that might clutter the response
                    cleaned_results = []
                    for product in shopping_results:
                        cleaned_product = {
                            "name": product.get("title", product_name),
                            "price": product.get("price", "Price not available"),
                            "image_url": product.get("thumbnail", ""),
                            "purchase_link": product.get("product_link", ""),
                            "source": product.get("source", ""),
                            "rating": product.get("rating", ""),
                            "reviews": product.get("reviews", ""),
                            "shipping": product.get("shipping", "")
                        }
                        # Remove empty fields to keep response clean
                        cleaned_product = {k: v for k, v in cleaned_product.items() if v and v != ""}
                        cleaned_results.append(cleaned_product)
                    
                    return json.dumps(cleaned_results)
                else:
                    # No shopping results found, return basic structure
                    return json.dumps({
                        "name": product_name,
                        "price": "Price not available",
                        "image_url": "",
                        "purchase_link": "",
                        "error": "No shopping results found"
                    })
            else:
                logger.error(f"SERP API error: {response.status_code} - {response.text}")
                return json.dumps({"error": f"SERP API failed with status {response.status_code}"})

        except Exception as e:
            logger.error(f"Error in get_product_details: {str(e)}")
            return json.dumps({
                "name": product_name,
                "price": "Price unavailable",
                "image_url": "",
                "purchase_link": "",
                "error": f"Details error: {str(e)}"
            })
