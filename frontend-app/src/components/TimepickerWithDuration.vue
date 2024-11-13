<!-- eslint-disable vue/no-export-in-script-setup -->
<template>
    <div class="duration-input">
      <h2>Book time slot with duration</h2>
      
      <VueDatePicker v-model="time" time-picker />
  
      <label for="duration">Duration (in minutes):</label>
      <input
        type="number"
        id="duration"
        v-model="duration"
        placeholder="Enter duration"
      />
      <button @click="bookNow">Book now</button>
    </div>
  </template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';

export default {
  data() {
    return {
      duration: null, // Stores the user-entered duration
      time: new Date()
    };
  },
  methods: {
    bookNow() {
      if (this.duration) {
        alert(`You have booked a slot for ${this.duration} minutes.`);
        // Additional booking logic can go here
      } else {
        alert("Please enter a duration.");
      }
    }
  },
  components: {
    VueDatePicker
  }
};

</script>


<style scoped>
.duration-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%; /* Makes the component fill the parent width */
  max-width: 400px; /* Optional: sets a maximum width for readability */
  padding: 1rem;
  box-sizing: border-box;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

label {
  margin-top: 1rem;
  font-size: 1rem;
}

input[type="number"] {
  width: 100%; /* Ensures the input takes up the full width */
  padding: 0.5rem;
  margin-top: 0.5rem;
  font-size: 1rem;
  box-sizing: border-box;
}

button {
  margin-top: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  width: 100%; /* Full-width button */
}

button:hover {
  background-color: #007bff; /* Optional hover effect */
  color: #fff;
}
</style>