import { DataRecord } from '../models/DataRecord';
import DataRepository from '../../infrastructure/database/repositories/DataRepository';

interface GetDataOptions {
  filter?: string;
  page: number;
  limit: number;
}

interface CacheEntry {
  timestamp: number;
  data: DataRecord[];
}

class DataService {
  // In-memory cache mapping a key (derived from options) to a cache entry.
  private static cache: Map<string, CacheEntry> = new Map();
  // Cache time-to-live in milliseconds (example: 5 minutes)
  private static CACHE_TTL = 5 * 60 * 1000;

  /**
   * Generate a cache key based on the options.
   * @param options - The filtering and pagination options.
   * @returns A string key to use for caching.
   */
  private static getCacheKey(options: GetDataOptions): string {
    return JSON.stringify(options);
  }

  /**
   * Retrieves weather data records based on filter and pagination options.
   * Uses in-memory caching to reduce database load.
   * @param options - Object containing filter, page, and limit.
   * @returns A promise that resolves to an array of DataRecord objects.
   */
  static async getData(options: GetDataOptions): Promise<DataRecord[]> {
    const cacheKey = this.getCacheKey(options);
    const now = Date.now();

    // Check if cached data exists and is still valid
    if (this.cache.has(cacheKey)) {
      const entry = this.cache.get(cacheKey)!;
      if (now - entry.timestamp < this.CACHE_TTL) {
        return entry.data;
      } else {
        // Cache expired, remove it.
        this.cache.delete(cacheKey);
      }
    }

    // If no valid cache exists, fetch from the repository.
    const data: DataRecord[] = await DataRepository.findData(options);

    // Store the result in cache.
    this.cache.set(cacheKey, { timestamp: now, data });
    
    return data;
  }
}

export default DataService;
