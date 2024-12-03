const Article = require("../models/article");
const Comment = require("../models/comment");


// New methods for comment management
const createComment = async (req, res) => {
    const { articleId, authorId, content } = req.body;
  
    try {
      const newComment = new Comment({
        content,
        authorId,
        articleId
      });
  
      const savedComment = await newComment.save();
  
      // Add the new comment to the article
      await Article.findByIdAndUpdate(
        articleId,
        { $push: { comments: savedComment._id } },
        { new: true }
      );
  
      res.status(201).json(savedComment);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

module.exports = {createComment}