# Redmerce Frontend

A modern React-based frontend for the Redmerce platform, providing a conversational e-commerce experience powered by AI product recommendations and real-time web search.

## 🎯 Overview

The Redmerce frontend is built with React and Material UI, offering an intuitive and responsive interface for AI-powered product discovery. Users can interact with the platform through natural language conversations, browse intelligent product recommendations, and manage their saved items.

### Key Features
- **Conversational Interface**: Natural language product search and refinement
- **Real-time Recommendations**: AI-powered product suggestions with live data
- **Responsive Design**: Mobile-friendly interface with Material UI
- **Local Storage**: Save and manage favorite products
- **Seamless Integration**: RESTful API communication with Flask backend

---

## 🚀 Features

### User Experience
- **Intuitive Chat Interface**: Natural language queries and follow-up questions
- **Product Cards**: Rich product information with images, pricing, and features
- **Smart Filtering**: Refine results through conversational interactions
- **Saved Items Management**: Persistent storage of favorite products
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices

### Technical Features
- **Modern React**: Built with React 18 and functional components
- **Material UI**: Professional design system with consistent theming
- **State Management**: Local state with React hooks
- **API Integration**: Axios for reliable HTTP communication
- **Error Handling**: User-friendly error messages and loading states

---

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── ChatInterface.js      # Chat UI and message handling
│   ├── ChatPage.js          # Main chat page with product display
│   ├── HomePage.js          # Landing page and initial search
│   ├── ProductRecommendation.js  # Product card component
│   └── SavedItems.js        # Saved items management
├── App.js                   # Main application with routing
├── index.js                 # Application entry point
└── index.css               # Global styles
```

### Data Flow
1. **User Input**: Natural language queries via chat interface
2. **API Communication**: Requests sent to Flask backend
3. **Response Processing**: Product data formatted for display
4. **State Updates**: UI updates with new recommendations
5. **User Interaction**: Follow-up questions and product saving

---

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js** 16+ 
- **npm** (Node package manager)
- **Backend Service**: Flask backend running at http://localhost:5001

### Installation
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Configuration
The frontend automatically proxies API requests to the backend. Ensure the backend is running on port 5001, or update the proxy configuration in `package.json`:

```json
{
  "proxy": "http://localhost:5001"
}
```

---

## 🚦 Usage

### Development Server
```bash
npm start
```
- Application runs at http://localhost:3000
- Hot reload enabled for development
- API requests proxied to backend

### Production Build
```bash
npm run build
```
Creates optimized production build in `build/` directory.

### Testing
```bash
npm test
```
Runs test suite with Jest and React Testing Library.

---

## 🧩 Component Documentation

### App.js
**Main Application Component**
- Handles routing between pages
- Provides Material UI theme
- Manages global application state

### HomePage.js
**Landing Page Component**
- Entry point for new users
- Product search interface
- Navigation to chat functionality

### ChatPage.js
**Main Chat Interface**
- Conversational product search
- Real-time product recommendations
- Integration with AI backend

### ChatInterface.js
**Chat UI Component**
- Message input and display
- Chat history management
- Loading states and error handling

### ProductRecommendation.js
**Product Display Component**
- Rich product information cards
- Save/unsave functionality
- Product details and pricing

### SavedItems.js
**Saved Items Management**
- View saved products
- Remove items from saved list
- Persistent local storage

---

## 🗂️ Project Structure
```
frontend/
├── public/
│   ├── index.html           # Main HTML template
│   └── favicon.png          # Application icon
├── src/
│   ├── components/          # React components
│   │   ├── ChatInterface.js      # Chat UI and logic
│   │   ├── ChatPage.js          # Main chat page
│   │   ├── HomePage.js          # Landing page
│   │   ├── ProductRecommendation.js  # Product display
│   │   └── SavedItems.js        # Saved items management
│   ├── App.js               # Main application component
│   ├── index.js             # Application entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

---

## 🧪 Testing

### Manual Testing
1. **Start the application**: `npm start`
2. **Test chat functionality**: Enter product queries
3. **Test saved items**: Save and unsave products
4. **Test responsive design**: Resize browser window
5. **Test error handling**: Disconnect backend and test error states

### Automated Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

---

## 🔧 Development

### Code Style
- **ES6+ Features**: Use modern JavaScript syntax
- **Functional Components**: Prefer hooks over class components
- **Material UI**: Follow Material Design principles
- **Comments**: Document complex logic and component purposes

### Adding Features
1. **New Components**: Create in `src/components/`
2. **Styling**: Use Material UI components and theme
3. **State Management**: Use React hooks for local state
4. **API Integration**: Add new API calls in components
5. **Testing**: Add tests for new functionality

### Best Practices
- **Component Composition**: Break down complex components
- **Error Boundaries**: Handle errors gracefully
- **Loading States**: Provide feedback during API calls
- **Accessibility**: Follow WCAG guidelines
- **Performance**: Optimize re-renders and bundle size

---

## 🛡️ Error Handling

### API Errors
- Network connectivity issues
- Backend service unavailability
- Invalid API responses
- Rate limiting

### User Experience
- Clear error messages
- Retry mechanisms
- Fallback content
- Loading indicators

---

## 🚀 Performance Optimization

### Bundle Optimization
- Code splitting with React.lazy()
- Tree shaking for unused code
- Image optimization
- Gzip compression

### Runtime Performance
- Memoization with React.memo()
- Optimized re-renders
- Efficient state updates
- Lazy loading of components

---

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Implement** changes with proper comments
4. **Test** thoroughly
5. **Submit** a pull request

### Code Quality
- Follow existing code style
- Add comprehensive comments
- Include error handling
- Write tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

## 🙏 Acknowledgments

### Technologies
- **React**: Frontend library for building user interfaces
- **Material UI**: Professional design system and component library
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing

### Academic Context
Developed as part of the **LLM's and Beyond '25** seminar, demonstrating modern frontend development practices with AI integration.

---

## 📞 Support

For questions or issues:
- Check the main [README.md](../README.md)
- Review backend documentation in `backend/README.md`
- Create an issue in the repository

---

*Redmerce Frontend - Modern React interface for AI-powered e-commerce* 