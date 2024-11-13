<template>
    <div class="time-slot-list">
      <h2>Available Time Slots</h2>
      <ul>
        <li 
          v-for="(slot, index) in timeSlots" 
          :key="index" 
          class="time-slot" 
          @mouseover="hoverIndex = index" 
          @mouseleave="hoverIndex = null"
        >
          <span>{{ slot }}</span>
          <button 
            v-if="hoverIndex === index" 
            class="book-button" 
            @click="bookSlot(slot)"
          >
            Book this slot
          </button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        timeSlots: [
          '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
        ],
        hoverIndex: null
      };
    },
    methods: {
      bookSlot(slot) {
        alert(`You have booked the slot: ${slot}`);
      }
    }
  };
  </script>
  
  <style scoped>
  .time-slot-list {
    font-family: Arial, sans-serif;
    border-right: 1px solid #ccc; 
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  .time-slot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 8px;
    position: relative;
  }
  
  .time-slot:hover {
    background-color: #f9f9f9;
  }
  
  .book-button {
    display: none;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    position: absolute;
    right: 10px;
  }
  
  .time-slot:hover .book-button {
    display: inline-block;
  }
  </style>
  