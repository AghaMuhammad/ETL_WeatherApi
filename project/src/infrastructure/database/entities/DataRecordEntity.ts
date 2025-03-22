// src/infrastructure/database/entities/DataRecordEntity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'data_records' })
export class DataRecordEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  city!: string;

  @Column('float')
  temperatureC!: number;

  @Column('float')
  temperatureF!: number;

  @Column('int')
  humidity!: number;

  @Column()
  weatherDescription!: string;

  @Column('datetime')
  timestamp!: Date;
}
