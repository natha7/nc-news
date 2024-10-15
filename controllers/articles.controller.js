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

  const getArticleGetComments = [
    fetchArticleById(id),
    fetchCommentsByArticleId(id),
  ];

  Promise.all(getArticleGetComments)
    .then((results) => {
      response.status(200).send({ comments: results[1] });
    })
    .catch((err) => {
      next(err);
    });
};
