const { Users } = require("../models");
const {
  getUser,
  createUser,
  isUserExists,
} = require("../services/UserService");
const { ErrorBody } = require("../utils/ErrorBody");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { verifyEmail, encryptPassword } = require("./SecurityController");
const otpGenerator = require("otp-generator");

exports.signInController = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new ErrorBody(400, "Bad Request", errors.array()));
    } else {
      const reqBody = {
        email: req.body.email,
      };

      console.log(verifyEmail(reqBody.email));

      const user = await getUser(reqBody);

      if (!user) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "Invalid Account.", error: true, data: {} });
      } else {
        await bcrypt
          .compare(req.body.password, user.password)
          .then(function (result) {
            result == true;
            console.log(result);
            res.json({ result: true });
          });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.signUpController = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new ErrorBody(400, "Bad Request", errors.array()));
    } else {
      const reqBody = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phNo: req.body.phNo,
      };

      if (reqBody.email && !(await verifyEmail(reqBody.email))) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          message: "Please provide a valid Email.",
          error: true,
          data: { isVendor: null, isMobile: null },
        });
      }

      const user = await isUserExists(reqBody);

      if (user) {
        console.log(user);
        return res.status(401).json({
          message: "User already exists.",
          error: true,
          data: user,
        });
      } else {
        const hashedPass = await encryptPassword(reqBody.password);

        var otp = await otpGenerator.generate(6, {
          upperCase: false,
          specialChars: false,
          alphabets: false,
        });
        const newReqBody = { ...reqBody, password: hashedPass, otp: otp };
        const result = await createUser(newReqBody);
        return res.status(200).json({
          message: "User created.",
          error: false,
          data: result,
        });
        res.redirect();
      }
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({
      message: "Field Property Violation",
      error: true,
      data: err,
    });
    next({});
  }
};

// exports.otpVerification = async (req, res, next) => {
//   try {

//   } catch {

//   }
// }
