const express = require("express");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require("../controllers");
const { postArticle } = require("../controllers/articles.controller");
const router = express.Router({ mergeParams: true });

router.get("/", getArticles);

router.get("/:article_id", getArticleById);

router.get("/:article_id/comments", getCommentsByArticleId);

router.post("/:article_id/comments", postCommentByArticleId);

router.post("/", postArticle);

router.patch("/:article_id", patchArticleById);

module.exports = router;