const { call } = require("../app");
const { fetchAllTopics, insertTopic } = require("../models/topics.model");

exports.getAllTopics = (request, response, next) => {
  fetchAllTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

exports.postTopic = (request, response, next) => {
  const { slug, description } = request.body;
  insertTopic(slug, description)
    .then((topic) => {
      response.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
