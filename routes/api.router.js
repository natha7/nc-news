const express = require("express");
const { getEndpoints } = require("../controllers");
const articlesRouter = require("./articles.router.js");
const usersRouter = require("./users.router.js");
const topicsRouter = require("./topics.router.js");
const commentsRouter = require("./comments.router.js");
const router = express.Router({ mergeParams: true });

router.get("/", getEndpoints);

router.use("/articles", articlesRouter);

router.use("/users", usersRouter);

router.use("/topics", topicsRouter);

router.use("/comments", commentsRouter);

module.exports = router;
