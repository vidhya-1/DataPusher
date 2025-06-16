const { forwardQueue } = require("../queue/forwardQueue");
const axios = require("axios");
const { log } = require("../models/index.js");

forwardQueue.process(async (job, done) => {
  const { destination, payload, accountValue } = job.data;
  const headers = destination.headers || {};
  let responseData;
  const logDetails = {
    event_id: payload.headers["cl-x-event-id"],
    account_id: accountValue.account_id,
    destination_id: destination.id,
    received_at: new Date(),
    response_body: JSON.stringify(payload.body),
  };
  try {
    if (destination.http_method.toUpperCase() === "GET") {
      if (typeof payload !== "object") {
        return res.status(400).json({ error: "Invalid Data" });
      }

      responseData = await axios.get(destination.url, {
        params: payload.body,
        headers,
      });
    } else {
      responseData = await axios({
        method: destination.http_method,
        url: destination.url,
        data: payload.body,
        headers,
      });
    }
    logDetails.status_code = responseData.statusText;
    logDetails.processed_at = new Date();
    await log.create(logDetails);
    done();
  } catch (err) {
    logDetails.status_code = err.response ? err.response.statusText : "failed";
    logDetails.processed_at = new Date();
  }
});
