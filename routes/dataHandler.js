const express = require("express");
const router = express.Router();
const axios = require("axios");
const { account, destination } = require("../models/index");

// Middleware to parse JSON bodies

router.post("/incoming_data", async (req, res) => {
  const token = req.headers["cl-x-token"];
  if (!token) return res.status(401).json({ error: "Un Authenticate" });

  try {
    const accountDetails = await account.findOne({
      where: { app_secret_token: token },
    });
    if (!accountDetails)
      return res.status(404).json({ error: "Account not found" });

    const destinations = await destination.findAll({
      where: { account_id: accountDetails.id }, // Fetch destinations for the account
    });
    if (destinations.length === 0) {
      return res
        .status(404)
        .json({ error: "No destinations found for this account" });
    }
    const payload = req.body;
    for (const dest of destinations) {
      const headers = dest.headers;

      if (dest.http_method.toUpperCase() === "GET") {
        if (typeof payload !== "object") {
          return res.status(400).json({ error: "Invalid Data" });
        }

        await axios.get(dest.url, {
          params: payload,
          headers,
        });
      } else {
        await axios({
          method: dest.http_method,
          url: dest.url,
          data: payload,
          headers,
        });
      }
    }

    res.json({ message: "Data forwarded to all destinations" });
  } catch (err) {
    res.status(500).json({ error: "Internal Error" });
  }
});

module.exports = router;
