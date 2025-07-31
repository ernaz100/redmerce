# Redmerce Backend

A Flask-based backend service for Redmerce, integrating smolagents, Perplexity API, and OpenAI GPT for intelligent product search, recommendations, and conversational shopping experiences.

## Overview

The Redmerce backend serves as the AI-powered engine that processes natural language queries, performs intelligent web searches, and generates personalized product recommendations. Built with Flask and integrated with cutting-edge AI technologies, it provides a robust REST API for the frontend application.

### Key Technologies
- **Flask**: Python web framework for REST API
- **smolagents**: AI agent framework for intelligent reasoning
- **Perplexity API**: Real-time web search capabilities
- **OpenAI GPT**: Advanced language model processing
- **SerpAPI**: Product link extraction and validation

---

## Features

### AI-Powered Functionality
- **Intelligent Product Search**: smolagents orchestrate search strategies
- **Real-Time Web Search**: Perplexity API provides live product data
- **Natural Language Processing**: OpenAI GPT extracts and structures information
- **Conversational AI**: Context-aware follow-up question handling
- **Smart Recommendations**: AI-powered product ranking and filtering

### Technical Features
- **RESTful API**: Clean, well-documented endpoints
- **Error Handling**: Standardized JSON error responses
- **CORS Support**: Seamless frontend integration
- **Environment Configuration**: Flexible API key management
- **Logging**: Comprehensive request and error logging
- **Validation**: Request data validation and sanitization

---

## Architecture

### Service Architecture
```
backend/
├── app.py              # Main Flask application and routes
├── run.py              # Application runner and configuration
├── requirements.txt    # Python dependencies
├── env.example         # Environment variables template
├── services/           # Business logic and AI services
│   ├── __init__.py
│   └── agent_service.py  # AI agent orchestration
└── utils/              # Utility modules
    ├── __init__.py
    ├── error_handler.py  # Error handling utilities
    └── validators.py     # Request validation
```

### AI Integration Flow
1. **User Query**: Natural language input received
2. **Agent Planning**: smolagents analyze and plan search strategy
3. **Web Search**: Perplexity API retrieves real-time product data
4. **LLM Processing**: OpenAI GPT extracts and structures information
5. **Response Formatting**: Structured data returned to frontend

---

## Setup & Installation

### Prerequisites
- **Python** 3.8 or higher
- **pip** (Python package manager)
- **Virtual environment** (recommended)

### Required API Keys
- **OpenAI API Key**: For GPT model processing
- **Perplexity API Key**: For web search functionality
- **SerpAPI Key**: For product link extraction (optional)

### Installation Steps

#### 1. Environment Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 2. Dependencies Installation
```bash
# Install required packages
pip install -r requirements.txt
```

#### 3. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your API keys
nano .env  # or use your preferred editor
```

#### 4. Environment Variables
Create a `.env` file with the following variables:
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
PORT=5001
PERPLEXITY_API_KEY=your-perplexity-api-key
OPENAI_API_KEY=your-openai-api-key
SERP_API_KEY=your-serp-api-key
```

---

## Running the Backend

### Development Mode
```bash
# Start the Flask development server
python app.py
```

Or with Flask directly:
```bash
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=5001
```

### Production Mode
```bash
# Using Gunicorn (recommended for production)
gunicorn -w 4 -b 0.0.0.0:5001 app:create_app()
```

### Health Check
Verify the service is running:
```bash
curl http://localhost:5001/health
```

---

## 🧩 API Documentation

### Endpoints Overview

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T10:30:00.000Z",
  "service": "redmerce-backend"
}
```

#### Chat Interface
```http
POST /api/chat
Content-Type: application/json
```
**Request Body:**
```json
{
  "message": "Show me Samsung 4K TVs under $1000",
  "context": {
    "original_query": "Samsung 4K TV",
    "chat_history": [
      {
        "role": "user",
        "content": "Find me a Samsung TV"
      },
      {
        "role": "assistant", 
        "content": "I found several Samsung TVs..."
      }
    ],
    "current_products": [
      {
        "name": "Samsung QN65Q80T",
        "brand": "Samsung",
        "price": 1299.99,
        "currency": "USD",
        "image": "https://example.com/image.jpg",
        "url": "https://example.com/product",
        "features": ["4K", "QLED", "Smart TV"],
        "rating": 4.5,
        "description": "65-inch QLED 4K Smart TV",
        "thumbnail": "https://example.com/thumb.jpg",
        "link": "https://example.com/buy"
      }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Here are some Samsung 4K TVs under $1000:",
  "products": [
    {
      "name": "Samsung UN65TU7000",
      "brand": "Samsung", 
      "price": 799.99,
      "currency": "USD",
      "image": "https://example.com/image.jpg",
      "url": "https://example.com/product",
      "features": ["4K", "Crystal Display", "Smart TV"],
      "rating": 4.2,
      "description": "65-inch 4K Ultra HD Smart TV",
      "thumbnail": "https://example.com/thumb.jpg",
      "link": "https://example.com/buy"
    }
  ],
  "context": {
    "original_query": "Samsung 4K TV",
    "chat_history": [...]
  }
}
```

### Error Responses
All endpoints return standardized error responses:
```json
{
  "error": {
    "message": "Error description",
    "type": "ErrorType",
    "context": "Where the error occurred"
  },
  "success": false
}
```

---

## Services Overview

### AgentService (services/agent_service.py)
**Core AI Orchestration Service**
- **Purpose**: Coordinates smolagents, Perplexity, and OpenAI
- **Key Methods**:
  - `process_message()`: Main chat processing
  - `search_products()`: Product search orchestration
  - `extract_product_info()`: Product data extraction

### ErrorHandler (utils/error_handler.py)
**Error Management Utilities**
- **Purpose**: Standardized error handling and responses
- **Features**:
  - Consistent error format
  - Logging integration
  - User-friendly messages

### Validators (utils/validators.py)
**Request Validation**
- **Purpose**: Validate incoming API requests
- **Features**:
  - Data type validation
  - Required field checking
  - Sanitization

---

## Testing

### API Testing
```bash
# Health check
curl http://localhost:5001/health

# Chat endpoint test
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Find me a laptop under $500"}'

# Test with context
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me cheaper alternatives",
    "context": {
      "original_query": "gaming laptop",
      "chat_history": [],
      "current_products": []
    }
  }'
```

### Integration Testing
1. **Start the backend**: `python app.py`
2. **Test health endpoint**: Verify service is running
3. **Test chat functionality**: Send various product queries
4. **Test error handling**: Send invalid requests
5. **Test CORS**: Verify frontend can communicate

---

## Error Handling

### Common Error Types
- **400 Bad Request**: Invalid request format or data
- **404 Not Found**: Endpoint not found
- **500 Internal Server Error**: Server-side errors
- **503 Service Unavailable**: External API failures

### Error Response Format
```json
{
  "error": {
    "message": "Detailed error description",
    "type": "ValidationError|APIError|ServerError",
    "context": "Specific location or operation"
  },
  "success": false
}
```

---


## Acknowledgments

### Technologies & Libraries
- **Flask**: Python web framework
- **smolagents**: AI agent framework for intelligent reasoning
- **Perplexity API**: Real-time web search capabilities
- **OpenAI GPT**: Advanced language model processing
- **SerpAPI**: Product link extraction
- **Gunicorn**: Production WSGI server

### Academic Context
Developed as part of the **LLM's and Beyond '25** seminar, demonstrating practical applications of AI agents and Large Language Models in modern software development.
