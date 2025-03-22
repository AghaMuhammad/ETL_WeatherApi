import { DataRecord } from '../../domain/models/DataRecord';

/**
 * Transforms raw OpenWeatherMap data into a DataRecord.
 * @param rawData - The raw API response for a single city.
 * @returns A DataRecord with normalized and computed fields.
 */
export const transformWeatherData = (rawData: any): DataRecord => {
  // Convert Unix timestamp (in seconds) to a JavaScript Date.
  const timestamp = new Date(rawData.dt * 1000);

  // Extract and compute the required fields.
  const temperatureC = rawData.main.temp;
  const temperatureF = (temperatureC * 9) / 5 + 32;

  return {
    id: rawData.id.toString(),
    city: rawData.name,
    temperatureC,
    temperatureF,
    humidity: rawData.main.humidity,
    weatherDescription:
      rawData.weather && rawData.weather.length > 0 ? rawData.weather[0].description : 'No description',
    timestamp,
  };
};

/**
 * Transforms an array of raw weather data objects.
 * @param rawDataArray - Array of raw API responses.
 * @returns An array of DataRecord objects.
 */
export const transformMultipleWeatherData = (rawDataArray: any[]): DataRecord[] => {
  return rawDataArray.map((data) => transformWeatherData(data));
};
