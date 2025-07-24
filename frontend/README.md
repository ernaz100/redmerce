# Redmerce Frontend

A modern React-based frontend for the Redmerce platform, providing a conversational e-commerce experience powered by AI product recommendations and real-time web search.

---

## 🚀 Features
- **Conversational Product Search**: Chat interface for natural language queries and follow-ups
- **Product Recommendations**: AI-powered, real-time product suggestions with detailed info
- **Saved Items**: Save products for later viewing (browser local storage)
- **Modern UI**: Built with Material UI for a responsive, accessible experience
- **Seamless Backend Integration**: Communicates with Flask backend via REST API

---

## 🏗️ Main Components
- **App.js**: Main app shell, routing, and theme
- **HomePage.js**: Entry point for product search
- **ChatPage.js**: Conversational interface for refining product choices
- **ProductRecommendation.js**: Displays product cards with details and save option
- **SavedItems.js**: View/manage saved products
- **ChatInterface.js**: Handles chat UI and message flow

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 16+
- Backend running at http://localhost:5001 (see backend/README.md)

### Installation
```bash
cd frontend
npm install
```

---

## 🚦 Usage

### Start the Frontend
```bash
npm start
```
- The app will be available at [http://localhost:3000](http://localhost:3000)
- By default, API requests are proxied to the backend at http://localhost:5001

---

## 🧩 How It Works
- **User enters a product query** (e.g., "Samsung 4K TV")
- **Frontend sends request** to backend `/api/search`
- **Backend returns recommendations** (AI + web search)
- **User can chat** to refine results (e.g., "Show me cheaper alternatives")
- **Products can be saved** for later viewing

---

## 🗂️ Project Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ChatInterface.js
│   │   ├── ProductRecommendation.js
│   │   ├── SavedItems.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

---

## 🧪 Testing
- Run `npm start` and interact with the UI
- Ensure backend is running for full functionality

---

## 🧑‍💻 Development Notes
- All major logic is in `src/components/`
- Uses Material UI for styling and layout
- Saved items are stored in browser localStorage
- API endpoints are defined in the backend (see backend/README.md)

---

## 🤝 Contributing
1. Follow code style and add comments
2. Test UI changes thoroughly
3. Update documentation as needed

---

## 📄 License
MIT License (see LICENSE)

---

## 🙏 Acknowledgments
- Material UI (UI framework)
- React (frontend library)
- Flask, smolagents, Perplexity, OpenAI (backend/AI) 