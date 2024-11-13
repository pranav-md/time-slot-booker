<script setup>
import DatePicker from "../components/DatePicker.vue";
import TimezoneDropDown from "../components/TimezoneDropdown.vue";
import FreeSlotsList from "../components/FreeSlotsList.vue";
import TimepickerWithDuration from "../components/TimepickerWithDuration.vue";
</script>

<template>
  <div class="appointment-portal">
    <h1>Dr. John Appointment portal</h1>
    <DatePicker />
    <TimezoneDropDown />
    <div class="slot-book-container">
      <FreeSlotsList />
      <TimepickerWithDuration />
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
