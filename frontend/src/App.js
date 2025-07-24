import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    ThemeProvider,
    createTheme,
    CssBaseline,
    IconButton,
    Badge
} from '@mui/material';
import {
    ShoppingCart as ShoppingCartIcon,
    Store as StoreIcon
} from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SavedItems from './components/SavedItems';
import ChatPage from './components/ChatPage';
import HomePage from './components/HomePage';

// Create a custom theme for Redmerce
const theme = createTheme({
    palette: {
        primary: {
            main: '#d32f2f', // Red color for Redmerce
            light: '#ff6659',
            dark: '#9a0007',
        },
        secondary: {
            main: '#424242',
            light: '#6d6d6d',
            dark: '#1b1b1b',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    borderRadius: 16,
                },
            },
        },
    },
});

function App() {
    // State to track the number of saved items
    const [savedItemsCount, setSavedItemsCount] = useState(0);

    // Effect to listen for changes in localStorage and update the badge count
    useEffect(() => {
        // Function to update the count from localStorage
        const updateSavedItemsCount = () => {
            const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
            setSavedItemsCount(savedItems.length);
        };

        // Initial count
        updateSavedItemsCount();

        // Listen for storage events (when localStorage changes in other tabs/windows)
        const handleStorageChange = (e) => {
            if (e.key === 'savedItems') {
                updateSavedItemsCount();
            }
        };

        // Listen for custom events (when localStorage changes in the same tab)
        const handleCustomStorageChange = () => {
            updateSavedItemsCount();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('savedItemsChanged', handleCustomStorageChange);

        // Cleanup event listeners
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('savedItemsChanged', handleCustomStorageChange);
        };
    }, []);

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                    {/* Header */}
                    <AppBar position="static" elevation={1}>
                        <Toolbar>
                            {/* Left side - Logo and University name */}
                            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <StoreIcon sx={{ fontSize: 48, color: 'white' }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                                            Redmerce
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                            Uni Tübingen - LLMs & Beyond '25
                                        </Typography>
                                    </Box>
                                </Box>
                            </Link>
                            {/* Right side - Navigation items */}
                            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: 1 }}>
                                {/* Shopping cart icon with badge */}
                                <Badge
                                    badgeContent={savedItemsCount}
                                    color="error"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            fontSize: '0.5rem',
                                            fontWeight: 600,
                                            minWidth: '20px',
                                            height: '20px',
                                            borderRadius: '10px',
                                        }
                                    }}
                                >
                                    <IconButton
                                        size="large"
                                        edge="end"
                                        color="inherit"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
                                        component={Link}
                                        to="/saved"
                                    >
                                        <ShoppingCartIcon />
                                    </IconButton>
                                </Badge>
                            </Box>
                        </Toolbar>
                    </AppBar>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/saved" element={<SavedItems />} />
                    </Routes>
                </Box>
            </ThemeProvider>
        </Router >
    );
}

export default App; 