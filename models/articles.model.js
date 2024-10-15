const db = require("../db/connection.js");

exports.fetchArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return rows[0];
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
    });
};

exports.fetchCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC
      `,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentByArticleId = (id, commentToPost) => {
  const { username, body } = commentToPost;
  const commentKeys = Object.keys(commentToPost);

  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Invalid comment format",
    });
  }

  return db
    .query(
      `INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3) RETURNING *`,
      [body, username, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
