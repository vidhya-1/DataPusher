const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

const { sequelize } = require("./models/index");
const accountRoutes = require("./routes/accountRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const dataHandler = require("./routes/dataHandler");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/account", accountRoutes);
app.use("/destination", destinationRoutes);
app.use("/server", dataHandler);

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
