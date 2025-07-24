# Redmerce Backend

A Flask-based backend service for Redmerce, integrating smolagents, Perplexity API, and OpenAI GPT for intelligent product search, recommendations, and conversational shopping.

---

## 🚀 Features

- **AI-Powered Product Search**: Uses smolagents for reasoning and planning
- **Real-Time Web Search**: Integrates Perplexity API for up-to-date product information
- **Chat Interface**: Handles follow-up questions and product refinement
- **Personalized Recommendations**: Generates recommendations based on user preferences
- **RESTful API**: Clean, well-documented endpoints
- **Error Handling**: Standardized JSON errors
- **CORS Support**: For seamless frontend integration

---

## 🏗️ Architecture

```
backend/
├── app.py              # Main Flask application
├── run.py              # Application runner
├── requirements.txt    # Python dependencies
├── env.example         # Environment variables template
├── services/           # Business logic services
│   ├── __init__.py
│   └── agent_service.py  # AI agent orchestration
├── utils/              # Utility modules
│   ├── __init__.py
│   ├── error_handler.py  # Error handling utilities
│   └── validators.py     # Request validation
```

---

## 🛠️ Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation
1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```
2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env and add your API keys
   ```

### Environment Variables
- `FLASK_ENV` (development/production)
- `SECRET_KEY` (any random string)
- `PORT` (default: 5001)
- `PERPLEXITY_API_KEY`, `OPENAI_API_KEY` (required)

---

## 🚦 Running the Backend

### Development
```bash
python run.py
```
Or with Flask directly:
```bash
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=5001
```

### Production
```bash
gunicorn -w 4 -b 0.0.0.0:5001 app:create_app()
```

---

## 🧩 API Endpoints

- `GET /health` — Health check
- `POST /api/search` — Product search (query, filters)
- `POST /api/chat` — Chat/follow-up (message, context)
- `POST /api/recommendations` — Personalized recommendations

All endpoints return JSON responses. See below for example requests and responses.

---

## 🧠 Services Overview

- **agent_service.py**: Orchestrates smolagents, Perplexity, and OpenAI for product search and recommendations
- **error_handler.py**: Standardized error responses
- **validators.py**: Request validation

---

## 🧪 Example Requests

**Health Check:**
```bash
curl http://localhost:5001/health
```

**Chat Follow-up:**
```bash
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me cheaper alternatives"}'
```

---

## 🖥️ Integration with Frontend
- **CORS**: Configured for `http://localhost:3000`
- **Proxy**: Frontend proxies requests to backend
- **Response Format**: Structured for easy frontend consumption

---

## 🛡️ Error Handling
- **400 Bad Request**: Invalid request format or data
- **404 Not Found**: Endpoint not found
- **500 Internal Server Error**: Server-side errors

All errors return standardized JSON:
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

## 🧑‍💻 Development Notes
- Add new endpoints in `app.py`
- Implement business logic in `services/`
- Validate requests in `utils/validators.py`
- Add comments for clarity

---

## 🧪 Testing
- Use `curl` or Postman to test endpoints
- Add unit tests as needed (pytest recommended)

---

## 🛠️ Troubleshooting
- **API Key Errors**: Ensure all required API keys are set in `.env`
- **Port Conflicts**: Change `PORT` in `.env` if 5001 is in use
- **CORS Issues**: Check CORS config in `app.py`
- **Debug Mode**: Set `FLASK_ENV=development` for detailed errors

---

## 🤝 Contributing
1. Follow code structure and commenting style
2. Add error handling
3. Update documentation
4. Test thoroughly

---

## 📄 License
MIT License (see LICENSE)

---

## 🙏 Acknowledgments
- Smolagents (AI agent framework)
- Perplexity (web search)
- OpenAI (GPT models)
- Flask (backend) 