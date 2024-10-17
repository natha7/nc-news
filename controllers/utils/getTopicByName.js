const db = require("../../db/connection.js");

exports.getTopicByName = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE topics.slug = $1`, [topic])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      }
      return rows[0];
    });
};
