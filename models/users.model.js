const { user } = require("pg/lib/defaults.js");
const db = require("../db/connection.js");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = (username) => {
  const specialCharacters = /[^a-zA-Z0-9_]/gm;

  if (specialCharacters.test(username)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - username cannot contain special characters",
    });
  }

  return db
    .query(`SELECT username, avatar_url, name FROM users WHERE username = $1`, [
      username,
    ])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No user found with username: ${username}`,
        });
      }
      return rows[0];
    });
};
