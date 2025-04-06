const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");
const { protect } = require("../middleware/authMiddleWare");

router.post("/url", protect, urlController.createShortUrl); // Protected route
router.get("/:shortId", urlController.getOgUrl); // Public route

module.exports = router;
