const express = require("express");
const { getAllTopics } = require("../controllers");
const router = express.Router({ mergeParams: true });

router.get("/", getAllTopics);

module.exports = router;
