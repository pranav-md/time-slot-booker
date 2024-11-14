<template>
  <div class="time-slot-list">
    <h2>Booked Time Slots</h2>
    <ul>
      <li
        v-for="(timeToDisplay, index) in timeSlots"
        :key="index"
        class="time-slot"
        @mouseover="hoverIndex = index"
        @mouseleave="hoverIndex = null"
      >
        <span>{{ timeToDisplay }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import { DURATION } from "@/apis/constants";
import { getEventsWithinRange } from "@/apis/get-events-within-range";
import { formatEventTimes } from "./utils";

export default {
  props: {
    startDateTime: {
      type: DateTime, // Expect a DateTime object
      required: true,
    },
    endDateTime: {
      type: DateTime, // Expect a DateTime object
      required: true,
    },
  },
  data() {
    return {
      timeSlots: [],
      hoverIndex: null,
    };
  },
  watch: {
    startDateTime: {
      type: DateTime,
      immediate: true,
      default: DateTime.now(),
      handler() {
        this.fetchBookedSlots();
      },
    },
    endDateTime: {
      type: DateTime,
      immediate: true,
      default: DateTime.now().plus({ minutes: DURATION }),
      handler() {
        this.fetchBookedSlots();
      },
    },
  },
  methods: {
    async fetchBookedSlots() {
      if (this.startDateTime != null && this.endDateTime != null) {
        const freeSlots = await getEventsWithinRange(
          this.startDateTime,
          this.endDateTime
        );
        this.timeSlots = formatEventTimes(freeSlots);
      }
    },
  },
};
</script>

<style scoped>
.time-slot-list {
  font-family: Arial, sans-serif;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
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
