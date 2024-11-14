<template>
  <VueDatePicker
    v-model="date"
    :range="{ partialRange: false }"
    @range-start="handleStartTime"
    @range-end="handleEndTime"
  />
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { DateTime } from "luxon";

export default {
  components: { VueDatePicker },
};
</script>

<script setup>
import { ref, defineEmits, onMounted } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";

const date = ref();
const emit = defineEmits(["customChange"]);

onMounted(() => {
  const startDate = DateTime.now();
  const endDate = startDate.plus({ days: 1 });
  date.value = [startDate, endDate];
});

const handleStartTime = (dateTime) => {
  const sDate = DateTime.fromJSDate(dateTime).toISO();

  date.value = [sDate];

  emit("updateDateTimeRange", { dateTimeRange: date.value });
};

const handleEndTime = (dateTime) => {
  const eDate = DateTime.fromJSDate(dateTime).toISO();

  date.value = [date.value[0], eDate];

  emit("updateDateTimeRange", { dateTimeRange: date.value });
};
</script>
