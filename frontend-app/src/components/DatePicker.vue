<template>
    <div class="date-picker-container">
      <label for="datepicker">Select the date:</label>
      <Datepicker id="datepicker" v-model="date" :enable-time-picker="false" />
    </div>
  </template>
  

<script setup>
import { ref } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const date = ref(new Date());

</script>

<style scoped>
.date-picker-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Right-aligns the content */
  max-width: 250px; /* Adjust width as needed */
  margin-right: auto; /* Pushes the component to the right side */
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

#datepicker {
  width: 100%; /* Ensures the date picker fills the container width */
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>