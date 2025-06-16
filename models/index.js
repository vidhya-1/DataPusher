const { Sequelize } = require("sequelize");
const path = require("path");
const sequelize = new Sequelize({
  dialect: "sqlite", // tells which database to use
  storage: path.join(__dirname, "../data.db"), //
});
const { accountSchema } = require("./account");
const { destinationSchema } = require("./destination");
const { roleSchema } = require("./role");
const { logSchema } = require("./log");
const { userSchema } = require("./user");
const { accountMemberSchema } = require("./accountMember");
const account = accountSchema(sequelize);
const destination = destinationSchema(sequelize);
const role = roleSchema(sequelize);
const log = logSchema(sequelize);
const user = userSchema(sequelize);
const accountMember = accountMemberSchema(sequelize);

account.hasMany(destination, {
  foreignKey: "account_id",
  onDelete: "CASCADE", // if an account is deleted, all its destinations will also be deleted
});

destination.belongsTo(account, { foreignKey: "account_id" }); // each destination belongs to an account

role.bulkCreate([{ role_name: "admin" }, { role_name: "user" }], {
  ignoreDuplicates: true, // this will prevent duplicate entries if the table already exists
});

module.exports = {
  sequelize,
  account,
  destination,
  log,
  user,
  accountMember,
};
