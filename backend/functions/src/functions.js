const { DateTime } = require("luxon");
require("dotenv").config(); // Load the .env file
const { Timestamp } = require("firebase-admin/firestore");
const {
  startTime,
  endTime,
  timezone,
  durationInMinutes,
} = require("./constants");

function generateIntervals(startDate, endDate) {
  let intervals = [];
  let currentTime = startDate;
  let lastPossibleInterval = endDate.minus(durationInMinutes);

  console.log({ lastPossibleInterval });
  // Loop until the current time exceeds the end time
  while (currentTime <= lastPossibleInterval) {
    // Push the interval (start and end time) to the intervals array
    intervals.push({
      startTime: currentTime,
      endTime: currentTime.plus(durationInMinutes),
    });

    // Move to the next interval
    currentTime = currentTime.plus(durationInMinutes);
  }

  console.log(typeof intervals);
  return intervals;
}

function convertToDateTime(dateString) {
  const dateTimeObj = DateTime.fromISO(dateString, { setZone: true });
  return dateTimeObj;
}

function convertDateTimeToTimezone(dateTime, timezone) {
  // Convert the DateTime object to the specified timezone
  const convertedDateTime = dateTime.setZone(timezone);

  // Check if conversion is valid
  if (!convertedDateTime.isValid) {
    throw new Error("Invalid DateTime object or timezone");
  }

  return convertedDateTime;
}

function convertEventsToTimezone(events, timezone) {
  return events.map((event) => {
    // Convert each timestamp to the specified timezone
    const updatedStartsAt = convertToDateTime(event.startTime).setZone(
      timezone
    );
    const updatedEndsAt = convertToDateTime(event.endTime).setZone(timezone);

    // Return a new object with the converted timestamps
    return {
      ...event,
      startTime: updatedStartsAt.toISO(), // Converted to ISO string format
      endTime: updatedEndsAt.toISO(),
    };
  });
}

function bookedSlotObject(timestamp, duration) {
  // Return an object with the time field in ISO format
  return {
    startTime: Timestamp.fromDate(timestamp.toJSDate()),
    endTime: Timestamp.fromDate(
      timestamp.plus({ minutes: duration }).toJSDate()
    ),
  };
}

function getStartAndEndTime(targetZone, dateStr) {
  // Create DateTime objects for the start and end times
  const startDateTime = DateTime.fromISO(`${dateStr}T${startTime}`, {
    zone: timezone,
  });
  const endDateTime = DateTime.fromISO(`${dateStr}T${endTime}`, {
    zone: timezone,
  });

  // Convert to the target timezone
  const startInTargetZone = startDateTime.setZone(targetZone);
  const endInTargetZone = endDateTime.setZone(targetZone);

  // Format the result
  return {
    startTime: startInTargetZone,
    endTime: endInTargetZone,
  };
}

function getEventsWithoutOverlap(existingBookings, newBookings) {
  const validNewBookings = newBookings
    .filter(
      ({ startTime, endTime }) =>
        !existingBookings.some(
          ({ startTime: startExisting, endTime: endExisting }) =>
            !(endTime <= startExisting || startTime >= endExisting)
        )
    )
    .map(({ startTime, endTime }) => [startTime, endTime]);

  return validNewBookings;
}

function getTimezoneFromTimestamp(timestamp) {
  // Try to parse the timestamp assuming it's in ISO format with timezone
  console.log({ timestamp });
  const dateTime = DateTime.fromISO(timestamp, { setZone: true });

  if (!dateTime.isValid) {
    throw new Error("Invalid timestamp format");
  }

  return dateTime.zoneName;
}

function convertFirestoreTimestampToLuxon(timestamp) {
  // Convert Firestore timestamp to JavaScript Date
  const date = timestamp.toDate();

  // Convert Date to Luxon DateTime in UTC
  return DateTime.fromJSDate(date, { zone: "utc" });
}

// Export the functions for use in other files
module.exports = {
  generateIntervals,
  convertDateTimeToTimezone,
  bookedSlotObject,
  convertToDateTime,
  getStartAndEndTime,
  getEventsWithoutOverlap,
  getTimezoneFromTimestamp,
  convertEventsToTimezone,
  convertFirestoreTimestampToLuxon,
};
