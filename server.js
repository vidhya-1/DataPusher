const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config(); // Load environment variables from .env file

const { sequelize } = require("./models/index");
const accountRoutes = require("./routes/accountRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const dataHandler = require("./routes/dataHandler");
const userRoutes = require("./routes/userRoutes");
const accountMemberRoutes = require("./routes/accountMember");
const logRoutes = require("./routes/logRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/account", accountRoutes);
app.use("/destination", destinationRoutes);
app.use("/server", dataHandler);
app.use("/user", userRoutes);
app.use("/accountMember", accountMemberRoutes);
app.use("/logs", logRoutes);
sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || port, () => {
      console.log(`Server running on ${process.env.PORT || port}`);
    });
  })
  .catch((error) => {
    console.error("Error creating database tables:", error);
  });

module.exports = app;
