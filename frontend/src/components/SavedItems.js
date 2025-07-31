import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Button,
    CardMedia,
    Chip,
    IconButton,
    Fade,
    Grow,
    Paper,
    Divider,
    Tooltip
} from '@mui/material';
import {
    Link as LinkIcon,
    Delete as DeleteIcon,
    Favorite as FavoriteIcon,
    Star as StarIcon,
    Monitor as MonitorIcon
} from '@mui/icons-material';

/**
 * Utility function to get appropriate placeholder image based on product type
 * @param {string} productName - Name of the product
 * @param {string} brand - Brand of the product
 * @returns {string} Placeholder image URL
 */
const getPlaceholderImage = (productName = '', brand = '') => {
    const name = productName.toLowerCase();
    const brandName = brand.toLowerCase();

    // TV/Display related products
    if (name.includes('tv') || name.includes('display') || name.includes('monitor') ||
        brandName.includes('samsung') || brandName.includes('lg') || brandName.includes('sony')) {
        return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop';
    }

    // Default placeholder for other products
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
};

/**
 * Utility function to validate and get a working image URL
 * @param {string} imageUrl - Original image URL
 * @param {string} productName - Name of the product for fallback
 * @param {string} brand - Brand of the product for fallback
 * @returns {string} Valid image URL or placeholder
 */
const getValidImageUrl = (imageUrl, productName, brand) => {
    // If no image URL provided, return placeholder
    if (!imageUrl) {
        return getPlaceholderImage(productName, brand);
    }

    // If it's already a valid URL, return it
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // If it's a local file path, return placeholder
    if (imageUrl.startsWith('/')) {
        return getPlaceholderImage(productName, brand);
    }

    // Default fallback
    return getPlaceholderImage(productName, brand);
};

/**
 * SavedItems Component
 */
const SavedItems = () => {
    const [saved, setSaved] = useState([]);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('savedItems') || '[]');
        setSaved(items);
    }, []);

    const handleRemove = (url) => {
        const updated = saved.filter(item => item.url !== url);
        setSaved(updated);
        localStorage.setItem('savedItems', JSON.stringify(updated));

        // Dispatch custom event to notify App component about the change
        window.dispatchEvent(new Event('savedItemsChanged'));
    };

    // Empty state with enhanced styling
    if (saved.length === 0) {
        return (
            <Fade in={true} timeout={800}>
                <Paper
                    elevation={0}
                    sx={{
                        textAlign: 'center',
                        p: 6,
                        mt: 4,
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        borderRadius: 4,
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}
                >
                    <FavoriteIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2, opacity: 0.7 }} />
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
                        Your Wishlist is Empty
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1.1rem' }}>
                        Start saving products you love from our recommendations
                    </Typography>
                </Paper>
            </Fade>
        );
    }

    return (
        <Box sx={{ mt: 4, mb: 6 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    sx={{
                        mb: 1,
                        fontWeight: 800,
                        background: 'linear-gradient(45deg,rgb(237, 141, 8) 30%,rgb(255, 15, 15) 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    Your Saved Items
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                    {saved.length} {saved.length === 1 ? 'item' : 'items'} in your collection
                </Typography>
                <Divider sx={{ mt: 3, mx: 'auto', width: '60px', borderWidth: 2, borderColor: 'primary.main' }} />
            </Box>

            {/* Products Grid */}
            <Grid container spacing={4} sx={{ px: 2, py: 1 }}>
                {saved.map((product, idx) => (
                    <Grid item xs={12} sm={6} lg={4} key={idx}>
                        <Grow in={true} timeout={600 + (idx * 100)}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease-in-out',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                                    }
                                }}
                            >
                                {/* Product Image with Overlay */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: 240, // Match ProductRecommendation
                                        overflow: 'hidden',
                                        borderRadius: '8px 8px 0 0' // Match ProductRecommendation
                                    }}
                                >
                                    {/* Product Image */}
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        width="100%"
                                        image={getValidImageUrl(product.image_url || product.image, product.name, product.brand)}
                                        alt={product.name}
                                        sx={{
                                            objectFit: 'contain', // Match ProductRecommendation
                                            objectPosition: 'center',
                                            width: '100%',
                                            height: '100%',
                                            transition: 'transform 0.3s ease-in-out',
                                            backgroundColor: 'grey.50',
                                            '&:hover': {
                                                transform: 'scale(1.02)'
                                            }
                                        }}
                                        onError={(e) => {
                                            console.warn(`Failed to load image: ${product.image_url || product.image}`);
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                        onLoad={(e) => {
                                            e.target.nextSibling.style.display = 'none';
                                        }}
                                    />
                                    {/* Fallback placeholder, same as ProductRecommendation */}
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            bgcolor: 'grey.50',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            display: 'none',
                                            flexDirection: 'column',
                                            gap: 1,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0
                                        }}
                                    >
                                        <MonitorIcon sx={{ fontSize: 48, color: 'grey.400' }} />
                                        <Typography variant="caption" color="text.secondary">
                                            Image unavailable
                                        </Typography>
                                    </Box>
                                    {/* Floating Action Buttons */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1
                                        }}
                                    >
                                        <Tooltip title="Remove from saved">
                                            <IconButton
                                                onClick={() => handleRemove(product.url)}
                                                size="small"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                    {/* Brand Badge */}
                                    {product.brand && (
                                        <Chip
                                            label={product.brand}
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                bottom: 12,
                                                left: 12,
                                                bgcolor: 'rgba(255,255,255,0.9)',
                                                backdropFilter: 'blur(10px)',
                                                fontWeight: 600,
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    )}
                                </Box>

                                {/* Product Content */}
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            lineHeight: 1.3,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {product.name}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mb: 2,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            lineHeight: 1.5
                                        }}
                                    >
                                        {product.description}
                                    </Typography>

                                    {/* Price Section */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography
                                            variant="h5"
                                            color="primary.main"
                                            sx={{
                                                fontWeight: 800,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <StarIcon sx={{ fontSize: 20, color: 'warning.main' }} />
                                            {product.price} {product.currency}
                                        </Typography>
                                    </Box>

                                    {/* Action Buttons */}
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            endIcon={<LinkIcon />}
                                            href={product.purchase_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Product
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grow>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SavedItems; 