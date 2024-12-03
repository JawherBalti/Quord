const mongoose = require("mongoose");
const { Schema } = mongoose;

const Comment = mongoose.model("Comment", {
    content: {
    type: String,
    required: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "Author",
    required: true
  },
  articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article",
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Comment