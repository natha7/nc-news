const { fetchAllTopics } = require("../models/topics.model");

exports.getAllTopics = (request, response, next) => {
  fetchAllTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
