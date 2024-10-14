const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
} = require("../models/articles.model");

exports.getArticleById = (request, response, next) => {
  const id = request.params.article_id;
  fetchArticleById(id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        next({ status: 400, msg: "Bad request" });
      }
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (request, response, next) => {
  const id = request.params.article_id;

  fetchCommentsByArticleId(id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        next({ status: 400, msg: "Bad request" });
      }
      next(err);
    });
};
