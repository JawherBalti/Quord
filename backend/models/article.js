const mongoose = require("mongoose");
const { Schema } = mongoose;

const Article = mongoose.model("Article", {
  title: {
    type: String,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: String,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  tags: {
    type: Array,
  },
  likes: [{
    type: Schema.Types.ObjectId, // store user IDs who liked
    ref: "Author",
  }],
  dislikes: [{
    type: Schema.Types.ObjectId, // store user IDs who disliked
    ref: "Author",
  }],
});

module.exports = Article;
