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
  patchArticleById,
  deleteCommentById,
  getUsers,
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

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.all("*", (request, response, next) => {
  next({ status: 404, msg: "Not found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
