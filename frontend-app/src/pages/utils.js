import { DateTime } from "luxon";

export function setDateTimeWithTimezone(datetime, timezone) {
    // Parse the datetime in the specified timezone
    let dt = DateTime.fromISO(datetime, { zone: timezone });
  
    // Set the time to 00:00
    dt = dt.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  
    // Return as ISO string including timezone information
    return dt;
  }

  export function formatDate(dateTime) {
    return dateTime.toFormat('yyyy-MM-dd');
  }
  