import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Rating,
  Fade,
  Slide,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart,
  FlashOn,
  Favorite,
  FavoriteBorder,
  Share,
  Inventory,
  LocalShipping,
  Star,
  Visibility,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import './BookCard.css';

// Dummy book data for fallback
const getDummyBook = (book) => ({
  id: book.id || Math.random(),
  title: book.title || 'Unknown Title',
  author: book.author || 'Unknown Author',
  genre: book.genre || 'FICTION',
  isbn: book.isbn || '000-0000000000',
  price: book.price || 0,
  description: book.description || 'No description available for this book.',
  stockQuantity: book.stockQuantity || 0,
  imageUrl: book.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=500&fit=crop',
  rating: book.rating || Math.random() * 2 + 3,
  reviewCount: book.reviewCount || Math.floor(Math.random() * 100) + 1,
  pages: book.pages || Math.floor(Math.random() * 500) + 100,
  publisher: book.publisher || 'Sample Publisher',
  year: book.year || 2023
});

const BookCard = ({ book }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Use dummy data if book data is incomplete
  const bookData = getDummyBook(book);

  const handleAddToCart = (event) => {
    event.stopPropagation();
    console.log('Add to cart:', bookData);
  };

  const handleBuyNow = (event) => {
    event.stopPropagation();
    console.log('Buy now:', bookData);
  };

  const handleFavorite = (event) => {
    event.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleShare = (event) => {
    event.stopPropagation();
    console.log('Share book:', bookData);
  };

  const handleQuickView = (event) => {
    event.stopPropagation();
    setQuickViewOpen(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getStockStatus = () => {
    if (bookData.stockQuantity === 0) return 'out_of_stock';
    if (bookData.stockQuantity < 5) return 'low_stock';
    return 'in_stock';
  };

  const getStockColor = () => {
    switch (getStockStatus()) {
      case 'out_of_stock': return 'error';
      case 'low_stock': return 'warning';
      default: return 'success';
    }
  };

  const getStockText = () => {
    switch (getStockStatus()) {
      case 'out_of_stock': return 'Out of Stock';
      case 'low_stock': return `${bookData.stockQuantity} left`;
      default: return 'In Stock';
    }
  };

  // Responsive image height
  const getImageHeight = () => {
    if (isMobile) return 200;
    if (isTablet) return 220;
    return 240;
  };

  return (
    <div className="book-card-container">
      <Slide direction="up" in={true} timeout={600}>
        <Card 
          className="book-card"
        >
          {/* Image Section with Overlay */}
          <div className="book-image-container">
            <CardMedia
              component="img"
              height={getImageHeight()}
              className="book-image"
              image={imageError ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=500&fit=crop' : bookData.imageUrl}
              alt={bookData.title}
              onError={handleImageError}
            />
            
            {/* Action Buttons Overlay */}
            <Box className="action-buttons">
              <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                <IconButton 
                  size="small" 
                  onClick={handleFavorite}
                  className={`action-button ${isFavorite ? 'action-button-favorite' : ''}`}
                >
                  {isFavorite ? <Favorite fontSize={isMobile ? "small" : "medium"} /> : <FavoriteBorder fontSize={isMobile ? "small" : "medium"} />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Quick view">
                <IconButton 
                  size="small" 
                  onClick={handleQuickView}
                  className="action-button"
                >
                  <Visibility fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Share">
                <IconButton 
                  size="small" 
                  onClick={handleShare}
                  className="action-button action-button-share"
                >
                  <Share fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Stock Badge */}
            <Badge
              color={getStockColor()}
              badgeContent={getStockText()}
              className="stock-badge"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
              }}
            />

            {/* Rating Overlay */}
            <Box className="rating-overlay">
              <Star className="rating-star" />
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
                {bookData.rating.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, fontSize: isMobile ? '0.6rem' : '0.7rem' }}>
                ({bookData.reviewCount})
              </Typography>
            </Box>
          </div>

          {/* Content Section */}
          <CardContent className="book-content">
            {/* Title and Author */}
            <Typography 
              gutterBottom 
              variant={isMobile ? "subtitle1" : "h6"}
              component="h3"
              className="book-title"
            >
              {bookData.title}
            </Typography>
            
            <Typography 
              color="text.secondary" 
              variant="body2"
              className="book-author"
            >
              by {bookData.author}
            </Typography>
            
            {/* Genre Chip */}
            <Box>
              <Chip 
                label={bookData.genre.replace('_', ' ')} 
                size="small" 
                color="primary"
                variant="filled"
                className="genre-chip"
              />
            </Box>
            
            {/* Description */}
            <Typography 
              variant="body2" 
              color="text.secondary"
              className="book-description"
            >
              {bookData.description}
            </Typography>
            
            {/* Price and Action Section */}
            <Box className="price-section">
              {/* Price and Stock */}
              <Box className="price-stock-row">
                <Typography 
                  variant={isMobile ? "h6" : "h5"}
                  color="primary" 
                  fontWeight="bold"
                  className="book-price"
                >
                  ${bookData.price.toFixed(2)}
                </Typography>
                
                <Box className="stock-info">
                  <Inventory sx={{ fontSize: isMobile ? 14 : 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" className="stock-text">
                    {bookData.stockQuantity} left
                  </Typography>
                </Box>
              </Box>
              
              {/* Authentication and Purchase Buttons */}
              {!isAuthenticated ? (
                <Alert 
                  severity="info" 
                  className="auth-alert"
                >
                  Please login to purchase
                </Alert>
              ) : (
                <Box className="action-buttons-row">
                  {bookData.stockQuantity > 0 ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddToCart}
                        size={isMobile ? "small" : "medium"}
                        startIcon={<ShoppingCart />}
                        className="cart-button"
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBuyNow}
                        size={isMobile ? "small" : "medium"}
                        startIcon={<FlashOn />}
                        className="buy-button"
                      >
                        Buy Now
                      </Button>
                    </>
                  ) : (
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      disabled
                      size={isMobile ? "small" : "medium"}
                      startIcon={<LocalShipping />}
                      className="out-of-stock-button"
                    >
                      Out of Stock
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Slide>

      {/* Quick View Dialog */}
      <Dialog
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        maxWidth="md"
        fullWidth
        className="quick-view-dialog"
      >
        <DialogTitle className="dialog-title">
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {bookData.title}
          </Typography>
          <Typography color="text.secondary" variant="h6">
            by {bookData.author}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                image={bookData.imageUrl}
                alt={bookData.title}
                className="dialog-image"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={bookData.genre.replace('_', ' ')} 
                  color="primary"
                  sx={{ mb: 2, fontWeight: 'bold' }}
                />
                <Typography variant="body1" paragraph>
                  {bookData.description}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Rating value={bookData.rating} precision={0.1} readOnly size={isMobile ? "small" : "medium"} />
                <Typography variant="body2" color="text.secondary">
                  {bookData.rating.toFixed(1)} ({bookData.reviewCount} reviews)
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  ${bookData.price.toFixed(2)}
                </Typography>
                <Chip 
                  label={getStockText()} 
                  color={getStockColor()}
                  variant="filled"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button 
            onClick={() => setQuickViewOpen(false)}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddToCart}
            size={isMobile ? "small" : "medium"}
            disabled={bookData.stockQuantity === 0}
            startIcon={<ShoppingCart />}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookCard;