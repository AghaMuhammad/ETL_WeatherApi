import { DataSource } from 'typeorm';
import { DataRecordEntity } from './entities/DataRecordEntity';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'sqlite', // Change to 'postgres' for PostgreSQL if needed.
  database: process.env.DB_NAME || 'database.sqlite',
  synchronize: true, // For production, consider using migrations.
  logging: false,
  entities: [DataRecordEntity],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('Data Source has been initialized!');
    }
  })
  .catch((error) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error during Data Source initialization:', error);
    }
  });
