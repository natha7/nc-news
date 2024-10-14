const handleCustomErrors = (err, request, response, next) => {
  if (err) {
    response.status(err.status).send({ msg: err.msg });
  } else next();
};

module.exports = handleCustomErrors;
