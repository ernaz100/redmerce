import React, { useState, useRef, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    TextField,
    Button,
    Avatar,
    Paper,
    List,
    ListItem,
    Skeleton
} from '@mui/material';
import {
    Send as SendIcon,
    Person as PersonIcon,
    Chat as ChatIcon,
    Error as ErrorIcon,
    Lightbulb as LightbulbIcon
} from '@mui/icons-material';

/**
 * ChatInterface Component
 * Provides a chat interface for follow-up questions and conversations with AI agents
 * 
 * @param {Array} chatHistory - Array of chat messages
 * @param {Function} onSendMessage - Callback function to handle sending messages
 * @param {boolean} isProcessing - Whether the system is currently processing a request
 */
const ChatInterface = ({ chatHistory, onSendMessage, isProcessing }) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // Focus input when component mounts
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    /**
     * Handles sending a message
     * Validates input and calls the onSendMessage callback
     */
    const handleSendMessage = () => {
        if (!message.trim() || isProcessing) return;

        onSendMessage(message.trim());
        setMessage('');
    };

    /**
     * Handles Enter key press in the input field
     * @param {KeyboardEvent} e - The keyboard event
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    /**
     * Formats timestamp for display
     * @param {string} timestamp - ISO timestamp string
     * @returns {string} Formatted time string
     */
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    /**
     * Renders a chat message based on its type
     * @param {Object} msg - Message object
     * @param {number} index - Message index
     * @returns {JSX.Element} Rendered message component
     */
    const renderMessage = (msg, index) => {
        const isUser = msg.type === 'user';
        const isError = msg.type === 'error';

        return (
            <ListItem
                key={index}
                sx={{
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    px: 0,
                    py: 1
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '80%' }}>
                    {!isUser && (
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                mr: 1,
                                bgcolor: isError ? 'error.main' : 'primary.main'
                            }}
                        >
                            {isError ? <ErrorIcon /> : <ChatIcon />}
                        </Avatar>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                        <Paper
                            sx={{
                                p: 2,
                                maxWidth: '100%',
                                bgcolor: isUser ? 'primary.main' : isError ? 'error.light' : 'grey.50',
                                color: isUser ? 'white' : isError ? 'error.contrastText' : 'text.primary',
                                borderRadius: 3,
                                borderTopLeftRadius: isUser ? 3 : 1,
                                borderTopRightRadius: isUser ? 1 : 3,
                                boxShadow: 1
                            }}
                        >
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                {msg.content}
                            </Typography>
                        </Paper>

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, px: 1 }}>
                            {formatTime(msg.timestamp)}
                        </Typography>
                    </Box>

                    {isUser && (
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                ml: 1,
                                bgcolor: 'primary.main'
                            }}
                        >
                            <PersonIcon />
                        </Avatar>
                    )}
                </Box>
            </ListItem>
        );
    };

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ChatIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Chat with Redmerce
                    </Typography>
                </Box>

                {/* Messages Container */}
                <Paper
                    sx={{
                        height: 320,
                        overflow: 'auto',
                        mb: 2,
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 2
                    }}
                >
                    {chatHistory.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <ChatIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                            <Typography color="text.secondary">
                                Start a conversation by asking follow-up questions about the products!
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ py: 0 }}>
                            {chatHistory.map((msg, index) => renderMessage(msg, index))}

                            {/* Loading indicator when processing */}
                            {isProcessing && (
                                <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', px: 0, py: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '80%' }}>
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                mr: 1,
                                                bgcolor: 'primary.main'
                                            }}
                                        >
                                            <ChatIcon />
                                        </Avatar>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <Paper
                                                sx={{
                                                    p: 2,
                                                    minWidth: 200,
                                                    maxWidth: '100%',
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 3,
                                                    borderTopLeftRadius: 1,
                                                    borderTopRightRadius: 3,
                                                    boxShadow: 1
                                                }}
                                            >
                                                {/* Skeleton loading animation */}
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                    <Skeleton
                                                        variant="text"
                                                        width="90%"
                                                        height={20}
                                                        animation="wave"
                                                    />
                                                    <Skeleton
                                                        variant="text"
                                                        width="75%"
                                                        height={20}
                                                        animation="wave"
                                                    />
                                                    <Skeleton
                                                        variant="text"
                                                        width="60%"
                                                        height={20}
                                                        animation="wave"
                                                    />
                                                </Box>
                                            </Paper>

                                            {/* Typing indicator dots */}
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, px: 1 }}>
                                                Redmerce is typing...
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                            )}
                        </List>
                    )}

                    {/* Auto-scroll anchor */}
                    <div ref={messagesEndRef} />
                </Paper>

                {/* Input Section */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        ref={inputRef}
                        fullWidth
                        multiline
                        maxRows={3}
                        variant="outlined"
                        placeholder="Ask follow-up questions about features, pricing, or preferences..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isProcessing}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isProcessing}
                        sx={{
                            borderRadius: 3,
                            minWidth: 56,
                            height: 56
                        }}
                    >
                        <SendIcon />
                    </Button>
                </Box>

                {/* Help Text */}
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LightbulbIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="caption" color="text.secondary">
                        Try asking about: price range, specific features, screen size, or brand preferences
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ChatInterface; 