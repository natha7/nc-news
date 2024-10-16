const db = require("../db/connection.js");
const format = require("pg-format");

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

exports.fetchArticles = (sort_by = "created_at", order = "DESC", topic) => {
  order = order.toUpperCase();
  sort_by = sort_by.toLowerCase();

  const validQueries = [
    "article_id",
    "author",
    "topic",
    "created_at",
    "votes",
    "comment_count",
    "title",
  ];
  const validOrders = ["DESC", "ASC"];

  const queryValues = [];
  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.body) AS INTEGER) AS comment_count FROM articles 
  LEFT OUTER JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryString += ` GROUP BY articles.article_id`;

  if (validQueries.includes(sort_by) && validOrders.includes(order)) {
    queryString += ` ORDER BY %I %s`;
    queryString = format(queryString, sort_by, order);
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db.query(queryString, queryValues).then(({ rows }) => {
    if (rows.length === 0 && topic) {
      return Promise.reject({
        status: 404,
        msg: `No articles on ${topic} found`,
      });
    }
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

exports.updateArticleVotesById = (id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
