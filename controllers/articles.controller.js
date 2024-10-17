const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleVotesById,
  insertArticle,
} = require("../models/articles.model");
const { fetchUserByUsername } = require("../models/users.model");
const { getTopicByName } = require("./utils/getTopicByName");

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
  const { sort_by, order, topic, limit, p } = request.query;
  const getParams = [sort_by, order, topic, limit, p];

  fetchArticles(...getParams)
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

exports.postCommentByArticleId = (request, response, next) => {
  const id = request.params.article_id;
  const commentToPost = request.body;

  const checkArticleInsertComment = [
    fetchArticleById(id),
    insertCommentByArticleId(id, commentToPost),
  ];

  Promise.all(checkArticleInsertComment)
    .then((results) => {
      response.status(201).send({ comment: results[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (request, response, next) => {
  const id = request.params.article_id;
  const { inc_votes } = request.body;

  const checkArticleUpdateVotes = [
    fetchArticleById(id),
    updateArticleVotesById(id, inc_votes),
  ];

  Promise.all(checkArticleUpdateVotes)
    .then((results) => {
      response.status(200).send({ article: results[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (request, response, next) => {
  const { author, title, body, topic, article_img_url } = request.body;

  if (!author || !title || !body || !topic) {
    next({ status: 400, msg: "Bad request" });
  }

  const checkUserCheckTopicInsertArticle = [
    fetchUserByUsername(author),
    getTopicByName(topic),
    insertArticle(author, title, body, topic, article_img_url),
  ];

  Promise.all(checkUserCheckTopicInsertArticle)
    .then((results) => {
      response.status(201).send({ article: results[2] });
    })
    .catch((err) => {
      next(err);
    });
};
