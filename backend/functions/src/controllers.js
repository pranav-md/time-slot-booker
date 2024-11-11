
const firebase = require('firebase/app');
require('firebase/firestore');
const {Firestore} = require('@google-cloud/firestore');
const {convertToUTC, bookedSlotObject, validStartTimeInThisDate, validEndTimeInThisDate, getEventsWithoutOverlap, generateIntervals, convertToDateTime } = require('./functions.js');
const { getEventsWithinRange, checkForOverlappingEvents } = require('./db.js');


async function getFreeSlots(date, timezone) {
    const validStartTime =  validStartTimeInThisDate(date, timezone)  
    const validEndTime =  validEndTimeInThisDate(date, timezone)

    const possibleEventSlots = generateIntervals(validStartTime, validEndTime)
    const confirmedEventSlots = await getEventsWithinRange(validStartTime, validEndTime)

    const freeSlots = getEventsWithoutOverlap(confirmedEventSlots, possibleEventSlots)

    return freeSlots
  }
  
  async function createEvent(date, duration) {
    const startsAt = convertToDateTime(date)

    const endsAt = startsAt.plus({minutes: duration})

    const isValidEvent = await checkForOverlappingEvents(startsAt.toUTC().toISO(), endsAt.toUTC().toISO())

    if(isValidEvent){
      await createEvent(date, duration)
    }

    return false
  }
  


// Export the functions for use in other files
module.exports = {
    saveEvent,
  updateEvent,
  getEvent
};
