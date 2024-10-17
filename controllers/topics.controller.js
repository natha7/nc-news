const { fetchAllTopics } = require("../models/topics.model");

exports.getAllTopics = (request, response, next) => {
  fetchAllTopics().then((topics) => {
    return response.status(200).send({ topics });
  });
};
