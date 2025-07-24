import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Container,
    Box,
    Alert,
    Breadcrumbs,
    Link
} from '@mui/material';
import { NavigateBefore as NavigateBeforeIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import ProductRecommendation from './ProductRecommendation';

/**
 * ChatPage Component
 * 
 * This component handles the chat interface and product recommendations
 * after a user submits their initial search query. It maintains the chat
 * state and handles follow-up interactions with the AI agents.
 */
function ChatPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [recommendations, setRecommendations] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [error, setError] = useState(null);

    const initialized = useRef(false);

    // Get the initial query from location state
    const initialQuery = location.state?.query || '';

    /**
     * Real API call to backend for product search
     * Replaces the mock search function with actual backend integration
     */
    const searchProducts = async (query, context = {}) => {
        const response = await fetch('http://localhost:5001/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: query,
                context: context
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    };

    /**
     * Handles the initial product search request
     * Sends the user query to the backend for processing by LLM agents
     */
    const handleInitialSearch = useCallback(async (query) => {
        if (!query.trim()) return;

        setIsProcessing(true);
        setChatHistory([]);
        setRecommendations(null);
        setError(null);

        try {
            // Add initial user message to chat
            const initialMessage = {
                type: 'user',
                content: query,
                timestamp: new Date().toISOString()
            };
            setChatHistory([initialMessage]);

            // Call the real backend API
            const data = await searchProducts(query, {
                original_query: query,
                chat_history: [],
                current_products: []
            });

            // Debug: Log the response structure
            console.log('Backend response:', data);

            // Process the agent response
            let agentResponse = '';
            let recommendations = null;

            // Handle different response formats from the backend
            if (typeof data === 'string') {
                agentResponse = data;
            } else if (data && typeof data === 'object') {
                // Check for successful product search response
                if (data.status === 'success' && data.products && Array.isArray(data.products)) {
                    // Product search response format
                    agentResponse = data.response || 'Here are your product recommendations!';
                    recommendations = {
                        summary: data.response || 'Product recommendations',
                        products: data.products
                    };
                } else if (data.recommendations_ready && data.products) {
                    // Legacy format - Final shopping list format
                    agentResponse = data.message || 'Here are your product recommendations!';
                    recommendations = {
                        summary: data.summary || 'Product recommendations',
                        products: data.products
                    };
                } else if (data.response) {
                    // Conversational response format
                    agentResponse = data.response;
                } else if (data.error) {
                    // Error format
                    agentResponse = `Sorry, I encountered an error: ${data.error}`;
                } else {
                    // Default fallback
                    agentResponse = JSON.stringify(data);
                }
            }

            // Add agent response to chat
            const agentMessage = {
                type: 'agent',
                content: agentResponse || 'I found some products that might interest you!',
                timestamp: new Date().toISOString()
            };
            setChatHistory(prev => [...prev, agentMessage]);

            if (recommendations) {
                setRecommendations(recommendations);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Sorry, I encountered an error while processing your request. Please try again.');
            const errorMessage = {
                type: 'error',
                content: 'Sorry, I encountered an error while processing your request. Please try again.',
                timestamp: new Date().toISOString()
            };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    /**
     * Initialize the chat with the initial query
     * This runs when the component mounts with a query
     */
    useEffect(() => {
        if (initialQuery && !initialized.current) {
            initialized.current = true;
            handleInitialSearch(initialQuery);
        }
    }, [initialQuery, handleInitialSearch]);

    /**
     * Handles follow-up questions from the user
     * Sends additional context to refine recommendations
     */
    const handleFollowUp = async (message) => {
        if (!message.trim()) return;

        // Add user message to chat
        const userMessage = {
            type: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };
        setChatHistory(prev => [...prev, userMessage]);

        setIsProcessing(true);

        try {
            // Call the real backend API for follow-up
            const context = {
                original_query: initialQuery,
                chat_history: chatHistory.map(msg => ({
                    role: msg.type === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
                current_products: recommendations?.products || []
            };

            const data = await searchProducts(message, context);

            // Process the agent response (same logic as initial search)
            let agentResponse = '';
            let updatedRecommendations = null;

            if (typeof data === 'string') {
                agentResponse = data;
            } else if (data && typeof data === 'object') {
                // Check for successful product search response
                if (data.status === 'success' && data.products && Array.isArray(data.products)) {
                    // Product search response format
                    agentResponse = data.response || 'Here are your updated recommendations!';
                    updatedRecommendations = {
                        summary: data.response || 'Updated recommendations',
                        products: data.products
                    };
                } else if (data.recommendations_ready && data.products) {
                    // Legacy format - Final shopping list format
                    agentResponse = data.message || 'Here are your updated recommendations!';
                    updatedRecommendations = {
                        summary: data.summary || 'Updated recommendations',
                        products: data.products
                    };
                } else if (data.response) {
                    // Conversational response format
                    agentResponse = data.response;
                } else if (data.error) {
                    // Error format
                    agentResponse = `Sorry, I encountered an error: ${data.error}`;
                } else {
                    // Default fallback
                    agentResponse = JSON.stringify(data);
                }
            }

            const agentMessage = {
                type: 'agent',
                content: agentResponse,
                timestamp: new Date().toISOString()
            };
            setChatHistory(prev => [...prev, agentMessage]);

            // Update recommendations if new ones are provided
            if (updatedRecommendations) {
                setRecommendations(updatedRecommendations);
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                type: 'error',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString()
            };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Handle navigation back to home page
     */
    const handleBackToHome = () => {
        navigate('/');
    };

    // If no initial query, redirect to home
    if (!initialQuery) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    No search query provided. Redirecting to home page...
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Breadcrumb Navigation */}
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        component="button"
                        variant="body1"
                        onClick={handleBackToHome}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        <NavigateBeforeIcon fontSize="small" />
                        Back to Home
                    </Link>
                </Breadcrumbs>
            </Box>


            {/* Error Display */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Chat Interface */}
            {chatHistory.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <ChatInterface
                        chatHistory={chatHistory}
                        onSendMessage={handleFollowUp}
                        isProcessing={isProcessing}
                    />
                </Box>
            )}

            {/* Product Recommendations */}
            {recommendations && (
                <ProductRecommendation recommendations={recommendations} />
            )}
        </Container>
    );
}

export default ChatPage; 