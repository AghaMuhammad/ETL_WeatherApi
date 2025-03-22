export interface DataRecord {
    // A unique identifier for the record, could be the city name or an API-generated ID.
    id: string;
    // Name of the city or location.
    city: string;
    // Temperature in Celsius as provided by the API.
    temperatureC: number;
    // Temperature in Fahrenheit computed during the transformation.
    temperatureF: number;
    // Relative humidity percentage.
    humidity: number;
    // Brief description of the weather conditions.
    weatherDescription: string;
    // Timestamp when the record was created or updated.
    timestamp: Date;
  }
  