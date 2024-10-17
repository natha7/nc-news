const express = require("express");
const { getUsers, getUserByUsername } = require("../controllers");
const router = express.Router({ mergeParams: true });

router.get("/", getUsers);

router.get("/:username", getUserByUsername);

module.exports = router;
