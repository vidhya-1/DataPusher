const { DataTypes } = require("sequelize");

const roleSchema = (sequelize) => {
  return sequelize.define(
    "role",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      role_name: { type: DataTypes.STRING, allowNull: false, unique: true }, // Role name cannot be null and must be unique
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      timestamps: false,
      // Disable automatic timestamps,
    },
    {
      freezeTableName: true,
    }
  );
};
module.exports = { roleSchema };
