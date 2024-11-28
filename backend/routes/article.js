const express = require("express");
const Article = require("../models/article");
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router();

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

router.post("/create", upload.any("image"), (req, res) => {
  let data = req.body;
  let article = new Article(data);
  article.date = new Date();
  article.authorId = data.authorId;
  article.image = fileName;
  article.tags = data.tags.split(",");
  article
    .save()
    .then((saved) => {
      fileName = "";
      res.status(200).send(saved);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/all", async (req, res) => {
  const page = parseInt(req.query.page || "0");
  const limit = parseInt(req.query.limit || "4");

  const startIndex = page * limit;

  try {
    const articlesCount = await Article.countDocuments({});

    const articles = await Article.find({})
      .populate("authorId", "name lastName image")
      .populate("likes", "name lastName image")
      .populate("dislikes", "name lastName image")
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      totalArticles: articlesCount,
      currentPage: page,
      totalPages: Math.ceil(articlesCount / limit),
      articles: articles,
    });
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getById/:id", async (req, res) => {
  let id = req.params.id;

  Article.findOne({ _id: id })
    .populate("authorId", "name lastName image")
    .populate("likes", "name lastName image")
    .populate("dislikes", "name lastName image")
    .then((article) => {
      if (!article) {
        res.status(404).send("Article not found");
      } else {
        res.status(200).json(article);
      }
    })
    .catch((err) => {
      console.error("Error fetching article:", err);
      res.status(400).json({ error: "Bad Request" });
    });
});

router.get("/getByAuthorId/:id", (req, res) => {
  let id = req.params.id;
  Article.find({ authorId: id })
    .populate("authorId", "name lastName image")
    .populate("likes", "name lastName image")
    .populate("dislikes", "name lastName image")
    .then((articles) => res.status(200).send(articles))
    .catch((err) => res.status(400).send(err));
});

router.delete("/delete/:id", (req, res) => {
  let id = req.params.id;
  Article.findByIdAndDelete({ _id: id })
    .then((articles) => res.status(200).send(articles))
    .catch((err) => res.status(400).send(err));
});

router.put("/update/:id", upload.any("image"), (req, res) => {
  let id = req.params.id;
  let data = req.body;
  data.tags = data.tags.split(",");

  if (fileName.length > 0) {
    data.image = fileName;
  }

  Article.findByIdAndUpdate({ _id: id }, data)
    .then((articles) => {
      fileName = "";
      res.status(200).send(articles);
    })
    .catch((err) => res.status(400).send(err));
});

router.post("/article/:id/like", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(`${req.body.userId}`); // Ensure userId is an ObjectId
    const articleId = req.params.id;

    const article = await Article.findById(articleId);

    // Remove user from dislikes and add to likes if they disliked the article before
    if (article.dislikes.some((id) => id.equals(userId))) {
      article.dislikes.pull(userId);
      article.likes.push(userId);
    }

    // Remove user from likes if they liked the article before
    else if (article.likes.some((id) => id.equals(userId))) {
      article.likes.pull(userId);
    }

    // Add user to likes if not already liked
    else if (!article.likes.some((id) => id.equals(userId))) {
      article.likes.push(userId);
    }

    await article.save();
    res.status(200).send(article);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST route to dislike an article
router.post("/article/:id/dislike", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(`${req.body.userId}`); // Ensure userId is an ObjectId
    const articleId = req.params.id;

    const article = await Article.findById(articleId).populate(
      "dislikes",
      "name lastName image"
    );

    // Remove user from likes and add to dislikes if they liked the article before
    if (article.likes.some((id) => id.equals(userId))) {
      article.likes.pull(userId);
      article.dislikes.push(userId);
    }

    // Remove user from dislikes if they disliked the article before
    else if (article.dislikes.some((id) => id.equals(userId))) {
      article.dislikes.pull(userId);
    }

    // Add user to dislikes if not already disliked
    else if (!article.dislikes.some((id) => id.equals(userId))) {
      article.dislikes.push(userId);
    }

    await article.save();
    res.status(200).send(article);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
