const express = require("express");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  getEndpoints,
  getAllTopics,
  handlePsqlErrors,
  handleServerErrors,
  handleCustomErrors,
} = require("./controllers");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
