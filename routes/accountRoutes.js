const express = require("express");
const router = express.Router();
const { account, destination } = require("../models/index");
const { authorizeRole } = require("../utils/helper");
const {
  validationResultMiddleware,
  validateAccount,
} = require("../utils/helper");
const client = require("../utils/redisClient");

// Create a new account
router.post("/", validateAccount, authorizeRole("admin"), async (req, res) => {
  validationResultMiddleware(req, res);
  try {
    const { email, account_name, account_id } = req.body;
    const newAccount = await account.create({
      email,
      account_name,
      account_id,
    });
    res.status(201).json(newAccount);
    await client.del("accounts:all");
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Get all accounts
router.get("/", authorizeRole("admin", "user"), async (req, res) => {
  const cacheKey = "accounts:all";
  try {
    // Check Redis cache
    const cached = await client.get(cacheKey);
    if (cached && cached !== "null") {
      return res.json(JSON.parse(cached));
    }
    const where = {};
    let accounts;
    const { email } = req.query;
    if (email) {
      where.email = email;
    }
    if (Object.keys(where).length !== 0) {
      accounts = await account.findAll({ where });
      if (accounts.length === 0) {
        return res
          .status(404)
          .json({ error: "No accounts found with the specified email" });
      }
    } else {
      accounts = await account.findAll();
      await client.setEx(cacheKey, 60, JSON.stringify(accounts));
    }
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// update an account by ID
router.put("/:id", authorizeRole("admin", "user"), async (req, res) => {
  try {
    const updated = await account.update(req.body, {
      where: { account_id: req.params.id }, // account_id is used as the identifier
    });
    if (updated[0] === 0) {
      return res.status(404).json({ error: "Account not found" });
    }
    await client.del("accounts:all");
    res.json({ message: "Account updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an account by ID

router.delete("/:id", authorizeRole("admin"), async (req, res) => {
  try {
    const deletedCount = await account.destroy({
      where: { account_id: req.params.id },
    }); // account_id is used as the identifier
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Account not found" });
    }
    await client.del("accounts:all");
    res.json({ message: "Account and its destinations deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
