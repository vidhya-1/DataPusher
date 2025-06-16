const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // For hashing passwords
const { user } = require("../models/index");
const jwt = require("jsonwebtoken"); // For generating JWT tokens
const { validateUser, validationResultMiddleware } = require("../utils/helper");
const { authorizeRole } = require("../utils/helper");

router.post("/", validateUser, authorizeRole("admin"), async (req, res) => {
  validationResultMiddleware(req, res);
  try {
    const { email, passwordValue } = req.body;
    const password = await bcrypt.hash(passwordValue, 10);
    const newUser = await user.create({ email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", validateUser, async (req, res) => {
  validationResultMiddleware(req, res);
  const { email, passwordValue } = req.body;
  try {
    const existingUser = await user.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(
      passwordValue,
      existingUser?.dataValues?.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: existingUser?.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
