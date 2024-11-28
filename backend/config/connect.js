const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://jawher94:ZrjHNQ3U1v2QeONg@cluster0.4gdzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

module.exports = mongoose
