const endpoints = require("../endpoints.json");

exports.getEndpoints = (request, response) => {
  return response.status(200).send({ endpoints });
};
