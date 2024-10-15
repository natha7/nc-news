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

module.exports = {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  getEndpoints,
  getAllTopics,
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
};
