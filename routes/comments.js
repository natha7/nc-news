const express = require("express");
const { deleteCommentById } = require("../controllers");
const router = express.Router({ mergeParams: true });

router.delete("/:comment_id", deleteCommentById);

module.exports = router;
