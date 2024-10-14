const handleServerErrors = (error, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
};

module.exports = handleServerErrors;
