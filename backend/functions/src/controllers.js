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
  checkForOverlappingEvents,
} = require("./db.js");

async function getFreeSlots(date, timezone) {
  const { startTime, endTime } = getStartAndEndTime(timezone, date);

  console.log("valid start time:" + startTime.toUTC().toISO());
  console.log("valid end time:" + endTime.toUTC().toISO());

  const possibleEventSlots = generateIntervals(startTime, endTime);
  const confirmedEventSlots = await getEventsWithinRangeDB(startTime, endTime);

  console.log({ confirmedEventSlots });
  const freeSlots = getEventsWithoutOverlap(
    confirmedEventSlots,
    possibleEventSlots
  );

  return freeSlots;
}

async function createEvent(date, duration) {
  const startsAt = convertToDateTime(date);

  const endsAt = startsAt.plus({ minutes: duration });

  const isValidEvent = await checkForOverlappingEvents(
    startsAt.toUTC(),
    endsAt.toUTC()
  );

  if (isValidEvent) {
    console.log("FOUND VALID EVENT");
    await createEventDB(startsAt, duration);

    return true;
  }

  console.log("RESULT: " + isValidEvent);
  console.log("FOUND INVALID EVENT");

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
