const express = require("express");
const router = express.Router();
const axios = require("axios");
const { account, destination } = require("../models/index");
const { validationResultMiddleware } = require("../utils/helper");
const { forwardQueue } = require("../queue/forwardQueue");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1000, // 1 sec
  max: 5, // limit each IP to 5 requests/sec
  keyGenerator: (req) => req.headers["cl-x-token"],
  message: { success: false, message: "Too many requests" },
});

router.post("/incoming_data", limiter, async (req, res) => {
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

    for (const dest of destinations) {
      await forwardQueue.empty(); // Clears all waiting jobs
      await forwardQueue.add({
        destination: dest,
        payload: {
          headers: req.headers,
          body: req.body,
        },
        accountValue: accountDetails,
      });
    }
    res.json({ success: true, message: "Data queued for processing" });
  } catch (err) {
    res.status(500).json({ error: "Internal Error" });
  }
});

module.exports = router;
