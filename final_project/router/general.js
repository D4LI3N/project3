const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

// Get the book list available in the shop
public_users.axios.get('/',async (req, res) =>{
  //Write your code here
  const response = await JSON.stringify(books,null,4);
 res.send(response);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let foundBook = await books[isbn];
  if(!foundBook){
    return res.status(300).json({message: "ISBN not found"});
  } else {
    return res.send(JSON.stringify(foundBook));
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  //Write your code here
  let author = req.params.author;
  let bookArr = Object.values(books);
  let foundBooks = await bookArr.filter((book)=>{
    return book.author === author;
  });
  if(foundBooks){
    res.send(JSON.stringify(foundBooks));
  } else {
    return res.status(300).json({message: "Book not found"});
  }
  
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  //Write your code here
  let title = req.params.title;
  let bookArr = Object.values(books);
  let foundBooks = await bookArr.filter((book)=>{
    return book.title === title;
  });
  if(foundBooks){
    res.send(JSON.stringify(foundBooks));
  } else {
    return res.status(300).json({message: "Book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let foundBook = books[isbn];
  if(!foundBook){
    return res.status(300).json({message: "ISBN not found"});
  } else {
    return res.send(JSON.stringify(foundBook.reviews));
  }
});

module.exports.general = public_users;
