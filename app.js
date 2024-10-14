const express = require("express");
const { getEndpoints } = require("./controllers/endpoints.controller.js");
const { getAllTopics } = require("./controllers/topics.controller");
const {
  handleServerErrors,
  handleCustomErrors,
} = require("./controllers/errors/index.js");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers/articles.controller.js");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
