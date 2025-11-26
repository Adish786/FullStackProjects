import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import BookList from './components/BookList'
import Login from './components/Login'
import Register from './components/Register'
import OrderList from './components/OrderList'
import BookStore from './components/BookStore' // Import the new BookStore component

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
    },
    secondary: {
      main: '#FF8F00',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<BookStore />} /> {/* Updated to use BookStore */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/books" element={<BookList />} /> {/* Keep original BookList route */}
              <Route path="/bookstore" element={<BookStore />} /> {/* Additional route for BookStore */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App