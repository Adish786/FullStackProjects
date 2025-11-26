import React, { useState, useEffect } from 'react';

// Material-UI Components
import {
  Container,
  Grid,
  TextField,
  Pagination,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Card,
  CardContent,
  Fade,
  Slide,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';

// Material-UI Icons
import {
  Search,
  Clear,
  FilterList,
  LocalLibrary,
  TrendingUp,
  NewReleases,
  Star,
  Sort,
} from '@mui/icons-material';

// Components and Services
import { bookAPI } from '../services/api';
import BookCard from './BookCard';
import './BookList.css';

// Constants
const DUMMY_BOOKS = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "FICTION",
    isbn: "9780743273565",
    price: 12.99,
    description: "A classic novel of the Jazz Age, exploring themes of idealism, resistance to change, social upheaval, and excess.",
    stockQuantity: 15,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=500&fit=crop"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "FICTION",
    isbn: "9780061120084",
    price: 14.99,
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    stockQuantity: 8,
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop"
  },
  {
    id: 3,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "NON_FICTION",
    isbn: "9780062316097",
    price: 18.99,
    description: "Explores the history of humankind from the evolution of archaic human species in the Stone Age up to the twenty-first century.",
    stockQuantity: 12,
    imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=500&fit=crop"
  },
  {
    id: 4,
    title: "The Hidden Life of Trees",
    author: "Peter Wohlleben",
    genre: "SCIENCE",
    isbn: "9781771642484",
    price: 16.50,
    description: "Discover the fascinating world of forests and how trees communicate with each other.",
    stockQuantity: 5,
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=500&fit=crop"
  },
  {
    id: 5,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "TECHNOLOGY",
    isbn: "9780132350884",
    price: 35.99,
    description: "A handbook of agile software craftsmanship that shows how to write clean, maintainable code.",
    stockQuantity: 20,
    imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=500&fit=crop"
  },
  {
    id: 6,
    title: "Steve Jobs",
    author: "Walter Isaacson",
    genre: "BIOGRAPHY",
    isbn: "9781451648539",
    price: 22.99,
    description: "The exclusive biography of Steve Jobs, based on more than forty interviews with Jobs conducted over two years.",
    stockQuantity: 10,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=500&fit=crop"
  },
  {
    id: 7,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "FANTASY",
    isbn: "9780547928227",
    price: 13.75,
    description: "A fantasy novel about the adventures of hobbit Bilbo Baggins in Middle-earth.",
    stockQuantity: 18,
    imageUrl: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=500&fit=crop"
  },
  {
    id: 8,
    title: "The Da Vinci Code",
    author: "Dan Brown",
    genre: "MYSTERY",
    isbn: "9780307474278",
    price: 11.99,
    description: "A mystery thriller novel that follows symbologist Robert Langdon as he investigates a murder in Paris.",
    stockQuantity: 7,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
  }
];

const GENRES = ['ALL', 'FICTION', 'NON_FICTION', 'SCIENCE', 'TECHNOLOGY', 'BIOGRAPHY', 'HISTORY', 'FANTASY', 'MYSTERY'];

const SORT_OPTIONS = [
  { value: 'title', label: 'Title A-Z' },
  { value: 'title_desc', label: 'Title Z-A' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'author', label: 'Author A-Z' },
];

