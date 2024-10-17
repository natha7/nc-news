const {
  removeCommentById,
  updateCommentById,
} = require("../models/comments.model");

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

exports.patchCommentById = (request, response, next) => {
  const id = request.params.comment_id;
  const { inc_votes } = request.body;

  updateCommentById(id, inc_votes)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
