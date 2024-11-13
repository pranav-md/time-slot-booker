const {
  getEventsWithoutOverlap,
  generateIntervals,
  convertToDateTime,
  getTimezoneFromTimestamp,
  convertEventsToTimezone,
  getStartAndEndTime,
} = require("./functions.js");
const {
  getEventsWithinRange: getEventsWithinRangeDB,
  createEvent: createEventDB,
  isNonOverlappingEvent,
} = require("./db.js");
const { DateTime } = require("luxon");

async function getFreeSlots(date, timezone) {
  const { startTime, endTime } = getStartAndEndTime(timezone, date);

  const currDate = DateTime.fromISO(`${date}T00:00:00`, {
    zone: timezone,
  })

  const possibleEventSlots = generateIntervals(
    startTime,
    endTime,
    currDate
  );
  const bookedEventSlots = await getEventsWithinRangeDB(startTime, endTime);

  const freeSlots = getEventsWithoutOverlap(
    bookedEventSlots,
    possibleEventSlots
  );

  return freeSlots;
}

async function createEvent(date, duration) {
  const startsAt = convertToDateTime(date);

  const endsAt = startsAt.plus({ minutes: duration });

  const isValidEvent = await isNonOverlappingEvent(
    startsAt.toUTC(),
    endsAt.toUTC()
  );

  if (isValidEvent) {
    await createEventDB(startsAt, duration);

    return true;
  }

  return false;
}

async function getEventsWithinRange(startDate, endDate) {
  const timezone = getTimezoneFromTimestamp(startDate);

  const startDateTime = convertToDateTime(startDate);
  const endDateTime = convertToDateTime(endDate);

  const eventsWithinRange = await getEventsWithinRangeDB(
    startDateTime.toUTC(),
    endDateTime.toUTC()
  );

  const eventsWithinRangeWithTimezone = convertEventsToTimezone(
    eventsWithinRange,
    timezone
  );

  return eventsWithinRangeWithTimezone;
}

// Export the functions for use in other files
module.exports = {
  createEvent,
  getFreeSlots,
  getEventsWithinRange,
};
