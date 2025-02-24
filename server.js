const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// App setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Book model
const Book = mongoose.model('Book', new mongoose.Schema({
  title: String,
  author: String,
  genre: String
}));

// Add a new book
app.post('/api/books', async (req, res) => {
  const { title, author, genre } = req.body;
  const newBook = new Book({ title, author, genre });
  await newBook.save();
  res.status(201).send(newBook);
});

// Get all books with optional search filter
app.get('/api/books', async (req, res) => {
  const { search } = req.query;
  const filter = search ? {
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } }
    ]
  } : {};
  const books = await Book.find(filter);
  res.status(200).send(books);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
