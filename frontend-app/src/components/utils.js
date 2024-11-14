import { DateTime } from "luxon";

export function combineDateTime(dateTime, time) {
  // Set the time from the time object to the dateTime object
  const combinedDateTime = dateTime.set({
    hour: time.hours,
    minute: time.minutes,
    second: time.seconds,
  });

  return combinedDateTime;
}

export function formattedEventList(events) {
  const formattedList = events.map((item) => {
    return {
      timeToDisplay: DateTime.fromISO(item[0], { setZone: true }).toFormat(
        "MMMM dd, yyyy 'at' h:mm a ZZZZ"
      ),
      time: item[0],
    };
  });
  return formattedList;
}

export function deserialiseStringToDateTime(dateTime) {
  const timeSerialized = DateTime.fromFormat(
    dateTime,
    "MMMM dd, yyyy 'at' h:mm a ZZZZ"
  );
  return timeSerialized;
}

export function formatEventTimes(events) {
  return events.map((event) => {
    const start = DateTime.fromISO(event.startTime);
    const end = DateTime.fromISO(event.endTime);

    const startFormatted = start.toFormat("EEEE, MMMM dd, yyyy 'at' HH:mm");
    const endFormatted = end.toFormat(
      "EEEE, MMMM dd, yyyy 'at' HH:mm '  Timezone:'ZZZZ"
    );

    return `${startFormatted} to ${endFormatted}`;
  });
}
