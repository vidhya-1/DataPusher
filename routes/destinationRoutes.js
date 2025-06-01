const express = require("express");
const router = express.Router();
const { destination } = require("../models/index");

// Create a new destination
router.post("/", async (req, res) => {
  try {
    const { account_id, url, http_method, headers } = req.body;
    const newDestination = await destination.create({
      account_id,
      url,
      http_method,
      headers,
    });
    res.status(201).json(newDestination);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all destinations
router.get("/", async (req, res) => {
  const dests = await destination.findAll();
  res.json(dests);
});

// Get all destinations for a specific account
router.get("/account/:accountId", async (req, res) => {
  const dests = await destination.findAll({
    where: { account_id: req.params.accountId },
  });
  res.json(dests);
});

// Get a specific destination by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await destination.update(req.body, {
      where: { id: req.params.id }, // id is used as the identifier
    });
    res.json({ message: "Destination updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a destination by ID
router.delete("/:id", async (req, res) => {
  try {
    await destination.destroy({ where: { id: req.params.id } }); // id is used as the identifier
    res.json({ message: "Destination deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
