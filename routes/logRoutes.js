const express = require("express");
const router = express.Router();
const { log } = require("../models/index");
const client = require("../utils/redisClient");

router.get("/", async (req, res) => {
  const cacheKey = "logs:all";
  try {
    // Check Redis cache
    const cached = await client.get(cacheKey);
    if (cached && cached !== "null") {
      return res.json(JSON.parse(cached));
    }
    const where = {};
    let logs;
    const { status_code } = req.query;
    if (status_code && status_code !== "null") {
      where.status_code = status_code;
    }
    if (Object.keys(where).length !== 0) {
      logs = await log.findAll({ where });
      if (logs.length === 0) {
        return res
          .status(404)
          .json({ error: "No logs found with the specified status code" });
      }
    } else {
      logs = await log.findAll();
      await client.setEx(cacheKey, 60, JSON.stringify(logs));
      res.json(logs);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
