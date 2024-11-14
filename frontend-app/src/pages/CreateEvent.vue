
<template>
  <div class="appointment-portal">
    <h1>Dr. John Appointment booking portal</h1>
    <DatePicker @updateDateTime="handleDateTimeUpdate" />
    <TimezoneDropDown @updateTimezone="handleTimezoneUpdate" />
    <div class="slot-book-container">
      <FreeSlotsList :selectedDateTime="dateTimeInTimezone" :rerender="rerender"/>
      <TimepickerWithDuration @rerender="rerenderFreeSlot" :selectedDateTime="dateTimeInTimezone"  />
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.appointment-portal {
  max-width: 800px; /* Center and set a maximum width */
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: left;
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.slot-book-container {
  display: flex;
  width: 100%; /* Occupy the maximum width of the parent container */
}

.slot-book-container > * {
  flex: 1; /* Each child takes up half of the container */
  padding: 1rem; /* Optional padding */
  box-sizing: border-box;
  border-top: 1px solid #ccc;
}
</style>


<script>
import DatePicker from "../components/DatePicker.vue";
import TimezoneDropDown from "../components/TimezoneDropdown.vue";
import FreeSlotsList from "../components/FreeSlotsList.vue";
import TimepickerWithDuration from "../components/TimepickerWithDuration.vue";
import { setDateTimeWithTimezone } from "./utils";
import { DateTime } from "luxon";

export default {
  components: { DatePicker, TimezoneDropDown, FreeSlotsList, TimepickerWithDuration },
  data() {
    return {
      dateTime: DateTime.now(),
      timezone: 'Asia/Kolkata',
      dateTimeInTimezone: setDateTimeWithTimezone(DateTime.now(), 'Asia/Kolkata'),
      rerender: false
    };
  },
  methods: {
    handleDateTimeUpdate({ dateTime }) {
      this.dateTime = DateTime.fromJSDate(dateTime);
      this.dateTimeInTimezone = setDateTimeWithTimezone(this.dateTime, this.timezone)
    },
    handleTimezoneUpdate({ timezone }) {
      this.timezone = timezone;
      this.dateTimeInTimezone = setDateTimeWithTimezone(this.dateTime, this.timezone)
    },
    rerenderFreeSlot(){
      this.rerender = !this.rerender
    }
  },
};
</script>
