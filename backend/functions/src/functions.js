const { DateTime } = require('luxon');
require('dotenv').config();  // Load the .env file
const { Timestamp } = require('firebase-admin/firestore');

// Access the values
const startTime = process.env.START_TIME;
const endTime = process.env.END_TIME;
const duration = process.env.DURATION;
const durationInMinutes = { minutes: duration };
const timezone = process.env.TIMEZONE;

const startTimeInUTC = DateTime.fromISO(startTime, { zone: timezone }).toUTC();
const endTimeInUTC = DateTime.fromISO(endTime, { zone: timezone }).toUTC();

function generateIntervals(startTime, endTime) {
    const intervals = [];
    let currentTime = startTime;
  
    // Loop until the current time exceeds the end time
    while (currentTime <= endTime) {
      
      // Push the interval (start and end time) to the intervals array
      intervals.push({currentTime, duration});
  
      // Move to the next interval
      currentTime = currentTime.plus(durationInMinutes)
      console.log(currentTime)
    }
  
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
    throw new Error('Invalid DateTime object or timezone');
  }

  return convertedDateTime;
}

function convertEventsToTimezone(events, timezone) {
  return events.map(event => {
    // Convert each timestamp to the specified timezone
    const updatedStartsAt = convertToDateTime(event.startsAt).setZone(timezone);
    const updatedEndsAt = convertToDateTime(event.endsAt).setZone(timezone);

    // Return a new object with the converted timestamps
    return {
      ...event,
      startsAt: updatedStartsAt.toISO(), // Converted to ISO string format
      endsAt: updatedEndsAt.toISO()
    };
  });
}

  
function bookedSlotObject(timestamp, duration) {
    // Return an object with the time field in ISO format
    return {
      startTime: Timestamp.fromDate(timestamp.toJSDate()),
      endTime: Timestamp.fromDate(timestamp.plus({minutes: duration}).toJSDate())
    };
  }



function validStartTimeInThisDate(date, timezone) {

  // Parse the given date and set it to 00:00 in the specified timezone
  const startOfDateInTimezone = DateTime.fromISO(date, { zone: timezone }).startOf('day')
 
    // Convert the UTC startTime to the specified timezone
    const startTimeInTimezone = startTimeInUTC.setZone(timezone);

    if (startTimeInTimezone < startOfDateInTimezone) {
      return startOfDateInTimezone.toISO().toUTC();
    }
  
    return startTimeInTimezone.toISO().toUTC();
  
}

function validEndTimeInThisDate(date, timezone) {

  // Parse the given date and set it to 23:59 in the specified timezone
  const endOfDateInTimezone = DateTime.fromISO(date, { zone: timezone }).endOf('day')
 
    // Convert the UTC startTime to the specified timezone
    const endTimeInTimezone = endTimeInUTC.setZone(timezone);

    if (endTimeInTimezone > endOfDateInTimezone) {
      return endOfDateInTimezone.toISO().toUTC();
    }
  
    return endTimeInTimezone.toISO().toUTC();
  
}


function getEventsWithoutOverlap(existingBookings, newBookings) {
  const validNewBookings = [];

  newBookings.forEach(([startNew, endNew]) => {
    let isValid = true;

    for (let [startExisting, endExisting] of existingBookings) {
      // Check for overlap
      if (!(endNew <= startExisting || startNew >= endExisting)) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      validNewBookings.push([startNew, endNew]);
    }
  });

  return validNewBookings;
}

function getTimezoneFromTimestamp(timestamp) {
  // Try to parse the timestamp assuming it's in ISO format with timezone
  const dateTime = DateTime.fromISO(timestamp, { setZone: true });
  
  if (!dateTime.isValid) {
    throw new Error('Invalid timestamp format');
  }

  return dateTime.zoneName;
}

  
  
  
// Export the functions for use in other files
module.exports = {
  generateIntervals,
  convertDateTimeToTimezone,
    bookedSlotObject,
    convertToDateTime,
    validStartTimeInThisDate,
    validEndTimeInThisDate,
    getEventsWithoutOverlap,
    getTimezoneFromTimestamp,
    convertEventsToTimezone
};


