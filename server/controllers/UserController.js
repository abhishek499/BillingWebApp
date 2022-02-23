const { Users } = require("../models");
const {
  getUser,
  createUser,
  isUserExists,
} = require("../services/UserService");
const { ErrorBody } = require("../utils/ErrorBody");

exports.getUser = async (req, res, next) => {
  try {
    const listOfUsers = await getUser();
    res.json(listOfUsers);
  } catch (err) {
    console.log(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const reqBody = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phNo: req.body.phNo,
    };

    const user = await Users.findOne({ limit: 1, where: reqBody });

    if (user) {
      console.log(user);
      return res.status(200).json({
        message: "User already exists.",
        error: false,
        data: user,
      });
    } else {
      console.log(user);
      const result = await createUser(reqBody);
      return res.status(200).json({
        message: "User created.",
        error: false,
        data: result,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: "Field Property Violation",
      error: true,
      data: err,
    });
    next({});
  }
};
