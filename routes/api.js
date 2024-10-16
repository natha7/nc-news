const express = require("express");
const { getEndpoints } = require("../controllers");
const articlesRouter = require("./articles.js");
const usersRouter = require("./users.js");
const topicsRouter = require("./topics.js");
const commentsRouter = require("./comments.js");
const router = express.Router({ mergeParams: true });

router.get("/", getEndpoints);

router.use("/articles", articlesRouter);

router.use("/users", usersRouter);

router.use("/topics", topicsRouter);

router.use("/comments", commentsRouter);

module.exports = router;
