module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  });

  return Users;
};
