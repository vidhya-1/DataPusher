const queue = require("bull");
const forwardQueue = new queue("forwardQueue", {
  redis: { host: "127.0.0.1", port: 6379 },
});
module.exports = { forwardQueue };
