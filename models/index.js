const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "data.db",
});
const { accountSchema } = require("./account");
const { destinationSchema } = require("./destination");
const account = accountSchema(sequelize);
const destination = destinationSchema(sequelize);

account.hasMany(destination, {
  foreignKey: "account_id",
  onDelete: "CASCADE",
});

destination.belongsTo(account, { foreignKey: "account_id" });

module.exports = {
  sequelize,
  account,
  destination,
};
