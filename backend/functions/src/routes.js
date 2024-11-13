const express = require("express");
const router = express.Router();
const {
  getEventsWithinRange,
  createEvent,
  getFreeSlots,
} = require("./controllers.js");

/**
 * GET /events
 *
 * Retrieve events between the specified start and end dates.
 *
 * @param {string} startDate - The start date for filtering events.
 * @param {string} endDate - The end date
 */
router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Missing startDate or endDate" });
  }

  const result = await getEventsWithinRange(startDate, endDate);

  // Implement your logic for GET /events
  res.json(result);
});

/**
 * POST /events
 *
 * Create a new event with the specified date and duration.
 *
 * @param {Object} body - The request body containing event details.
 * @param {string} body.date - The date and time of the event (ISO string format).
 * @param {number} body.duration - The duration of the event in minutes.
 */
router.post("/", async (req, res) => {
  const { dateTime, duration } = req.body;
  if (!dateTime || !duration) {
    return res.status(400).json({ error: "Missing date or timezone" });
  }

  const result = await createEvent(dateTime, duration);

  if (result) {
    // Event created successfully
    return res.status(200).json({ message: "Event created successfully" });
  } else {
    // Event creation failed
    return res.status(422).json({ error: "Event creation failed" });
  }
});

/**
 * GET /events/free-slots
 *
 * Retrieve available event time slots.
 *
 * @param {string} dateTime - The date and time for which to retrieve the available slots.(YYYY-MM-DD format)
 * @param {string} timezone - The timezone to adjust the slots for.
 */
router.get("/free-slots", async (req, res) => {
  const { dateTime: date, timezone } = req.query;
  if (!date || !timezone) {
    return res.status(400).json({ error: "Missing dateTime or timezone" });
  }

  const result = await getFreeSlots(date, timezone);

  res.status(200).json(result);
});

module.exports = router;
