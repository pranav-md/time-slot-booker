const startTime = process.env.START_TIME;
const endTime = process.env.END_TIME;
const duration = process.env.DURATION;
const timezone = process.env.TIMEZONE;
const durationInMinutes = { minutes: duration };
const emptyMinutes = "10:00:00"
module.exports = {
startTime, endTime, duration, timezone, durationInMinutes
}