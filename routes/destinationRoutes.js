const express = require("express");
const router = express.Router();
const { destination } = require("../models/index");
const { authorizeRole } = require("../utils/helper");
const { Op } = require("sequelize");

const {
  validationResultMiddleware,
  validateDestination,
} = require("../utils/helper");
const client = require("../utils/redisClient");

// Create a new destination
router.post(
  "/",
  validateDestination,
  authorizeRole("admin"),
  async (req, res) => {
    validationResultMiddleware(req, res);
    try {
      const { account_id, url, http_method, headers } = req.body;
      const newDestination = await destination.create({
        account_id,
        url,
        http_method,
        headers,
      });
      res.status(201).json(newDestination);
      await client.del("destinations:all");
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
);

// Get all destinations
router.get("/", authorizeRole("admin", "user"), async (req, res) => {
  const cacheKey = "destinations:all";
  try {
    const cached = await client.get(cacheKey);
    if (cached && cached !== "null") {
      return res.json(JSON.parse(cached));
    }
    const { http_method } = req.query;
    const where = {};
    let dests;

    if (http_method && http_method !== "null") {
      where.http_method = http_method; // Use Op.like for case-insensitive search //
    }
    if (Object.keys(where).length !== 0) {
      dests = await destination.findAll({ where });
    } else {
      dests = await destination.findAll();
      await client.setEx(cacheKey, 60, JSON.stringify(dests));
    }
    res.json(dests);
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// Get all destinations for a specific account
router.get("/account/:accountId", async (req, res) => {
  const cacheKey = `destinations:account:${req.params.accountId}`;
  const cached = await client.get(cacheKey);
  if (cached && cached !== "null") {
    return res.json(JSON.parse(cached));
  }
  const dests = await destination.findAll({
    where: { account_id: req.params.accountId },
  });
  await client.setEx(cacheKey, 60, JSON.stringify(dests));
  res.json(dests);
});

// Update a specific destination by ID
router.put("/:id", authorizeRole("admin", "user"), async (req, res) => {
  try {
    const updated = await destination.update(req.body, {
      where: { id: req.params.id }, // id is used as the identifier
    });
    res.json({ message: "Destination updated successfully" });
    await client.del("destinations:all");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a destination by ID
router.delete("/:id", authorizeRole("admin"), async (req, res) => {
  try {
    const deletedCount = await destination.destroy({
      where: { id: req.params.id },
    }); // id is used as the identifier
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }
    res.json({ message: "Destination deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
