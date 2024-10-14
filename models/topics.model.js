const db = require("../db/connection.js");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * from topics`).then(({ rows }) => {
    return rows;
  });
};
