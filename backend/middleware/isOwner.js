// articleOwnershipMiddleware.js

const Article = require('../models/article');

const isOwner = async (req, res, next) => {
  try {
    const articleId = req.params.id || req.body.articleId; // Get article ID from params or body
    
    if (!articleId) {
      throw new Error('No article ID provided');
    }

    const article = await Article.findById(articleId);
    if (!article) {
      throw new Error('Article not found');
    }

    if (article.authorId.toString() !== req.user._id.toString()) {
      throw new Error('User is not the author of this article');
    }

    req.article = article;
    next();
  } catch (error) {
    res.status(403).send({ error: 'Forbidden' });
  }
};

module.exports = isOwner
