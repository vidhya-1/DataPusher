const { DataTypes } = require("sequelize");

const userSchema = (sequelize) => {
  return sequelize.define(
    "user",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true }, // Email cannot be null and must be unique
      password: { type: DataTypes.STRING, allowNull: false },
      created_by: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_by: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true, // Disable automatic timestamps,
    },
    {
      freezeTableName: true,
    }
  );
};
module.exports = { userSchema };
