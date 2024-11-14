

import { createRouter, createWebHistory } from 'vue-router'

import CreateEvent from "./pages/CreateEvent.vue";
import GetEventInRange from "./pages/GetEventInRange.vue";

const routes = [
    { path: '/', redirect: "/events/book", component: CreateEvent },
    { path: "/events/search", component: GetEventInRange },
    { path: "/events/book", component: CreateEvent },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})