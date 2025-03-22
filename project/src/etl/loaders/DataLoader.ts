import { DataRecord } from '../../domain/models/DataRecord';
import DataRepository from '../../infrastructure/database/repositories/DataRepository';

/**
 * Loads an array of DataRecord objects into the database.
 * Uses bulk insert operations for performance.
 * @param dataRecords - The transformed weather data records.
 */
export const loadWeatherData = async (dataRecords: DataRecord[]): Promise<void> => {
  try {
    // Bulk insert data records using the repository.
    await DataRepository.insertDataRecords(dataRecords);
    console.log('Data loaded successfully.');
  } catch (error: any) {
    throw new Error(`Failed to load data: ${error.message}`);
  }
};
