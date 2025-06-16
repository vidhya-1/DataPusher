const express = require("express");
const router = express.Router();
const { accountMember } = require("../models/index");
const { authorizeRole } = require("../utils/helper");
const {
  validationResultMiddleware,
  validateAccountMember,
} = require("../utils/helper");

// Create a new account member
router.post(
  "/",
  validateAccountMember,
  authorizeRole("admin"),
  async (req, res) => {
    validationResultMiddleware(req, res);
    try {
      const { account_id, role_id, user_id } = req.body;
      const newMember = await accountMember.create({
        account_id,
        role_id,
        user_id,
      });
      res.status(201).json(newMember);
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
);

// Get all account members
router.get("/", authorizeRole("admin", "user"), async (req, res) => {
  try {
    const members = await accountMember.findAll();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Get all members for a specific account
router.get("/account/:accountId", async (req, res) => {
  try {
    const members = await accountMember.findAll({
      where: { account_id: req.params.accountId },
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Update an account member by ID
router.put("/:id", authorizeRole("admin"), async (req, res) => {
  try {
    const updated = await accountMember.update(req.body, {
      where: { id: req.params.id }, // id is used as the identifier
    });
    if (updated[0] === 0) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json({ message: "Member updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an account member by ID
router.delete("/:id", authorizeRole("admin"), async (req, res) => {
  try {
    const deleted = await accountMember.destroy({
      where: { id: req.params.id }, // id is used as the identifier
    });
    if (deleted === 0) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
