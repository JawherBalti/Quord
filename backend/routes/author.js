const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Author = require("../models/author");

let fileName = "";
const myStorage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, redirect) => {
    let date = Date.now();
    let fl = date + "." + file.mimetype.split("/")[1];
    redirect(null, fl);
    fileName = fl;
  },
});

const upload = multer({ storage: myStorage });

router.post("/register", upload.any("image"), (req, res) => {
  const data = req.body;

  Author.findOne({email: data.email})
  .then(author => {
    if(author) {
      return res.status(400).send("Email already exists");
    } else {
      const newAuthor = new Author(data);
      newAuthor.image = fileName;  
    
      const salt = bcrypt.genSaltSync(10);
      newAuthor.password = bcrypt.hashSync(data.password, salt);
    
      newAuthor
        .save()
        .then((author) => {
          fileName = "";
          res.status(200).send(author);
        })
        .catch((err) => res.status(400).send(err));
    }
  })
});

router.post("/login", (req, res) => {
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

              let token = jwt.sign(payload, "Th15 15 A 53Cr3T");

              res.send({ myToken: token, author: payload });
            }
          })
          .catch((err) => {
            res.status(500).send(err);
          });
    })
    .catch((err) => res.status(400).send(err));
});

router.get("/all", (req, res) => {
  Author.find({})
    .then((author) => res.status(200).send(author))
    .catch((err) => res.status(400).send(err));
});

router.get("/getById/:id", (req, res) => {
  let id = req.params.id;
  Author.findOne({ _id: id })
    .then((author) => res.status(200).send(author))
    .catch((err) => res.status(400).send(err));
});

router.delete("/delete/:id", (req, res) => {
  let id = req.body.id;
  Author.findByIdAndDelete({ _id: id })
    .then((author) => res.status(200).send(author))
    .catch((err) => res.status(400).send(err));
});

router.patch("/update/:id", upload.any("image"), (req, res) => {
  let id = req.params.id;

  if (fileName) {
    Author.findOneAndUpdate(
      { _id: id },
      { image: fileName },
      {
        new: true,
        runValidators: true,
      }
    )
      .then((author) => {
        fileName = "";
        let payload = {
          _id: author._id,
          email: author.email,
          fullname: author.name + " " + author.lastName,
          image: author.image,
        };
        let token = jwt.sign(payload, "Th15 15 A 53Cr3T");

        res.send({ author: author, myToken: token });
      })
      .catch((err) => res.send(err));
  } else {
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
        let token = jwt.sign(payload, "Th15 15 A 53Cr3T");
        res.send({ author: author, myToken: token });
      })
      .catch((err) => res.send(err));
  }
});

module.exports = router;
