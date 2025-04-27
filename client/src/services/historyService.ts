import axios from 'axios';
import { FaultData } from './faultService';

const API_BASE_URL = 'http://localhost:8000/api';

export interface HistoryData {
  timestamp: string;
  faultType: string;
  severity: 'high' | 'medium' | 'low';
  status: 'resolved' | 'pending' | 'investigating';
  description: string;
}

export interface HistoryStats {
  totalFaults: number;
  resolvedFaults: number;
  pendingFaults: number;
  investigatingFaults: number;
  faultTypes: Array<{
    type: string;
    count: number;
  }>;
  severityDistribution: Array<{
    severity: string;
    count: number;
  }>;
}

export const historyService = {
  async getFaultHistory(): Promise<HistoryData[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/fault-history`);
      if (response.data.status === 'success') {
        return response.data.history;
      }
      return [];
    } catch (error) {
      console.error('Error fetching fault history:', error);
      return [];
    }
  },

  async getHistoryStats(): Promise<HistoryStats | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/history-stats`);
      if (response.data.status === 'success') {
        return response.data.stats;
      }
      return null;
    } catch (error) {
      console.error('Error fetching history stats:', error);
      return null;
    }
  },

  async getFaultTrends(): Promise<Array<{
    date: string;
    count: number;
  }>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/fault-trends`);
      if (response.data.status === 'success') {
        return response.data.trends;
      }
      return [];
    } catch (error) {
      console.error('Error fetching fault trends:', error);
      return [];
    }
  }
}; 