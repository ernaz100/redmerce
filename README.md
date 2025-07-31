# Redmerce - LLM & Beyond Seminar Platform

A modern e-commerce product recommendation platform leveraging AI agents (smolagents), Perplexity API, and OpenAI GPT models to provide intelligent, real-time product suggestions and conversational shopping experiences.

## Project Overview

Redmerce demonstrates the power of Large Language Models (LLMs) and AI agents in creating intelligent e-commerce experiences. The platform combines multiple AI technologies to provide users with personalized product recommendations through natural language conversations.

### Key Technologies
- **AI Agents**: smolagents framework for intelligent reasoning and planning
- **Web Search**: Perplexity API for real-time product data retrieval
- **LLM Processing**: OpenAI GPT models for product information extraction and analysis
- **Frontend**: React with Material UI for modern, responsive interface
- **Backend**: Flask REST API for seamless integration

---

##  Features

### Core Functionality
- **AI-Powered Product Search**: Intelligent product discovery using smolagents
- **Real-Time Web Search**: Live product data from trusted e-commerce sources
- **Conversational Interface**: Natural language follow-up and product refinement
- **Smart Filtering**: Filter by price, features, brand, and other criteria
- **Relevance Ranking**: AI-powered product ranking based on user preferences
- **Saved Items**: Save and manage favorite products locally
- **Trusted Sources**: Curated e-commerce domains for reliable product data

### Technical Features
- **Responsive Design**: Mobile-friendly interface with Material UI
- **Real-time Updates**: Live product information and pricing
- **Error Handling**: Robust error management and user feedback
- **CORS Support**: Seamless frontend-backend integration
- **Environment Configuration**: Flexible API key management

---

## Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   Flask Backend │    │  External APIs  │
│                 │    │                 │    │                 │
│ • Chat Interface│◄──►│ • AI Agent      │◄──►│ • Perplexity    │
│ • Product Cards │    │ • Web Search    │    │ • OpenAI GPT    │
│ • Saved Items   │    │ • Data Processing│   │ • SerpAPI       │
│ • Material UI   │    │ • REST API      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **User Input**: Natural language query via chat interface
2. **AI Processing**: smolagents analyze and plan search strategy
3. **Web Search**: Perplexity API retrieves real-time product data
4. **LLM Analysis**: OpenAI GPT extracts and structures product information
5. **Response**: Formatted recommendations returned to user
6. **Interaction**: Follow-up questions refine and improve results

---

## Installation & Setup

### Prerequisites
- **Node.js** 16+ (for frontend)
- **Python** 3.8+ (for backend)
- **npm** (Node package manager)
- **pip** (Python package manager)

### Required API Keys
- **OpenAI API Key**: For GPT model processing
- **Perplexity API Key**: For web search functionality
- **SerpAPI Key**: For product link extraction (optional)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd redmerce

# Start the entire application
./start.sh
```

### Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp env.example .env
# Edit .env and add your API keys

# Start backend
python app.py
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

### Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key
PORT=5001
PERPLEXITY_API_KEY=your-perplexity-api-key
OPENAI_API_KEY=your-openai-api-key
SERP_API_KEY=your-serp-api-key
```

---

##  Usage

### Starting the Application
```bash
# Option 1: Use the startup script (recommended)
./start.sh

# Option 2: Start manually
# Terminal 1 - Backend
cd backend && python app.py

# Terminal 2 - Frontend  
cd frontend && npm start
```

### Accessing the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health

### Example Usage
1. **Initial Search**: Enter a product query like "Samsung 4K TV"
2. **Review Results**: Browse AI-recommended products with details
3. **Refine Search**: Ask follow-up questions like "Show me cheaper alternatives"
4. **Save Items**: Click the save button on products you like
5. **View Saved**: Access saved items from the navigation menu

---

## API Documentation

### Backend Endpoints

#### Health Check
```http
GET /health
```
Returns service status and timestamp.

#### Chat Interface
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Show me Samsung 4K TVs under $1000",
  "context": {
    "original_query": "Samsung 4K TV",
    "chat_history": [...],
    "current_products": [...]
  }
}
```

### Example API Calls
```bash
# Health check
curl http://localhost:5001/health

# Chat request
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me cheaper alternatives"}'
```

---

## Project Structure
```
redmerce/
├── frontend/                 # React frontend application
│   ├── public/
│   │   ├── index.html       # Main HTML template
│   │   └── favicon.png      # Application icon
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ChatInterface.js      # Chat UI and logic
│   │   │   ├── ChatPage.js          # Main chat page
│   │   │   ├── HomePage.js          # Landing page
│   │   │   ├── ProductRecommendation.js  # Product display
│   │   │   └── SavedItems.js        # Saved items management
│   │   ├── App.js           # Main application component
│   │   ├── index.js         # Application entry point
│   │   └── index.css        # Global styles
│   ├── package.json         # Frontend dependencies
│   └── README.md            # Frontend documentation
├── backend/                  # Flask backend application
│   ├── services/            # Business logic services
│   │   ├── __init__.py
│   │   └── agent_service.py # AI agent orchestration
│   ├── utils/               # Utility modules
│   │   ├── __init__.py
│   │   ├── error_handler.py # Error handling utilities
│   │   └── validators.py    # Request validation
│   ├── app.py               # Main Flask application
│   ├── run.py               # Application runner
│   ├── requirements.txt     # Python dependencies
│   ├── env.example          # Environment template
│   └── README.md            # Backend documentation
├── start.sh                 # Application startup script
├── package.json             # Root package configuration
└── README.md                # This file
```

---

## Testing

### Backend Testing
```bash
# Health check
curl http://localhost:5001/health

# Chat endpoint test
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Find me a laptop"}'
```

### Frontend Testing
1. Start both services using `./start.sh`
2. Open http://localhost:3000 in your browser
3. Test the chat interface with various queries
4. Verify saved items functionality
5. Test responsive design on different screen sizes

---


### Academic Context
This project was developed as part of the **LLM's and Beyond '25** seminar, exploring the practical applications of Large Language Models and AI agents in modern software development.

---

