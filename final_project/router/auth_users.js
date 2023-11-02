const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const secretKey = 'fingerprint_customer'; // same as your session secret


let users = [];

const isValid = (username) => {
  // check if user is in users array
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  // check if user with given username and password exists in users array
  return users.some(user => user.username === username && user.password === password);
}

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (authenticatedUser(username, password)) {
      const token = jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ message: "Login successful", token: token });
  } else {
      res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.post("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the format: Bearer <token>
  const decoded = jwt.verify(token, secretKey);
  const username = decoded.username;

  if (books[isbn]) {
    books[isbn].reviews[username] = review; // add new review or modify existing one
    res.status(200).send("Review added/updated successfully");
  } else {
    res.status(404).send('Book not found');
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the format: Bearer <token>
  const decoded = jwt.verify(token, secretKey);
  const username = decoded.username;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username]; // delete the review
      res.status(200).send("Review deleted successfully");
    } else {
      res.status(404).send('Review not found');
    }
  } else {
    res.status(404).send('Book not found');
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
