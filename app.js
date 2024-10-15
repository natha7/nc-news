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
  postCommentByArticleId,
  updateArticleById,
  patchArticleById,
} = require("./controllers");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
