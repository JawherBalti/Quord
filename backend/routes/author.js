const authorsController = require("../controllers/author")
const isAuth = require("../middleware/isAuth");
const express = require("express");
const router = express.Router();

router.post("/register", authorsController.register);
router.post("/login", authorsController.login);
router.get("/all", authorsController.getAllAuthors);
router.get("/getById/:id", authorsController.getAuthorById);
router.delete("/delete/:id", isAuth, authorsController.deleteAuthor);
router.patch("/update/:id", isAuth, authorsController.updateAuthor);

module.exports = router;
