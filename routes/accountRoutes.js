const express = require("express");
const router = express.Router();
const { account, destination } = require("../models/index");

// Create a new account
router.post("/", async (req, res) => {
  try {
    const { email, account_name, account_id } = req.body;
    const newAccount = await account.create({
      email,
      account_name,
      account_id,
    });
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all accounts

router.get("/", async (req, res) => {
  const accounts = await account.findAll();
  res.json(accounts);
});

// Get a specific account by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await account.update(req.body, {
      where: { account_id: req.params.id }, // account_id is used as the identifier
    });
    if (updated[0] === 0) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json({ message: "Account updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an account by ID

router.delete("/:id", async (req, res) => {
  try {
    await account.destroy({ where: { account_id: req.params.id } }); // account_id is used as the identifier
    await destination.destroy({ where: { account_id: req.params.id } });
    res.json({ message: "Account and its destinations deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
