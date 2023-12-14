const express = require("express");
const welcomeMessage = require("../controllers/home_controller");
const router = express.Router();

// Home page endpoint
router.get("/", welcomeMessage);

module.exports = router;
