exports.handlePsqlErrors = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request - invalid type" });
  }
  if (err.code === "23503") {
    response.status(404).send({ msg: "Username does not exist" });
  }
  if (err.code === "23502") {
    response.status(400).send({ msg: "Missing required key(s)" });
  } else next(err);
};

exports.handleCustomErrors = (err, request, response, next) => {
  if (err) {
    response.status(err.status).send({ msg: err.msg });
  } else next();
};

exports.handleServerErrors = (err, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
};
