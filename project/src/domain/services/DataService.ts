import { DataRecord } from '../models/DataRecord';
// Import the repository interface or implementation from your infrastructure layer.
// In a more decoupled design, you might define an interface in the domain and inject an implementation.
import DataRepository from '../../infrastructure/database/repositories/DataRepository';

interface GetDataOptions {
  filter?: string;
  page: number;
  limit: number;
}

class DataService {
  /**
   * Retrieves weather data records based on filter and pagination options.
   * @param options - Object containing filter string, page number, and limit of records per page.
   * @returns A promise that resolves to an array of DataRecord objects.
   */
  static async getData(options: GetDataOptions): Promise<DataRecord[]> {
    // Fetch data using the repository.
    const data: DataRecord[] = await DataRepository.findData(options);

    // Additional business logic or data transformations could be performed here.
    // For example, you might integrate caching logic or further filter the results.

    return data;
  }
}

export default DataService;
