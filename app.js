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

app.all("*", (request, response, next) => {
  next({ status: 404, msg: "Not found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
