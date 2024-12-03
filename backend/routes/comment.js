const commentController = require("../controllers/comment");
const express = require("express");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

router.post("/create", isAuth, commentController.createComment);


module.exports = router;
