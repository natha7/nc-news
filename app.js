const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { handleServerErrors } = require("./controllers/errors/index.js");

const app = express();

app.get("/api/topics", getAllTopics);

app.use(handleServerErrors);

module.exports = app;
