const { Users } = require("../models");

exports.getUser = async (reqBody = {}) => {
  return await Users.findOne({
    limit: 1,
    where: reqBody,
  });
};

exports.createUser = async (reqBody = {}) => {
  return await Users.create(reqBody);
};

exports.isUserExists = async (reqBody = {}) => {
  console.log(reqBody);
  return await Users.findOne({ limit: 1, where: reqBody });
};
