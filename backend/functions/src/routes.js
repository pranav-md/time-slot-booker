const express = require('express');
const router = express.Router();
const { saveEvent, getEvent, getEventsWithinRange, createEvent, getFreeSlots } = require('./controllers.js');

// GET /events with "startDate", "endDate" as query parameters
router.get('/', (req, res) => {
  const { startDate, endDate } = req.query;
  if (!date || !timezone) {
    return res.status(400).json({ error: 'Missing date or timezone' });
  }

  const result = getEventsWithinRange(startDate, endDate)

  // Implement your logic for GET /events
  res.json(result);
});

// POST /events with "date" and "timezone" as body parameters
router.post('/', async (req, res) => {
  const { dateTime, duration } = req.body;
  if (!dateTime || !duration) {
    return res.status(400).json({ error: 'Missing date or timezone' });
  }

  const result = await createEvent(dateTime, duration)

  console.log("ROUTE RESULT: "+ result)
  if (result) {
    // Event created successfully
    return res.status(200).json({ message: 'Event created successfully' });
  } else {
    // Event creation failed
    return res.status(422).json({ error: 'Event creation failed' });
  }
});

// GET /events/free-slots with "start_date" and "end_date" as query parameters
router.get('/free-slots', (req, res) => {
  const { dateTime, timezone } = req.query;
  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Missing start_date or end_date' });
  }


  const result = getFreeSlots(dateTime, timezone)
  // Implement your logic for GET /events/free-slots
  res.status(200).json(result);
});

module.exports = router;
