import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";

const App = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '', genre: '' });

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/books?search=${search}`);
        setBooks(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBooks();
  }, [search]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/books', newBook);
      setBooks([...books, response.data]);
      setNewBook({ title: '', author: '', genre: '' });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <h1>Book Collection</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title or author"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Add Book Form */}
      <form onSubmit={handleAddBook}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newBook.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={newBook.author}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={newBook.genre}
          onChange={handleInputChange}
        />
        <button type="submit">Add Book</button>
      </form>

      {/* Book List */}
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>{book.genre}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
