const { DataTypes } = require("sequelize");

const destinationSchema = (sequelize) => {
  return sequelize.define(
    "destination",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: { type: DataTypes.STRING, allowNull: false },
      http_method: { type: DataTypes.STRING, allowNull: false },
      headers: { type: DataTypes.JSON, allowNull: false },
    },
    {
      freezeTableName: true,
    }
  );
};

module.exports = { destinationSchema };
