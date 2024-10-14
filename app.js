const express = require("express");
const { getEndpoints } = require("./controllers/getEndpoints.controller.js");
const { getAllTopics } = require("./controllers/topics.controller");
const { handleServerErrors } = require("./controllers/errors/index.js");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getAllTopics);

app.use(handleServerErrors);

module.exports = app;
