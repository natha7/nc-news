const express = require("express");
const {
  handlePsqlErrors,
  handleServerErrors,
  handleCustomErrors,
} = require("./controllers");
const apiRouter = require("./routes/api.router.js");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use("*", (request, response, next) => {
  next({ status: 404, msg: "Please use /api to see endpoint documentation" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
