const express = require("express");
const articleRoute = require("./routes/article");
const authorRoute = require("./routes/author");
const commentRoute = require("./routes/comment");
const cors = require("cors")
const cloudinary = require('cloudinary').v2

require("./config/connect");

require('dotenv').config()

const app = express();

app.use(express.json())
app.use(cors())

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Endpoint to delete an image
app.post('/delete-image', async (req, res) => {
  const { public_id } = req.body; // The image's public ID
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.use("/articles", articleRoute);
app.use("/comments", commentRoute)
app.use("/author", authorRoute);
app.use("/getImage", express.static("./uploads"))

app.listen(3000, () => {
  console.log("listening on port 3000");
});
