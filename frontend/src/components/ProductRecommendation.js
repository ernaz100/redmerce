import React, { useCallback, useRef, useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Button,
    Chip,
    Rating,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    IconButton,
    Skeleton
} from '@mui/material';
import {
    Link as LinkIcon,
    Label as LabelIcon,
    Monitor as MonitorIcon,
    Update as UpdateIcon,
    ArrowBackIos,
    ArrowForwardIos
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
 * ProductRecommendation Component
 * Displays product recommendations with detailed information, pricing, and direct links
 * 
 * @param {Object} recommendations - Object containing product recommendations data
 * @param {Array} recommendations.products - Array of product objects
 * @param {string} recommendations.summary - Summary of the recommendations
 */
const ProductRecommendation = ({ recommendations }) => {
    // Handler to save product for later
    const handleSaveForLater = useCallback((product) => {
        let saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
        if (!saved.find(item => item.url === product.url)) {
            saved.push(product);
            localStorage.setItem('savedItems', JSON.stringify(saved));

            // Dispatch custom event to notify App component about the change
            window.dispatchEvent(new Event('savedItemsChanged'));
        }
    }, []);

    // Ref for horizontal scroll
    const scrollRef = useRef(null);

    // Scroll handler for left/right buttons
    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;
        const scrollAmount = container.offsetWidth * 0.8; // scroll by 80% of container width
        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!recommendations || !recommendations.products) {
        return (
            <Card sx={{ textAlign: 'center', p: 4 }}>
                <Typography color="text.secondary">
                    No recommendations available at the moment.
                </Typography>
            </Card>
        );
    }

    return (
        <Box sx={{ space: 3 }}>
            {/* Horizontal Scrollable Product List with Arrows */}
            <Box sx={{ position: 'relative', mb: 3 }}>
                {/* Left Arrow */}
                <IconButton
                    onClick={() => scroll('left')}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        zIndex: 2,
                        transform: 'translateY(-50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        display: { xs: 'none', sm: 'flex' }
                    }}
                    aria-label="scroll left"
                >
                    <ArrowBackIos />
                </IconButton>
                {/* Scrollable Grid */}
                <Box
                    ref={scrollRef}
                    sx={{
                        overflowX: 'auto',
                        display: 'flex',
                        gap: 3,
                        scrollBehavior: 'smooth',
                        px: 5,
                        py: 1,
                        '&::-webkit-scrollbar': {
                            height: 8,
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'grey.100',
                            borderRadius: 4,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'grey.400',
                            borderRadius: 4,
                            '&:hover': {
                                backgroundColor: 'grey.500',
                            },
                        },
                    }}
                >
                    {recommendations.products.map((product, index) => (
                        <Box key={index} sx={{
                            minWidth: { xs: 280, sm: 320, md: 340 },
                            flex: '0 0 auto',
                            maxWidth: { xs: 280, sm: 320, md: 340 }
                        }}>
                            <ProductCard product={product} onSave={handleSaveForLater} />
                        </Box>
                    ))}
                </Box>
                {/* Right Arrow */}
                <IconButton
                    onClick={() => scroll('right')}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 0,
                        zIndex: 2,
                        transform: 'translateY(-50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        display: { xs: 'none', sm: 'flex' }
                    }}
                    aria-label="scroll right"
                >
                    <ArrowForwardIos />
                </IconButton>
            </Box>
            {/* Additional Information */}
            {recommendations.additionalInfo && (
                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Additional Information
                        </Typography>
                        <Typography color="text.secondary">
                            {recommendations.additionalInfo}
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

/**
 * ProductCard Component
 * Individual product card displaying product information, pricing, and features
 * 
 * @param {Object} product - Product object with details
 * @param {string} product.name - Product name
 * @param {string} product.brand - Product brand
 * @param {number} product.price - Product price
 * @param {string} product.currency - Price currency
 * @param {string} product.image - Product image URL
 * @param {string} product.url - Product page URL
 * @param {Array} product.features - Array of product features
 * @param {number} product.rating - Product rating (1-5)
 * @param {string} product.description - Product description
 */
const ProductCard = ({ product, onSave }) => {
    const [imageLoading, setImageLoading] = useState(true);

    /**
     * Formats price for display, handling both numeric and string inputs
     * @param {number|string} price - Price value (can be number or string with currency)
     * @param {string} currency - Currency code (default: 'EUR')
     * @returns {string} Formatted price string
     */
    const formatPrice = (price, currency = 'EUR') => {
        // If price is already a formatted string (contains currency symbol), return as is
        if (typeof price === 'string' && (price.includes('$') || price.includes('€') || price.includes('£'))) {
            return price;
        }

        // Convert to number, handling various formats
        let numericPrice;
        if (typeof price === 'string') {
            // Remove currency symbols and commas, then parse
            numericPrice = parseFloat(price.replace(/[$,€£\s]/g, ''));
        } else {
            numericPrice = parseFloat(price);
        }

        // Check if parsing was successful
        if (isNaN(numericPrice)) {
            return 'Price unavailable';
        }

        // Format the numeric price
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(numericPrice);
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }
            }}
        >
            {/* Product Image */}
            <Box sx={{
                position: 'relative',
                height: 240,
                overflow: 'hidden',
                borderRadius: '8px 8px 0 0'
            }}>
                {/* Loading skeleton */}
                {imageLoading && (
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        animation="wave"
                        sx={{ position: 'absolute', top: 0, left: 0 }}
                    />
                )}

                <CardMedia
                    component="img"
                    height="240"
                    width="100%"
                    image={getValidImageUrl(product.image_url || product.image, product.name, product.brand)}
                    alt={product.name}
                    sx={{
                        objectFit: 'contain',
                        objectPosition: 'center',
                        width: '100%',
                        height: '100%',
                        transition: 'transform 0.3s ease-in-out',
                        opacity: imageLoading ? 0 : 1,
                        backgroundColor: 'grey.50',
                        '&:hover': {
                            transform: 'scale(1.02)'
                        }
                    }}
                    onError={(e) => {
                        console.warn(`Failed to load image: ${product.image_url || product.image}`);
                        setImageLoading(false);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                        setImageLoading(false);
                        e.target.nextSibling.style.display = 'none';
                    }}
                />
                {/* Fallback placeholder */}
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

                {/* Brand Badge */}
                {product.brand && (
                    <Chip
                        label={product.brand}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                )}

                {/* Rating */}
                {product.rating && product.rating !== '' && (
                    <Paper
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            px: 1,
                            py: 0.5,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            borderRadius: 1
                        }}
                    >
                        <Rating
                            value={parseFloat(product.rating) || 0}
                            readOnly
                            size="small"
                            sx={{ '& .MuiRating-iconFilled': { color: 'warning.main' } }}
                        />
                    </Paper>
                )}

                {/* Real-time Data Indicator */}
                <Tooltip title="Real-time data from web search">
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1,
                            py: 0.5,
                            bgcolor: 'rgba(76, 175, 80, 0.9)',
                            color: 'white',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500
                        }}
                    >
                        <UpdateIcon sx={{ fontSize: 16 }} />
                        Live
                    </Box>
                </Tooltip>
            </Box>

            {/* Product Info */}
            <CardContent sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                p: 2.5
            }}>
                <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        lineHeight: 1.3,
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                        minHeight: '2.5rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {product.name}
                </Typography>

                {product.description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, flexGrow: 1 }}
                    >
                        {product.description}
                    </Typography>
                )}

                {/* Price */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                        {formatPrice(product.price, product.currency)}
                    </Typography>
                    {product.originalPrice && (() => {
                        // Helper function to extract numeric value from price
                        const getNumericPrice = (price) => {
                            if (typeof price === 'number') return price;
                            if (typeof price === 'string') {
                                return parseFloat(price.replace(/[$,€£\s]/g, ''));
                            }
                            return 0;
                        };

                        const currentPrice = getNumericPrice(product.price);
                        const originalPrice = getNumericPrice(product.originalPrice);

                        return originalPrice > currentPrice;
                    })() && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textDecoration: 'line-through' }}
                            >
                                {formatPrice(product.originalPrice, product.currency)}
                            </Typography>
                        )}
                </Box>

                {/* Additional Product Info */}
                <Box sx={{ mb: 2 }}>
                    {product.reviews && product.reviews !== '' && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {product.reviews} reviews
                        </Typography>
                    )}
                    {product.shipping && product.shipping !== '' && (
                        <Typography variant="body2" color="success.main" sx={{ mb: 0.5, fontWeight: 500 }}>
                            {product.shipping}
                        </Typography>
                    )}
                    {product.source && product.source !== '' && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontStyle: 'italic' }}>
                            From {product.source}
                        </Typography>
                    )}
                </Box>

                {/* Features */}
                {product.features && product.features.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                            Key Features:
                        </Typography>
                        <List dense sx={{ py: 0 }}>
                            {product.features.slice(0, 3).map((feature, index) => (
                                <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 20 }}>
                                        <LabelIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={feature}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            color: 'text.secondary'
                                        }}
                                    />
                                </ListItem>
                            ))}
                            {product.features.length > 3 && (
                                <ListItem sx={{ py: 0.5, px: 0 }}>
                                    <ListItemText
                                        primary={`+${product.features.length - 3} more features`}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            color: 'text.secondary',
                                            fontStyle: 'italic'
                                        }}
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    mt: 'auto',
                    pt: 2
                }}>
                    {(product.purchase_link || product.url) ? (
                        <Button
                            variant="contained"
                            fullWidth
                            endIcon={<LinkIcon />}
                            href={product.purchase_link || product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}
                        >
                            View Product
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            fullWidth
                            disabled
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}
                        >
                            Link Unavailable
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => onSave(product)}
                        sx={{
                            borderRadius: 2,
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            minWidth: 'fit-content'
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductRecommendation; 