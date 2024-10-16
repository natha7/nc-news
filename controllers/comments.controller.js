const { removeCommentById } = require("../models/comments.model");

exports.deleteCommentById = (request, response, next) => {
  const id = request.params.comment_id;
  removeCommentById(id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
