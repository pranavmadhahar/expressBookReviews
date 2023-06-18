const express = require('express');
const jwt = require('jsonwebtoken');

let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let givenuser = users.filter((user) => {
    return user.username === username;
  });
  if (givenuser.length > 0) {
    return true;
  } else {
    return false;
  }
}

//For registering a new user//

regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password){

    if(!isValid (username)){
      users.push({"username": username, "password": password})
      return res.status(200).json({message: "Success: Now you can login"});
    }
    else{
      res.status(404).json({message: "Error: User already exists!"}); 
    }
  }
  return res.status(404).json({message: "Error: Unable to register user."});

});

const authenticatedUser = (username,password)=>{ 
  let authuser = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (authuser.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password){
  return res.status(404).json({message: "Error logging in"});
  };

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60*60});

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("Success: User successfully logged in");
  }
  else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book){
    let review = req.query.review;
    let user = req.session.authorization['username'];
    if (review && user){
      book["reviews"] = {user: review}
    }
  }
  else{
    return res.status(208).json({message: "Invalid ISBN"});
  }


  return res.status(300).send(`Your review is successfully posted for ISBN: ${isbn}`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let book = books[isbn];
  let review = book.reviews;
  let user = req.session.authorization["username"];
  if (user){
    delete review[user];
  }
  res.send(`Success: Your review: "${review.user}" deleted successfully for ISBN : ${isbn}.`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
