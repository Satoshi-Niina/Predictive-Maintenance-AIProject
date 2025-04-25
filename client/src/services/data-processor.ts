import axios from 'axios';

export interface ProcessedData {
  machineId: string;
  timestamp: string;
  data: any;
}

class DataProcessor {
  private static instance: DataProcessor;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = 'http://localhost:3002/api';
  }

  public static getInstance(): DataProcessor {
    if (!DataProcessor.instance) {
      DataProcessor.instance = new DataProcessor();
    }
    return DataProcessor.instance;
  }

  async loadInitialData(): Promise<ProcessedData[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/machines`);
      return response.data;
    } catch (error) {
      console.error('Error loading initial data:', error);
      return [];
    }
  }

  async processData(machineId: string, data: any): Promise<ProcessedData> {
    try {
      const response = await axios.post(`${this.baseUrl}/process`, {
        machineId,
        data
      });
      return response.data;
    } catch (error) {
      console.error('Error processing data:', error);
      throw error;
    }
  }
}

export default DataProcessor; 