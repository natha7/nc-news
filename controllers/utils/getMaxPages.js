const db = require("../../db/connection.js");

exports.getMaxArticlePages = (limit) => {
  return db.query(`SELECT title FROM articles`).then(({ rows }) => {
    const numberOfArticles = rows.length;
    return Math.ceil(numberOfArticles / limit);
  });
};
