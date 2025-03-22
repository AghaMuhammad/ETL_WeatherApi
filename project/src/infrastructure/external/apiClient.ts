// src/infrastructure/external/apiClient.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiClient = axios.create({
  baseURL: 'http://api.openweathermap.org/data/2.5',
  timeout: 5000,
  params: {
    appid: process.env.API_KEY,
  },
});

export default apiClient;
