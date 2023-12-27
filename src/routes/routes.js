const express = require("express");
const router = express.Router();
require("dotenv").config();

const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes")

router.use('/',userRoutes)
router.use('/',authRoutes)

module.exports = router;

















