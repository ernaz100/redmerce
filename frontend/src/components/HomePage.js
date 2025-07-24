import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    InputAdornment
} from '@mui/material';
import {
    Search as SearchIcon,
    AutoAwesome as AutoAwesomeIcon,
    Language as LanguageIcon,
    Link as LinkIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * HomePage Component
 * 
 * This component serves as the landing page for Redmerce.
 * It contains the main search interface and feature highlights.
 * When a user submits a search query, they are redirected to the chat page.
 */
function HomePage() {
    const navigate = useNavigate();
    const [userQuery, setUserQuery] = useState('');

    /**
     * Handles the search form submission
     * Redirects to the chat page with the user's query
     */
    const handleSearch = () => {
        if (!userQuery.trim()) return;

        // Navigate to chat page with the query as state
        navigate('/chat', {
            state: { query: userQuery.trim() }
        });
    };

    /**
     * Handles Enter key press in the search input
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Hero Section */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    Find Your Perfect Product
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
                    Tell us what you're looking for, and our AI agents will search across multiple e-commerce sites
                    to find the best options for you. Get personalized recommendations with real-time data.
                </Typography>

                {/* Search Input */}
                <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="e.g., I want to buy a new TV"
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSearch}
                            disabled={!userQuery.trim()}
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                minWidth: 120
                            }}
                        >
                            Shop
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Features Section */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', textAlign: 'center' }}>
                        <CardContent>
                            <Box sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'primary.light',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2
                            }}>
                                <LanguageIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                Real-Time Web Search
                            </Typography>
                            <Typography color="text.secondary">
                                Search across multiple e-commerce sites for the latest products and prices.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', textAlign: 'center' }}>
                        <CardContent>
                            <Box sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'primary.light',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2
                            }}>
                                <AutoAwesomeIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                Smart Recommendations
                            </Typography>
                            <Typography color="text.secondary">
                                Get personalized suggestions based on your preferences and requirements.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', textAlign: 'center' }}>
                        <CardContent>
                            <Box sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'primary.light',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2
                            }}>
                                <LinkIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                Direct Links
                            </Typography>
                            <Typography color="text.secondary">
                                Access product pages directly with detailed specifications and pricing.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default HomePage; 