const db = require("../db/connection.js");

exports.fetchArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "Author does not exist" });
      }
      return rows[0];
    })
    .catch((err) => {
      if (err.code === "22P02") {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      return Promise.reject(err);
    });
};
