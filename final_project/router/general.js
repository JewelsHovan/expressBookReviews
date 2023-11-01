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
    if(booksByAuthor.length > 0){
      res.send(JSON.stringify(booksByAuthor,null,4));
    }else{
      res.send("No books found");
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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

module.exports.general = public_users;
