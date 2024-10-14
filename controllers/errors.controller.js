exports.handleCustomErrors = (err, request, response, next) => {
  if (err) {
    response.status(err.status).send({ msg: err.msg });
  } else next();
};

exports.handleServerErrors = (err, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
};
