const { getMaxArticlePages } = require("../controllers/utils/getMaxPages.js");
const db = require("../db/connection.js");
const format = require("pg-format");

exports.fetchArticleById = (id) => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.body, articles.votes, articles.article_img_url, CAST(COUNT(comments.body) AS INTEGER) AS comment_count FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic,
  limit,
  p
) => {
  order = order.toUpperCase();
  sort_by = sort_by.toLowerCase();

  limit = Number(limit);
  p = Number(p);

  if (!p || Number.isNaN(p) || p <= 0) {
    p = 1;
  }

  if (!limit || Number.isNaN(limit) || limit <= 0) {
    limit = 10;
  }

  p = (p - 1) * limit;

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
    queryValues.push(topic);
    queryString += ` WHERE articles.topic = $${queryValues.length}`;
  }

  queryString += ` GROUP BY articles.article_id`;

  if (validQueries.includes(sort_by) && validOrders.includes(order)) {
    queryString += ` ORDER BY %I %s`;
    queryString = format(queryString, sort_by, order);
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (typeof limit === "number" && typeof p === "number") {
    return getMaxArticlePages(limit)
      .then((maxPages) => {
        maxPages = (maxPages - 1) * limit;
        if (p > maxPages) {
          queryValues.push(limit);
          queryString += ` LIMIT $${queryValues.length}`;
          queryValues.push(maxPages);
          queryString += ` OFFSET $${queryValues.length}`;
        } else {
          queryValues.push(limit);
          queryString += ` LIMIT $${queryValues.length}`;
          queryValues.push(p);
          queryString += ` OFFSET $${queryValues.length}`;
        }
      })
      .then(() => {
        return db.query(queryString, queryValues).then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not found" });
          }
          return rows;
        });
      });
  }
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

exports.insertArticle = (author, title, body, topic, article_img_url) => {
  const queryVals = [author, title, body, topic];
  let queryString = `INSERT into articles (author, title, body, topic`;

  if (article_img_url) {
    queryVals.push(article_img_url);
    queryString += `, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING article_id`;
  } else {
    queryString += `) VALUES ($1, $2, $3, $4) RETURNING article_id`;
  }
  return db
    .query(queryString, queryVals)
    .then(({ rows }) => {
      const { article_id } = rows[0];

      return db.query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, articles.body, CAST(COUNT(comments.body) AS INTEGER) AS comment_count FROM articles 
        LEFT OUTER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
        GROUP BY articles.article_id`,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
