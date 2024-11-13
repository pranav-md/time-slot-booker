const { DateTime } = require("luxon");
const { Timestamp } = require("firebase-admin/firestore");
const {
  startTime,
  endTime,
  timezone,
  durationInMinutes,
} = require("./constants");

//Returns the all possible intervals/events between given startTime and endTime within provided current date
function generateIntervals(startDate, endDate, currDate) {
  let intervals = [];
  let currentTime = startDate;
  let lastPossibleInterval = endDate.minus(durationInMinutes);

  //Case for startDate and endDate which comes within same day
  if (startDate.day === endDate.day) {
    while (currentTime <= lastPossibleInterval) {
      // Push the interval (start and end time) to the intervals array
      intervals.push({
        startTime: currentTime,
        endTime: currentTime.plus(durationInMinutes),
      });

      // Move to the next interval
      currentTime = currentTime.plus(durationInMinutes);
    }
  } else {
    //Case for startDate and endDate which in 2 different days in this timezone
    const startOfDay = currDate.startOf("day");
    const endOfDay = currDate.endOf("day");

    const startLimit = combineDateAndTime(startDate, currDate);
    const endLimit = combineDateAndTime(endDate, currDate);

    currentTime = startOfDay;

    //Starts looping from 00:00 midnight to the endLimit
    while (currentTime <= endLimit) {
      intervals.push({
        startTime: currentTime,
        endTime: currentTime.plus(durationInMinutes),
      });

      // Move to the next interval
      currentTime = currentTime.plus(durationInMinutes);
    }

    currentTime = startLimit;

    //Starts looping from startLimit to the 23:59 midnight
    while (currentTime <= endOfDay) {
      intervals.push({
        startTime: currentTime,
        endTime: currentTime.plus(durationInMinutes),
      });

      // Move to the next interval
      currentTime = currentTime.plus(durationInMinutes);
    }
  }
  return intervals;
}

//Preserves the year, month, day of dateTime2 and returns the hours, minute, second, ms, tz combined from dateTime1
function combineDateAndTime(dateTime1, dateTime2) {
  return DateTime.fromObject({
    year: dateTime2.year,
    month: dateTime2.month,
    day: dateTime2.day,
    hour: dateTime1.hour,
    minute: dateTime1.minute,
    second: dateTime1.second,
    millisecond: dateTime1.millisecond,
  }).setZone(dateTime2.zone, { keepLocalTime: true });
}

function convertToDateTime(dateString) {
  const dateTimeObj = DateTime.fromISO(dateString, { setZone: true });
  return dateTimeObj;
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
  // Return an object with the time fields in Firebase Timestamp object type
  return {
    startTime: Timestamp.fromDate(timestamp.toJSDate()),
    endTime: Timestamp.fromDate(
      timestamp.plus({ minutes: duration }).toJSDate()
    ),
  };
}

/**
 * Returns valid startTime and endTime within the specified timezone and date.
 * The times are processed from the start and end time saved in the environment.
 * @param {String} targetZone the target timezone provided by user
 * @param {String} date the date(YYYY-MM-DD format) provided by user
 * @returns {Object} An object containing the valid start and end times.
 * @returns {string} startTime - The processed start time in ISO string format.
 * @returns {string} endTime - The processed end time in ISO string format.
 */
function getStartAndEndTime(targetZone, date) {
  const startDateTime = DateTime.fromISO(`${date}T${startTime}`, {
    zone: timezone,
  });
  const endDateTime = DateTime.fromISO(`${date}T${endTime}`, {
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

/**
 * Filters out events that overlap between existing bookings and new bookings.
 *
 * @param {Array} existingBookings - An array of existing bookings, where each booking is an object with start and end times.
 * @param {Array} newBookings - An array of new bookings to be checked for overlap with the existing bookings.
 *
 * @returns {Array} - An array of new bookings that do not overlap with any existing bookings.
 */
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
  // Parse the timestamp assuming it's in ISO format with timezone
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
  bookedSlotObject,
  convertToDateTime,
  getStartAndEndTime,
  getEventsWithoutOverlap,
  getTimezoneFromTimestamp,
  convertEventsToTimezone,
  convertFirestoreTimestampToLuxon,
};
