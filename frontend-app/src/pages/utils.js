import { DateTime } from "luxon";

export function setDateTimeWithTimezone(datetime, timezone) {
  let dt = DateTime.fromISO(datetime, { zone: timezone });
  dt = dt.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  return dt;
}

export function formatDate(dateTime) {
  return dateTime.toFormat("yyyy-MM-dd");
}
