const { Firestore } = require("@google-cloud/firestore");
const { Timestamp } = require("firebase-admin/firestore");
const {
  bookedSlotObject,
  convertToDateTime,
  convertFirestoreTimestampToLuxon,
} = require("./functions.js");

const firestore = new Firestore();
const eventsCollection = firestore.collection("events");

/**
 * Saves a timestamp to the Firestore `events` collection with a random document ID.
 * @param {Date} eventDateTime - The date to save in the `time` field.
 * @param {Int} duration - The duration between start and end date time in minutes.
 * @returns {Promise<void>} - Resolves when the document is added.
 */
async function createEvent(eventDateTime, duration) {
  const eventDateTimeInUTC = convertToDateTime(eventDateTime).toUTC();

  try {
    await eventsCollection.add(bookedSlotObject(eventDateTimeInUTC, duration));
    console.log("Event saved successfully");
  } catch (error) {
    console.error("Error saving event:", error);
  }
}

/**
 * Fetches events that fall within the specified time range.
 *
 * @async
 * @param {string} startTime - The start time in ISO format (e.g., "2024-11-13T08:00:00.000Z").
 * @param {string} endTime - The end time in ISO format (e.g., "2024-11-13T18:00:00.000Z").
 *
 * @returns {Promise<Array>} - A promise that resolves to an array of events that occur within the specified range.
 */
async function getEventsWithinRange(startTime, endTime) {
  try {
    const startTimeParam = Timestamp.fromDate(startTime.toJSDate());
    const endTimeParam = Timestamp.fromDate(endTime.toJSDate());

    // Query for events that start before endTime and end after startTime
    const snapshot = await eventsCollection
      .where("startTime", "<", endTimeParam) // Event starts before the given end time AND
      .where("endTime", ">", startTimeParam) // Event ends after the given start time
      .get();

    const events = [];
    snapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        startTime: convertFirestoreTimestampToLuxon(doc.data().startTime),
        endTime: convertFirestoreTimestampToLuxon(doc.data().endTime),
      });
    });

    return events;
  } catch (error) {
    console.error("Error querying events:", error);
    throw new Error("Failed to query events");
  }
}

async function isNonOverlappingEvent(startTime, endTime) {
  try {
    // Query for any events that overlap with the given startTime and endTime
    const snapshot = await getEventsWithinRange(startTime, endTime);

    // Check if any documents were found
    if (!snapshot.empty) {
      return false; // No overlapping event(s) found
    } else {
      return true; // Overlapping events found
    }
  } catch (error) {
    console.error("Error querying events:", error);
    throw new Error("Failed to check for overlapping events");
  }
}

module.exports = {
  createEvent,
  getEventsWithinRange,
  isNonOverlappingEvent,
};
