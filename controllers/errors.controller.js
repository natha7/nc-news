exports.handlePsqlErrors = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ status: 400, msg: "Bad request" });
  }
  if (err.code === "23503") {
    response.status(404).send({ status: 404, msg: "Not found" });
  }
  if (err.code === "23502") {
    response.status(400).send({ status: 400, msg: "Bad request" });
  } else next(err);
};

exports.handleCustomErrors = (err, request, response, next) => {
  if (err) {
    response.status(err.status).send({ status: err.status, msg: err.msg });
  } else next();
};

exports.handleServerErrors = (err, request, response, next) => {
  response.status(500).send({ status: 500, msg: "Internal Server Error" });
};
