const jwt = require('jsonwebtoken');
const Author = require('../models/author');

const isAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the same secret as in your login function
    const user = await Author.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send("Please authenticate");
  }
};

module.exports = isAuth;
