const bcrypt = require("bcryptjs");

exports.verifyPassword = async (password, hash, callback) => {
  return new Promise(async (resolve, reject) => {
    try {
      var verified = false;
      if (await bcrypt.compareSync(password, hash)) {
        verified = true;
      }
      return callback ? callback(null, verified) : resolve(verified);
    } catch (err) {
      return callback ? callback(err, false) : reject(err);
    }
  });
};

exports.verifyEmail = (email) => {
  const regEx =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return regEx.test(email);
};

async function verifyMobile(mobile) {
  const regEx = /^(\+?91)?([6-9][0-9]{9})$/;
  return await regEx.test(mobile);
}

exports.encryptPassword = (password, callback) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hash = await bcrypt.hash(password, 10);
      return callback ? callback(null, hash) : resolve(hash);
    } catch (err) {
      return callback ? callback(err, null) : reject(err);
    }
  });
};
