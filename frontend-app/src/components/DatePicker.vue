<template>
    <div class="date-picker-container">
      <label for="datepicker">Select the date:</label>
      <Datepicker id="datepicker" v-model="date" :enable-time-picker="false"  @update:model-value="handleDate"/>
    </div>
  </template>
  

<script setup>
import { ref, defineEmits } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const date = ref(new Date());
const emit = defineEmits(['customChange'])

const handleDate = (modelData) => {
  date.value = modelData;
  emit('updateDateTime', {dateTime: modelData});
}

</script>

<style scoped>
.date-picker-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  max-width: 250px; 
  margin-right: auto;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

#datepicker {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>