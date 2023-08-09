import axios from "axios";
import Cookies from "js-cookie";

export async function makeRequest(url, method = 'GET', data = null, config = {}) {
  try {
    const response = await axios({
      url: url,
      method: method,
      data: data,
      ...config,
    });

    if (response && response.data) {
      return response;
    }
  } catch (error) {
    return error;
  }
}

export const getDaysBetweenDates = (startDateStr, endDateStr) => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const timeDiff = endDate.getTime() - startDate.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  return Math.round(daysDiff);
}