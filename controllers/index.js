const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require("./articles.controller.js");

const { getEndpoints } = require("./endpoints.controller.js");

const { getAllTopics } = require("./topics.controller.js");

const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./errors.controller.js");

const { deleteCommentById } = require("./comments.controller.js");

module.exports = {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteCommentById,
  getEndpoints,
  getAllTopics,
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
};
