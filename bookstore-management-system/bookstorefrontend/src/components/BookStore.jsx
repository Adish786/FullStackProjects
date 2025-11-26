import React, { useState, useEffect } from 'react';
import './BookStore.css';

const BookStore = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [availableBooks, setAvailableBooks] = useState(0);

  // Sample book data
  const sampleBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic",
      price: "$12.99",
      year: 1925
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
      price: "$14.99",
      year: 1960
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      price: "$11.99",
      year: 1949
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Romance",
      price: "$10.99",
      year: 1813
    },
    {
      id: 5,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      price: "$16.99",
      year: 1937
    },
    {
      id: 6,
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      genre: "Fantasy",
      price: "$18.99",
      year: 1997
    },
    {
      id: 7,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      genre: "Fiction",
      price: "$13.99",
      year: 1951
    },
    {
      id: 8,
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      price: "$24.99",
      year: 1954
    }
  ];

  useEffect(() => {
    // Simulate loading books
    setBooks(sampleBooks);
    setAvailableBooks(sampleBooks.length);
  }, []);

  const filteredAndSortedBooks = books
    .filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'year':
          return b.year - a.year;
        default:
          return 0;
      }
    });

  const handleClearAll = () => {
    setSearchTerm('');
    setSortBy('title');
  };

  const getBookEmoji = (genre) => {
    const emojiMap = {
      'Classic': '📚',
      'Fiction': '📖',
      'Dystopian': '🌅',
      'Romance': '💖',
      'Fantasy': '🐉'
    };
    return emojiMap[genre] || '📕';
  };

  return (
    <div className="bookstore-container">
      {/* Header */}
      <header className="bookstore-header">
        <div className="container">
          <h1>Discover Your Next Read</h1>
          <p>Explore our curated collection of books across all genres. Find your next favorite story today!</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="bookstore-main">
        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-item">
            <span className="status-icon">✔️</span>
            <span className="status-available">{availableBooks} Books Available</span>
          </div>
          <div className="status-item">
            <span className="status-icon">✔️</span>
            <span className="status-live">LIVE MODE</span>
          </div>
        </div>

        {/* Search and Filter Section */}
        <section className="search-filter-section">
          <input
            type="text"
            className="search-box"
            placeholder="Search by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="filter-controls">
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Title A-Z</option>
              <option value="author">Author A-Z</option>
              <option value="year">Newest First</option>
            </select>
            <button 
              className="clear-btn"
              onClick={handleClearAll}
            >
              CLEAR ALL
            </button>
          </div>
        </section>

        {/* Books Grid */}
        <section className="books-grid">
          {filteredAndSortedBooks.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-image">
                {getBookEmoji(book.genre)}
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <span className="book-genre">{book.genre}</span>
                <div className="book-price">{book.price}</div>
              </div>
            </div>
          ))}
        </section>

        {filteredAndSortedBooks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <h3>No books found matching your search criteria.</h3>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bookstore-footer">
        <div className="container">
          <p>&copy; 2025 BookStore. All rights reserved.</p>
          <p></p>
        </div>
      </footer>
    </div>
  );
};

export default BookStore;