// tests/etl.test.ts

import axios from 'axios';
import { extractWeatherData, extractMultipleCities } from '../src/etl/extractors/DataExtractor';
import { transformWeatherData, transformMultipleWeatherData } from '../src/etl/transformers/DataTransformer';
import { loadWeatherData } from '../src/etl/loaders/DataLoader';
import DataRepository from '../src/infrastructure/database/repositories/DataRepository';

jest.mock('axios');
jest.mock('../src/infrastructure/database/repositories/DataRepository');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ETL Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Extractor', () => {
    it('should fetch weather data for a single city', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          id: 2643743,
          name: 'London',
          main: { temp: 10, humidity: 80 },
          weather: [{ description: 'light rain' }],
          dt: 1679563248,
        },
      });

      // Act
      const result = await extractWeatherData('London');

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(result.name).toBe('London');
      expect(result.main.temp).toBe(10);
    });

    it('should fetch weather data for multiple cities concurrently', async () => {
      // Arrange
      // For this test, we set the mock once so every call returns the same data.
      mockedAxios.get.mockResolvedValue({
        data: {
          id: 1234,
          name: 'MockCity',
          main: { temp: 20, humidity: 50 },
          weather: [{ description: 'sunny' }],
          dt: 1679563248,
        },
      });

      const cities = ['City1', 'City2', 'City3'];

      // Act
      const results = await extractMultipleCities(cities);

      // Assert
      expect(results).toHaveLength(3);
      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    });
  });

  describe('Transformer', () => {
    it('should transform raw OpenWeatherMap data into a DataRecord', () => {
      const rawData = {
        id: 2643743,
        name: 'London',
        main: { temp: 10, humidity: 80 },
        weather: [{ description: 'light rain' }],
        dt: 1679563248,
      };

      const record = transformWeatherData(rawData);

      expect(record.id).toBe('2643743');
      expect(record.city).toBe('London');
      expect(record.temperatureC).toBe(10);
      expect(record.temperatureF).toBe((10 * 9) / 5 + 32);
      expect(record.humidity).toBe(80);
      expect(record.weatherDescription).toBe('light rain');
      expect(record.timestamp).toBeInstanceOf(Date);
    });

    it('should transform an array of raw data objects', () => {
      const rawDataArray = [
        {
          id: 1,
          name: 'CityOne',
          main: { temp: 5, humidity: 70 },
          weather: [{ description: 'cloudy' }],
          dt: 1679563248,
        },
        {
          id: 2,
          name: 'CityTwo',
          main: { temp: 25, humidity: 60 },
          weather: [{ description: 'sunny' }],
          dt: 1679564000,
        },
      ];

      const transformed = transformMultipleWeatherData(rawDataArray);

      expect(transformed).toHaveLength(2);
      expect(transformed[0].city).toBe('CityOne');
      expect(transformed[1].temperatureF).toBe((25 * 9) / 5 + 32);
    });
  });

  describe('Loader', () => {
    it('should load an array of DataRecord objects into the repository', async () => {
      // Arrange
      (DataRepository.insertDataRecords as jest.Mock).mockResolvedValueOnce(undefined);

      const dataRecords = [
        {
          id: '2643743',
          city: 'London',
          temperatureC: 10,
          temperatureF: (10 * 9) / 5 + 32,
          humidity: 80,
          weatherDescription: 'light rain',
          timestamp: new Date(),
        },
      ];

      // Act
      await loadWeatherData(dataRecords);

      // Assert
      expect(DataRepository.insertDataRecords).toHaveBeenCalledWith(dataRecords);
    });
  });
});
