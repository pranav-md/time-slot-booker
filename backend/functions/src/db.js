const firebase = require('firebase/app');
require('firebase/firestore');
const {Firestore} = require('@google-cloud/firestore');
const { Timestamp } = require('firebase-admin/firestore');

const {convertToUTC, bookedSlotObject, convertToDateTime, convertDateTimeToTimezone } = require('./functions.js');


// In-memory array to store events
let events = [];

const firestore = new Firestore();
const eventsCollection = firestore.collection('events');

/**
 * Saves a timestamp to the Firestore `events` collection with a random document ID.
 * @param {Date} date - The date to save in the `time` field.
 * @returns {Promise<void>} - Resolves when the document is added.
 */
async function createEvent(timestamp, duration) {
    const utcTime = convertToDateTime(timestamp).toUTC();

    try {
      await eventsCollection.add(bookedSlotObject(utcTime, duration));
      console.log('Event saved successfully');
    } catch (error) {
      console.error('Error saving event:', error);
    }
  }
  

  async function getEventsWithinRange(startTime, endTime) {
    try {
      
      const startTimeParam = Timestamp.fromDate(startTime.toJSDate())
      const endTimeParam = Timestamp.fromDate(endTime.toJSDate())

      // Query for events that start before `endTime` and end after `startTime`
      const snapshot = await eventsCollection
      .where('startTime', '<', endTimeParam) // Event starts before the given end time
      .where('endTime', '>', startTimeParam) // Event ends after the given start time
            .get();
  
      const events = [];
      snapshot.forEach(doc => {
        events.push({ id: doc.id, ...doc.data() });
      });
  
      return events;
    } catch (error) {
      console.error('Error querying events:', error);
      throw new Error('Failed to query events');
    }
  }

  async function checkForOverlappingEvents(startTime, endTime) {
    try {
      const eventsRef = firestore.collection('events');
      const startTimeParam = Timestamp.fromDate(startTime.toJSDate())
      const endTimeParam = Timestamp.fromDate(endTime.toJSDate())


      // Query for any events that overlap with the given startTime and endTime
      const snapshot = await eventsRef
      .where('startTime', '<', endTimeParam) // Event starts before the given end time
      .where('endTime', '>', startTimeParam) // Event ends after the given start time
        .get();

        console.log("SNAPSHOT SIZE: "+snapshot.size)
  
      // Check if any documents were found
      if (!snapshot.empty) {
        return false; // No overlapping event(s) found
      } else {
        return true; // Overlapping events found
      }
    } catch (error) {
      console.error('Error querying events:', error);
      throw new Error('Failed to check for overlapping events');
    }
  }
  

  module.exports = {
    createEvent,
    getEventsWithinRange,
    checkForOverlappingEvents
};
