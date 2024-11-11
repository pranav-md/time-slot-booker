const firebase = require('firebase/app');
require('firebase/firestore');
const {Firestore} = require('@google-cloud/firestore');
const {convertToUTC, bookedSlotObject } = require('./functions.js');


// In-memory array to store events
let events = [];

const firestore = new Firestore();
const eventsCollection = firestore.collection('events');

/**
 * Saves a timestamp to the Firestore `events` collection with a random document ID.
 * @param {Date} date - The date to save in the `time` field.
 * @returns {Promise<void>} - Resolves when the document is added.
 */
async function saveEvent(timestamp, timezone) {
    const utcTime = convertToUTC(timestamp, timezone);
    try {
      await eventsCollection.add(bookedSlotObject(utcTime));
      console.log('Event saved successfully');
    } catch (error) {
      console.error('Error saving event:', error);
    }
  }
  

  async function getEventsWithinRange(startTime, endTime) {
    try {
      
      // Query for events that start before `endTime` and end after `startTime`
      const snapshot = await eventsCollection
        .where('startsAt', '<=', endTime)
        .where('endsAt', '>=', startTime)
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
  
      // Query for any events that overlap with the given startTime and endTime
      const snapshot = await eventsRef
        .where('startsAt', '<', endTime) // Events that start before the new end time
        .where('endsAt', '>', startTime) // Events that end after the new start time
        .get();
  
      // Check if any documents were found
      if (!snapshot.empty) {
        return true; // Overlapping event(s) found
      } else {
        return false; // No overlapping events
      }
    } catch (error) {
      console.error('Error querying events:', error);
      throw new Error('Failed to check for overlapping events');
    }
  }
  

  module.exports = {
    saveEvent,
    getEventsWithinRange,
    checkForOverlappingEvents
};
