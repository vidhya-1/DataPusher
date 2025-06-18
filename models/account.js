const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid"); //`uuid` is used to generate unique identifiers for accounts

const accountSchema = (sequelize) => {
  return sequelize.define(
    "account",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      account_id: {
        type: DataTypes.INTEGER,
        defaultValue: uuidv4, // Generate a unique identifier for the account
        unique: true,
      },
      account_name: { type: DataTypes.STRING, allowNull: false }, // Account name cannot be null
      app_secret_token: {
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
      },
    },
    {
      indexes: [
        {
          name: "email_index",
          unique: true, // Index on email for faster lookups
          using: "BTREE", // Using B-tree index for efficient searching
          fields: ["email"],
        },
      ],
    },
    {
      freezeTableName: true,
    }
  );
};

module.exports = { accountSchema };
