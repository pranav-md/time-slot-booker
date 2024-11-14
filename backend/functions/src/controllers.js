const {
  getEventsWithoutOverlap,
  generateIntervals,
  convertToDateTime,
  getTimezoneFromTimestamp,
  convertEventsToTimezone,
  getStartAndEndTime,
  isNewEventWithinRange,
  getFirstStartAndLastEndTimes,
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
  });

  const possibleEventSlots = generateIntervals(startTime, endTime, currDate);
  
  const { firstStartTime, lastEndTime } = getFirstStartAndLastEndTimes(possibleEventSlots)
  const bookedEventSlots = await getEventsWithinRangeDB(firstStartTime, lastEndTime, timezone);

  const freeSlots = getEventsWithoutOverlap(
    bookedEventSlots,
    possibleEventSlots
  );

  return freeSlots;
}

async function createEvent(date, duration) {
  const startsAt = convertToDateTime(date);

  const endsAt = startsAt.plus({ minutes: duration });

  const isWithinTimeDuration = isNewEventWithinRange(startsAt, endsAt);

  if (!isWithinTimeDuration) {
    console.error("Outside the time duration set");
    return false;
  }

  const isValidEvent = await isNonOverlappingEvent(
    startsAt.toUTC(),
    endsAt.toUTC()
  );

  if (!isValidEvent) {
    console.error("Found overlapping event");
    return false;
  }

  await createEventDB(startsAt, duration);
  return true;
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
