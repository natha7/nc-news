const { fetchUsers, fetchUserByUsername } = require("../models/users.model");

exports.getUsers = (request, response, next) => {
  fetchUsers().then((users) => {
    return response.status(200).send({ users });
  });
};

exports.getUserByUsername = (request, response, next) => {
  const { username } = request.params;
  fetchUserByUsername(username)
    .then((user) => {
      return response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
