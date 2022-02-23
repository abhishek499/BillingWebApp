const express = require("express");
const { getUser, createUser } = require("../controllers/UserController");
const router = express.Router();
const { Users } = require("../models");

router.get("/", getUser);

router.post("/", createUser);

module.exports = router;
