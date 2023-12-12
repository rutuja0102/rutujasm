const express = require("express");
const router = express.Router();
require("dotenv").config();

const userRoutes = require("./userRoutes");

router.use('/',userRoutes)

module.exports = router;

















