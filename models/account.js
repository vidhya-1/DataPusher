const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const accountSchema = (sequelize) => {
  return sequelize.define(
    "Account",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      account_id: {
        type: DataTypes.INTEGER,
        defaultValue: uuidv4,
        unique: true,
      },
      account_name: { type: DataTypes.STRING, allowNull: false },
      app_secret_token: {
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
      },
    },
    {
      freezeTableName: true,
    }
  );
};

module.exports = { accountSchema };
