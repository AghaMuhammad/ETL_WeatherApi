import axios from 'axios';
import dotenv from 'dotenv';
import { logger } from '../../utils/logger';

dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

const DEFAULT_RETRIES = 3;
const INITIAL_DELAY_MS = 500;

/**
 * A helper function to retry asynchronous operations.
 * @param fn The async function to retry.
 * @param retries The number of attempts.
 * @param delay The initial delay between retries.
 * @returns The resolved value of the async function.
 * @throws If all retries fail, throws the last encountered error.
 */
async function retry<T>(fn: () => Promise<T>, retries: number = DEFAULT_RETRIES, delay: number = INITIAL_DELAY_MS): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    logger.error(`Retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise((res) => setTimeout(res, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}

/**
 * Fetch weather data for a single city with retry logic.
 * @param city - The city name.
 * @returns The raw API response data.
 */
export const extractWeatherData = async (city: string): Promise<any> => {
  return retry(async () => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric', // Retrieve temperature in Celsius
        },
      });
      return response.data;
    } catch (error: any) {
      logger.error(`Failed to extract data for city "${city}": ${error.message}`);
      throw error;
    }
  });
};

/**
 * Fetch weather data for multiple cities concurrently, handling partial failures.
 * @param cities - Array of city names.
 * @returns An array of raw API response data, filtering out any failures.
 */
export const extractMultipleCities = async (cities: string[]): Promise<any[]> => {
  const results = await Promise.all(
    cities.map(async (city) => {
      try {
        return await extractWeatherData(city);
    } catch (error) {
        if (error instanceof Error) {
          logger.error(`Data extraction failed for city "${city}": ${error.message}`);
        } else {
          // Fallback for non-Error types
          logger.error(`Data extraction failed for city "${city}": ${error}`);
        }
        return null;
      }
      
    })
  );
  // Filter out any null responses caused by failures.
  return results.filter((data) => data !== null);
};
