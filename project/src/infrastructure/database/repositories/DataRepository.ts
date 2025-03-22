// src/infrastructure/database/repositories/DataRepository.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../connection';
import { DataRecordEntity } from '../entities/DataRecordEntity';
import { DataRecord } from '../../../domain/models/DataRecord';

class DataRepository {
  private repository: Repository<DataRecordEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(DataRecordEntity);
  }

  async insertDataRecords(dataRecords: DataRecord[]): Promise<void> {
    const entities = dataRecords.map((record) => {
      const entity = new DataRecordEntity();
      entity.id = record.id;
      entity.city = record.city;
      entity.temperatureC = record.temperatureC;
      entity.temperatureF = record.temperatureF;
      entity.humidity = record.humidity;
      entity.weatherDescription = record.weatherDescription;
      entity.timestamp = record.timestamp;
      return entity;
    });

    await this.repository.save(entities);
  }

  async findData(options: { filter?: string; page: number; limit: number }): Promise<DataRecord[]> {
    const { filter, page, limit } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('data');

    if (filter) {
      queryBuilder.where('data.city LIKE :filter', { filter: `%${filter}%` });
    }

    queryBuilder.skip(skip).take(limit);

    const results = await queryBuilder.getMany();

    return results.map((entity) => ({
      id: entity.id,
      city: entity.city,
      temperatureC: entity.temperatureC,
      temperatureF: entity.temperatureF,
      humidity: entity.humidity,
      weatherDescription: entity.weatherDescription,
      timestamp: entity.timestamp,
    }));
  }
}

export default new DataRepository();
