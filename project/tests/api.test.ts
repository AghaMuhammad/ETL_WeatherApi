// tests/api.test.ts

import request from 'supertest';
import app from '../src/app'; // Your main Express app
import DataService from '../src/domain/services/DataService';

// Mock the entire DataService module.
jest.mock('../src/domain/services/DataService');

describe('API Tests: /data endpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and data array when calling GET /data', async () => {
    // Arrange: Mock getData to return a sample array of data.
    (DataService.getData as jest.Mock).mockResolvedValueOnce([
      {
        id: '123',
        city: 'London',
        temperatureC: 15,
        temperatureF: 59,
        humidity: 80,
        weatherDescription: 'cloudy',
        timestamp: new Date(),
      },
    ]);

    // Act: Make a request to the /data endpoint.
    const response = await request(app).get('/data');

    // Assert: Check the response.
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].city).toBe('London');
  });

  it('should return 500 if an error occurs', async () => {
    // Arrange: Mock getData to throw an error.
    (DataService.getData as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    // Act: Make a request to the /data endpoint.
    const response = await request(app).get('/data');

    // Assert:
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Database error');
  });
});
