const express = require("express");
const { getAllTopics } = require("../controllers");
const { postTopic } = require("../controllers/topics.controller");
const router = express.Router({ mergeParams: true });

router.get("/", getAllTopics);

router.post("/", postTopic);

module.exports = router;
