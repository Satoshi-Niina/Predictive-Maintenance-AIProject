import axios from 'axios';
import { FaultData } from './faultService';

const API_BASE_URL = 'http://localhost:8000/api';

export interface SearchResult {
  id: number;
  timestamp: string;
  faultType: string;
  severity: 'high' | 'medium' | 'low';
  status: 'resolved' | 'pending' | 'investigating';
  description: string;
  components: string[];
  solution?: string;
}

export interface SearchFilters {
  faultType?: string;
  severity?: 'high' | 'medium' | 'low';
  status?: 'resolved' | 'pending' | 'investigating';
  startDate?: string;
  endDate?: string;
  components?: string[];
}

export const searchService = {
  async searchFaults(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/search`, {
        query,
        filters
      });
      if (response.data.status === 'success') {
        return response.data.results;
      }
      return [];
    } catch (error) {
      console.error('Error searching faults:', error);
      return [];
    }
  },

  async getFaultTypes(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/fault-types`);
      if (response.data.status === 'success') {
        return response.data.types;
      }
      return [];
    } catch (error) {
      console.error('Error fetching fault types:', error);
      return [];
    }
  },

  async getComponents(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/components`);
      if (response.data.status === 'success') {
        return response.data.components;
      }
      return [];
    } catch (error) {
      console.error('Error fetching components:', error);
      return [];
    }
  }
}; 