const { DateTime } = require('luxon');
require('dotenv').config();  // Load the .env file

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
function convertToUTC(timestamp, timezone) {
    return DateTime.fromISO(timestamp, { zone: timezone }).toUTC();
  }

  
function bookedSlotObject(timestamp, duration) {
    // Return an object with the time field in ISO format
    return {
      startTime: timestamp.toISO(),
      endTime: timestamp.toISO().plus(duration)
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

  
  
  
// Export the functions for use in other files
module.exports = {
  generateIntervals,
    convertToUTC,
    bookedSlotObject,
    convertToDateTime,
    validStartTimeInThisDate,
    validEndTimeInThisDate,
    getEventsWithoutOverlap
};


