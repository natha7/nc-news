const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
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
  getEndpoints,
  getAllTopics,
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
};
