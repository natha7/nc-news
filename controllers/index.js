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

const { getUsers, getUserByUsername } = require("./users.controller.js");

module.exports = {
  getUsers,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteCommentById,
  getEndpoints,
  getUserByUsername,
  getAllTopics,
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
};
