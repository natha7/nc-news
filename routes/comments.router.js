const express = require("express");
const { deleteCommentById } = require("../controllers");
const { patchCommentById } = require("../controllers/comments.controller");
const router = express.Router({ mergeParams: true });

router.delete("/:comment_id", deleteCommentById);

router.patch("/:comment_id", patchCommentById);

module.exports = router;
