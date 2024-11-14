<template>
  <div class="time-slot-list">
    <h2>Available Time Slots</h2>
    <ul>
      <li
        v-for="({ timeToDisplay, time }, index) in timeSlots"
        :key="index"
        class="time-slot"
        @mouseover="hoverIndex = index"
        @mouseleave="hoverIndex = null"
      >
        <span>{{ timeToDisplay }}</span>
        <button
          v-if="hoverIndex === index"
          class="book-button"
          @click="bookSlot(time)"
        >
          Book this slot
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { getFreeSlots } from "@/apis/get-free-slots";
import { DateTime } from "luxon";
import { formattedEventList } from "./utils";
import { createEvent } from "@/apis/create-event";

export default {
  props: {
    selectedDateTime: {
      type: DateTime,
      required: true,
    },
    rerender: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      timeSlots: [],
      hoverIndex: null,
    };
  },
  watch: {
    selectedDateTime: {
      immediate: true,
      handler(newVal) {
        this.fetchFreeSlots(newVal);
      },
    },
    rerender: {
      immediate: true,
      handler() {
        this.fetchFreeSlots(this.selectedDateTime);
      },
    },
  },
  methods: {
    async fetchFreeSlots(dateTime) {
      const freeSlots = await getFreeSlots(dateTime, dateTime.zoneName);
      this.timeSlots = formattedEventList(freeSlots);
    },
    async bookSlot(slot) {
      try {
        const response = await createEvent(slot, 30);

        if (response.status === 200) {
          this.fetchFreeSlots(this.selectedDateTime);
          alert("Booking successful");
        } else {
          alert("Booking failed");
        }
      } catch (error) {
        alert("Error booking slot: " + error.message);
        console.error("API error:", error);
      }
    },
  },
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
