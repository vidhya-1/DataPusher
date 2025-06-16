const { DataTypes } = require("sequelize");

const accountMemberSchema = (sequelize) => {
  return sequelize.define(
    "accountMember",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      account_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      role_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      timestamps: true,
    }
  );
};
module.exports = { accountMemberSchema };
