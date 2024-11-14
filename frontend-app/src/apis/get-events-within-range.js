import axios from 'axios';
import { BASE_API_URL } from './constants';

export async function getEventsWithinRange(startDate, endDate) {
  try {
    const response = await axios.get(BASE_API_URL, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}