const BookList = () => {
  // State Management
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [useDummyData, setUseDummyData] = useState(false);

  // Helper Functions
  const sortBooks = (booksArray, sortType) => {
    const sorted = [...booksArray];
    switch (sortType) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title_desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'price_low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'author':
        return sorted.sort((a, b) => a.author.localeCompare(b.author));
      default:
        return sorted;
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (genre && genre !== 'ALL') count++;
    if (sortBy !== 'title') count++;
    return count;
  };

  // API Functions
  const fetchBooks = async (pageNum = 0, query = '', selectedGenre = '') => {
    setLoading(true);
    setError('');
    
    // Use dummy data if backend is not available
    if (useDummyData) {
      setTimeout(() => {
        let filteredBooks = [...DUMMY_BOOKS];
        
        // Apply search filter
        if (query) {
          filteredBooks = filteredBooks.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase())
          );
        }
        
        // Apply genre filter
        if (selectedGenre && selectedGenre !== 'ALL') {
          filteredBooks = filteredBooks.filter(book => book.genre === selectedGenre);
        }
        
        // Apply sorting
        filteredBooks = sortBooks(filteredBooks, sortBy);
        
        setBooks(filteredBooks);
        setTotalPages(1);
        setLoading(false);
      }, 800);
      return;
    }

    try {
      let response;
      if (query) {
        response = await bookAPI.search(query, pageNum, 12);
      } else if (selectedGenre && selectedGenre !== 'ALL') {
        response = await bookAPI.getByGenre(selectedGenre, pageNum, 12);
      } else {
        response = await bookAPI.getAll(pageNum, 12);
      }
      
      const booksData = response.data.content || [];
      const sortedBooks = sortBooks(booksData, sortBy);
      
      setBooks(sortedBooks);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books from server. Using demo data instead.');
      setUseDummyData(true);
      fetchBooks(pageNum, query, selectedGenre); // Retry with dummy data
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handlePageChange = (event, value) => {
    const newPage = value - 1;
    setPage(newPage);
    fetchBooks(newPage, searchQuery, genre);
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPage(0);
    fetchBooks(0, query, genre);
  };

  const handleGenreChange = (event) => {
    const selectedGenre = event.target.value;
    setGenre(selectedGenre);
    setPage(0);
    fetchBooks(0, searchQuery, selectedGenre);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setGenre('');
    setSortBy('title');
    setPage(0);
    fetchBooks();
  };

  const toggleDataMode = () => {
    setUseDummyData(!useDummyData);
    setPage(0);
    setTimeout(() => fetchBooks(0, searchQuery, genre), 100);
  };

  // Effects
  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!useDummyData) {
      fetchBooks(page, searchQuery, genre);
    }
  }, [sortBy]);

  // Component Sections
  const renderHeaderSection = () => (
    <Box className="book-list-header">
      <Slide direction="down" in={true} timeout={800}>
        <Box>
          <LocalLibrary className="header-icon" />
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            className="header-title"
          >
            Discover Your Next Read
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            className="header-subtitle"
          >
            Explore our curated collection of books across all genres. Find your next favorite story today!
          </Typography>
        </Box>
      </Slide>
    </Box>
  );

  const renderStatsSection = () => (
    <Box className="stats-section">
      <Box className="stats-chips">
        <Chip 
          icon={<TrendingUp />} 
          label={`${books.length} Books Available`}
          color="primary"
          variant="outlined"
        />
        {getActiveFiltersCount() > 0 && (
          <Chip 
            icon={<FilterList />} 
            label={`${getActiveFiltersCount()} Active Filters`}
            color="secondary"
            size="small"
          />
        )}
      </Box>
      
      <Tooltip title={useDummyData ? "Switch to Live Data" : "Use Demo Data"}>
        <Button
          variant={useDummyData ? "contained" : "outlined"}
          color={useDummyData ? "secondary" : "primary"}
          onClick={toggleDataMode}
          startIcon={useDummyData ? <NewReleases /> : <Star />}
          size="small"
        >
          {useDummyData ? "Demo Mode" : "Live Mode"}
        </Button>
      </Tooltip>
    </Box>
  );

  const renderSearchFilterSection = () => (
    <Card elevation={3} className="search-filter-card">
      <Fade in={true} timeout={1000}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Field */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by title, author, or description..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery('')} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Genre Filter */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" className="filter-control">
              <InputLabel>Genre</InputLabel>
              <Select
                value={genre}
                label="Genre"
                onChange={handleGenreChange}
              >
                {GENRES.map((genreItem) => (
                  <MenuItem key={genreItem} value={genreItem}>
                    {genreItem === 'ALL' ? 'All Genres' : genreItem.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort Options */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" className="filter-control">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
                startAdornment={<Sort sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Clear Filters */}
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              onClick={clearFilters}
              className="clear-filters-button"
              startIcon={<Clear />}
              disabled={!searchQuery && !genre && sortBy === 'title'}
            >
              Clear All
            </Button>
          </Grid>
        </Grid>
      </Fade>
    </Card>
  );

  const renderErrorAlert = () => (
    error && (
      <Alert 
        severity="warning" 
        className="error-alert"
        action={
          <Button color="inherit" size="small" onClick={toggleDataMode}>
            {useDummyData ? 'Try Live Data' : 'Use Demo'}
          </Button>
        }
      >
        {error}
      </Alert>
    )
  );

  const renderLoadingState = () => (
    loading && (
      <Box className="loading-container">
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary" className="loading-text">
          Discovering amazing books...
        </Typography>
      </Box>
    )
  );

  const renderNoBooksFound = () => (
    <Card className="no-books-card">
      <Typography variant="h5" color="text.secondary" className="no-books-title">
        📚 No Books Found
      </Typography>
      <Typography variant="body1" color="text.secondary" className="no-books-text">
        We couldn't find any books matching your criteria. Try adjusting your search or filters.
      </Typography>
      <Button 
        variant="contained" 
        onClick={clearFilters}
        startIcon={<Clear />}
      >
        Clear All Filters
      </Button>
    </Card>
  );

  const renderBooksGrid = () => (
    <>
      <Grid container spacing={3} className="books-grid-container">
        {books.map((book, index) => (
          <Grid item key={book.id} xs={12} sm={6} md={4} lg={3} className="book-grid-item">
            <Slide direction="up" in={true} timeout={500 + (index * 100)}>
              <Box>
                <BookCard book={book} />
              </Box>
            </Slide>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box className="pagination-container">
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            className="pagination"
          />
        </Box>
      )}
    </>
  );

  const renderContent = () => {
    if (loading) {
      return renderLoadingState();
    }

    return (
      <Fade in={!loading} timeout={1000}>
        <Box>
          {books.length === 0 ? renderNoBooksFound() : renderBooksGrid()}
        </Box>
      </Fade>
    );
  };

  // Main Render
  return (
    <Container maxWidth="xl" className="book-list-container">
      {/* Header Section */}
      {renderHeaderSection()}

      {/* Stats & Demo Toggle */}
      {renderStatsSection()}

      {/* Search and Filter Section */}
      {renderSearchFilterSection()}

      {/* Error Alert */}
      {renderErrorAlert()}

      {/* Main Content */}
      {renderContent()}
    </Container>
  );
};

export default BookList;