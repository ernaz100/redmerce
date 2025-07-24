"""
Redmerce Backend - Flask Application
LLMs & Beyond Seminar Project

This Flask application provides the backend API for Redmerce,
integrating smolagents and Perplexity API for intelligent product search.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
from datetime import datetime

# Import our custom modules
from services.agent_service import AgentService
from utils.error_handler import handle_error
from utils.validators import validate_search_request, validate_chat_request

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Configure CORS to allow frontend requests
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
    
    # Configure app settings
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['PERPLEXITY_API_KEY'] = os.getenv('PERPLEXITY_API_KEY')
    app.config['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
    app.config['SERP_API_KEY'] = os.getenv('SERP_API_KEY')

    # Initialize services
    agent_service = AgentService()
    
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'service': 'redmerce-backend'
        })
    
    @app.route('/api/chat', methods=['POST'])
    def chat_with_agent():
        """
        Main chat with agent endpoint
        
        Expected request body:
        {
            "message": "string - user's message",
            "context": {
                "original_query": "string - user's original query",
                "chat_history": [
                    {"role": "user", "content": "string - user's message"},
                    {"role": "assistant", "content": "string - assistant's message"}
                ],
                "current_products": [
                    {"name": "string", "brand": "string", "price": float, "currency": "string", "image": "string", "url": "string", "features": ["string"], "rating": float, "description": "string", "thumbnail": "string", "link": "string"}
                ]
            }
        }
        """
        try:
            # Validate request
            data = request.get_json()
            if not validate_chat_request(data):
                return jsonify({'error': 'Invalid request format'}), 400
            
            message = data.get('message', '').strip()
            context = data.get('context', {})
            
            if not message:
                return jsonify({'error': 'Message is required'}), 400
            
            logger.info(f"Processing chat request: {message}")
            
            # Process chat using smolagents and Perplexity
            result = agent_service.process_message(message, context)
            
            return jsonify(result)
            
        except Exception as e:
            return handle_error(e, "Error processing search request")

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"Starting Redmerce backend on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug) 