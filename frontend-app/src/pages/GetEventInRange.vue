<template>
  <div class="appointment-portal">
    <h1>Dr. John Appointment search portal:</h1>
    <DateRangePicker @updateDateTimeRange="handleDateTimeRangeUpdate" />
    <div class="slot-book-container">
      <ListView :startDateTime="startDateTime" :endDateTime="endDateTime" />
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
  max-width: 800px;
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
  width: 100%;
}

.slot-book-container > * {
  flex: 1;
  padding: 1rem;
  box-sizing: border-box;
  border-top: 1px solid #ccc;
}
</style>

<script>
import DateRangePicker from "../components/DateRangePicker.vue";
import ListView from "../components/ListView.vue";
import { DateTime } from "luxon";

export default {
  components: { DateRangePicker, ListView },
  data() {
    return {
      startDateTime: DateTime.now(),
      endDateTime: DateTime.now().plus({ days: 2 }),
    };
  },
  methods: {
    handleDateTimeRangeUpdate({ dateTimeRange }) {
      this.startDateTime = dateTimeRange[0];
      this.endDateTime = dateTimeRange[1];
    },
  },
};
</script>
