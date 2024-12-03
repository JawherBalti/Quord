const articlesController = require("../controllers/articles")
const express = require("express");
const isAuth = require("../middleware/isAuth");
const isOwner = require("../middleware/isOwner");
const router = express.Router();

router.post("/create", isAuth, articlesController.createArticle);
router.get("/all", articlesController.getArticles);
router.get("/getById/:id", articlesController.getArticleById);
router.get("/getByAuthorId/:id", articlesController.getArticleByAuthorId);
router.delete("/delete/:id", isAuth, isOwner, articlesController.deleteArticle);
router.patch("/update/:id", isAuth, isOwner, articlesController.updateArticle);
router.post("/article/:id/like", isAuth, articlesController.likeArticle);
router.post("/article/:id/dislike", isAuth, articlesController.dislikeArticle);

module.exports = router;
