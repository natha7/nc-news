const { getMaxArticlePages } = require("./getMaxArticlePages");
const {
  getMaxCommentPagesByArticleId,
} = require("./getMaxCommentPagesByArticleId");
const { pAndLimitConverter } = require("./pAndLimitConverter");

module.exports = {
  getMaxArticlePages,
  getMaxCommentPagesByArticleId,
  pAndLimitConverter,
};
