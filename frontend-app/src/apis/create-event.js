import axios from "axios";
import { BASE_API_URL } from "./constants";

export async function createEvent(dateTime, duration) {
    try {

      const payload = { dateTime, duration };
      const response = await axios.post(BASE_API_URL, payload);
      return response;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }
  