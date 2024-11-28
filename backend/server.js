const express = require("express");
const articleRoute = require("./routes/article");
const authorRoute = require("./routes/author");
const cors = require("cors")

require("./config/connect");

const app = express();

app.use(express.json())
app.use(cors())

app.use("/articles", articleRoute);
app.use("/author", authorRoute);
app.use("/getImage", express.static("./uploads"))

app.listen(3000, () => {
  console.log("listening on port 3000");
});
