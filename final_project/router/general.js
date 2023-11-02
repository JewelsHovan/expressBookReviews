const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    const userExists = users.find(user => user.username === username);
    if(userExists){
      res.status(400).send("User already exists");
    }else{
      users.push({ username: username, password: password });
      res.status(200).send("User registered successfully");
    }
  } else{
    if(!username){
      res.status(400).send("Username is required");
    }
    if(!password){
      res.status(400).send("Password is required");
    }
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  res.send(JSON.stringify(books[req.params.isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];
  for(let id in books){
    if(books[id].author === author){
      booksByAuthor.push(books[id]);
        }
    }
    if(booksByAuthor.length > 0){
      res.send(JSON.stringify(booksByAuthor,null,4));
    }else{
      res.send(`No books found by author ${author}`);
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookByTitle = [];
  for(let id in books){
      if(books[id].title === title){
          bookByTitle.push(books[id]);
      }
  }
  if(bookByTitle.length > 0){
      res.send(JSON.stringify(bookByTitle[0], null, 4));
  } else{
      res.send(`Book with title ${title} not found`)
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
      res.status(404).send('Book not found');
  }
});


const axios = require('axios');
// Tasks -> using Async/await

// Using async/await for getting List of Books available
public_users.get('/books-async', async (req, res) => {
  try {
    const response = await axios.get('https://julienh15-6000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching books');
  }
});

// Using async/await get book based on ISBN
public_users.get('/book-by-isbn-async/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`https://julienh15-6000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching book by ISBN');
  }
});

// Using async/await to get book details based on author
public_users.get('/books-by-author-async/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`https://julienh15-6000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching books by author');
  }
});

// Using async/await getting book details based on Title
public_users.get('/books-by-title-async/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`https://julienh15-6000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching books by title');
  }
});

module.exports.general = public_users;
