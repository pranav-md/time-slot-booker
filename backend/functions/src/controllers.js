
const firebase = require('firebase/app');
require('firebase/firestore');
const {Firestore} = require('@google-cloud/firestore');
const {convertDateTimeToTimzone, bookedSlotObject, validStartTimeInThisDate, validEndTimeInThisDate, getEventsWithoutOverlap, generateIntervals, convertToDateTime, getTimezoneFromTimestamp, convertEventsToTimezone } = require('./functions.js');
const { getEventsWithinRange : getEventsWithinRangeDB, createEvent: createEventDB, checkForOverlappingEvents } = require('./db.js');
const { event } = require('firebase-functions/v1/analytics');


async function getFreeSlots(date, timezone) {
    const validStartTime =  validStartTimeInThisDate(date, timezone)  
    const validEndTime =  validEndTimeInThisDate(date, timezone)

    const possibleEventSlots = generateIntervals(validStartTime, validEndTime)
    const confirmedEventSlots = await getEventsWithinRangeDB(validStartTime, validEndTime)

    const freeSlots = getEventsWithoutOverlap(confirmedEventSlots, possibleEventSlots)

    return freeSlots
  }
  
  async function createEvent(date, duration) {
    const startsAt = convertToDateTime(date)

    const endsAt = startsAt.plus({minutes: duration})

    const isValidEvent = await checkForOverlappingEvents(startsAt.toUTC(), endsAt.toUTC())

    if(isValidEvent){

      console.log("FOUND VALID EVENT")
      await createEventDB(startsAt, duration)

      return true
    }

    console.log("RESULT: "+ isValidEvent)
    console.log("FOUND INVALID EVENT")

    return false
  }
  
  async function getEventsWithinRange(startDate, endDate) {

    
    const timezone = getTimezoneFromTimestamp(startDate)

    const startDateTime = convertToDateTime(startDate)
    const endDateTime = convertToDateTime(endDate)


    const eventsWithinRange = await getEventsWithinRangeDB(startDateTime.toUTC(), endDateTime.toUTC())

    const eventsWithinRangeWithTimezone = convertEventsToTimezone(eventsWithinRange, timezone)

    return eventsWithinRangeWithTimezone
  }


// Export the functions for use in other files
module.exports = {
  createEvent,
  getFreeSlots,
  getEventsWithinRange
};
