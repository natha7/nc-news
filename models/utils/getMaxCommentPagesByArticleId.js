const db = require("../../db/connection.js");

exports.getMaxCommentPagesByArticleId = (limit, id) => {
  return db
    .query(`SELECT comment_id FROM comments WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      const numberOfComments = rows.length;
      return Math.ceil(numberOfComments / limit);
    });
};
