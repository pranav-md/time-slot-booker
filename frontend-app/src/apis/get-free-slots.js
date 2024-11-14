import axios from 'axios';
import { BASE_API_URL } from './constants';
import {formatDate} from './utils'

export async function getFreeSlots(dateTimeToFormat, timezone) {
  try {

    const dateTime = formatDate(dateTimeToFormat)
    const response = await axios.get(`${BASE_API_URL}/free-slots`, {
      params: { dateTime, timezone }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events by date and timezone:', error);
    throw error;
  }
}
