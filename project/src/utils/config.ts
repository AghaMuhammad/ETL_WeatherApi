import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  apiKey: process.env.API_KEY || '',
  dbName: process.env.DB_NAME || 'database.sqlite',
  // Comma-separated list of cities, defaults to a few popular cities if not provided.
  cities: process.env.CITIES ? process.env.CITIES.split(',') : ['London', 'New York', 'Tokyo'],
};
