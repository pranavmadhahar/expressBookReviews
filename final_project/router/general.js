const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  
  let fetchbooks = new Promise ((resolve, reject) => {

    resolve(JSON.stringify(books));
  })
  fetchbooks.then((value) => {
    res.send(value)
  })
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  let bookdetails = new Promise((resolve, reject) => {
      let isbn = req.params.isbn;
      resolve(books[isbn]);
  })
  
  bookdetails.then((value) => {
    res.send(value);
  })
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  let books_author = new Promise ((resolve, reject) => {
    const givenauthor = req.params.author;
    const booksArray = Object.values(books);
    resolve(booksArray.filter((book) => 
      book.author === givenauthor
    ))
  });
  books_author.then((value) => {
    res.send(value)
  })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  const books_title = new Promise((resolve, reject) => {
    const giventitle = req.params.title;
    const booksArray = Object.values(books);
    resolve(booksArray.filter((book) => 
      book.title === giventitle
    ))
  });
  books_title.then((value) => {
    res.send(value);
  })

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  let review = book.reviews;
  res.send("reviews: " + JSON.stringify(review, null, 4));
});

module.exports.general = public_users;
