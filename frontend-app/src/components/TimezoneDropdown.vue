<template>
  <div class="timezone-selector">
    <label for="dropdown">Select the timezone :</label>
    <select v-model="selectedOption" id="dropdown">
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <p>Selected timezone: {{ selectedOption }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOption: "Asia/Kolkata",
      options: [
        "UTC",
        "GMT",
        "Europe/London",
        "America/New_York",
        "Asia/Kolkata",
      ],
    };
  },
};
</script>

<style scoped>
.timezone-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 300px; /* Adjust width as needed */
  margin-right: auto; /* Pushes the component to the right side */
  margin-top: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;
  width: 100%;
}

p {
  margin-top: 0.5rem;
  color: #333;
}
</style>
