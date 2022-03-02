const express = require("express");
const {
  signUpController,
  signInController,
} = require("../controllers/UserController");
const router = express.Router();
const { body } = require("express-validator");

const signinValidator = [
  body("email").trim().notEmpty(),
  body("password").trim().isLength({ min: 6, max: 50 }),
];

router.post("/signin", signinValidator, signInController);

router.post("/signup", signinValidator, signUpController);

// router.post("/signup/otp", otpVerification, )

module.exports = router;
