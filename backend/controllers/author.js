const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Author = require("../models/author");

const register = (req, res) => {
    const data = req.body;
  
    Author.findOne({email: data.email})
    .then(author => {
      if(author) {
        return res.status(400).send("Email already exists");
      } else {
        const newAuthor = new Author(data);
      
        const salt = bcrypt.genSaltSync(10);
        newAuthor.password = bcrypt.hashSync(data.password, salt);
      
        newAuthor
          .save()
          .then((author) => {
            res.status(200).send(author);
          })
          .catch((err) => res.status(400).send(err));
      }
    })
  }

  const login = (req, res) => {
    let data = req.body;
    Author.findOne({ email: data.email })
      .then((author) => {
        if (!author) {
          return res.status(400).send("Invalid email or password");
        } else
          bcrypt
            .compare(data.password, author.password)
            .then((valid) => {
              if (!valid) {
                res.status(400).send("Invalid email or password");
              } else {
                let payload = {
                  _id: author._id,
                  email: author.email,
                  name: author.name,
                  lastName: author.lastName,
                  image: author.image,
                };
  
                let token = jwt.sign(payload, process.env.JWT_SECRET);
  
                res.send({ myToken: token, author: payload });
              }
            })
            .catch((err) => {
              res.status(500).send(err);
            });
      })
      .catch((err) => res.status(400).send(err));
  }

  const getAllAuthors = (req, res) => {
    Author.find({})
      .then((author) => res.status(200).send(author))
      .catch((err) => res.status(400).send(err));
  }

  const getAuthorById = (req, res) => {
    let id = req.params.id;
    Author.findOne({ _id: id })
      .then((author) => res.status(200).send(author))
      .catch((err) => res.status(400).send(err));
  }

  const deleteAuthor = (req, res) => {
    let id = req.body.id;
    Author.findByIdAndDelete({ _id: id })
      .then((author) => res.status(200).send(author))
      .catch((err) => res.status(400).send(err));
  }

  const updateAuthor = (req, res) => {
    let id = req.params.id;
  
      Author.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
      })
        .then((author) => {
          let payload = {
            _id: author._id,
            email: author.email,
            fullname: author.name + " " + author.lastName,
            image: author.image,
          };
          let token = jwt.sign(payload, process.env.JWT_SECRET);
          res.send({ author: author, myToken: token });
        })
        .catch((err) => res.send(err));
    
  }

  module.exports = {register, login, getAllAuthors, getAuthorById, deleteAuthor, updateAuthor}