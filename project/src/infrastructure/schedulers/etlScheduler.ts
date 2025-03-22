import cron from 'node-cron';
import { extractMultipleCities } from '../../etl/extractors/DataExtractor';
import { transformMultipleWeatherData } from '../../etl/transformers/DataTransformer';
import { loadWeatherData } from '../../etl/loaders/DataLoader';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'test') {
  console.log('ETL Scheduler disabled in test environment.');
}

/**
 * Starts the ETL scheduler to run the ETL pipeline periodically.
 */
export const startETLScheduler = () => {
  if (process.env.NODE_ENV === 'test') {
    return; // Do not schedule when testing.
  }
  // Schedule the ETL job to run at the top of every hour.
  cron.schedule('0 * * * *', async () => {
    console.log('ETL job started...');
    try {
      // Get cities from environment variable (comma-separated) or default to a few cities.
      const cities = process.env.CITIES ? process.env.CITIES.split(',') : ['London', 'New York', 'Tokyo'];
      const rawDataArray = await extractMultipleCities(cities);
      const transformedData = transformMultipleWeatherData(rawDataArray);
      await loadWeatherData(transformedData);
      console.log('ETL job completed successfully.');
    } catch (error) {
      console.error('ETL job failed:', error);
    }
  });
};


//For Immediate Testing: we can use the following scheduler function for immediately testing the etl pipelin or else the 
// approach that is currently implmented schedules the etl job to run at the top of every hour
// cron.schedule('* * * * *', async () => {
//     console.log('ETL job started...');
//     try {
//       const cities = process.env.CITIES ? process.env.CITIES.split(',') : ['London', 'New York', 'Tokyo'];
//       const rawDataArray = await extractMultipleCities(cities);
//       const transformedData = transformMultipleWeatherData(rawDataArray);
//       await loadWeatherData(transformedData);
//       console.log('ETL job completed successfully.');
//     } catch (error) {
//       console.error('ETL job failed:', error);
//     }
//   });
