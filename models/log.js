const { DataTypes } = require("sequelize");

const logSchema = (sequelize) => {
  return sequelize.define(
    "log",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      account_id: { type: DataTypes.INTEGER, allowNull: false },
      destination_id: { type: DataTypes.INTEGER, allowNull: false },
      status_code: { type: DataTypes.STRING, allowNull: false },
      received_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      processed_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      response_body: { type: DataTypes.JSON, allowNull: true },
    },
    {
      freezeTableName: true,
    }
  );
};
module.exports = { logSchema };
