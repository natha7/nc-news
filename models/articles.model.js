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

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.body) AS INTEGER) AS comment_count FROM articles
      JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No articles found" });
      }
      return rows;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
