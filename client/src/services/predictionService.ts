import axios from 'axios';
import { FaultData } from './faultService';
import { HistoryData } from './historyService';

const API_BASE_URL = 'http://localhost:8000/api';

export interface PredictionResult {
  predictedFaults: Array<{
    component: string;
    probability: number;
    estimatedTime: string;
    severity: 'high' | 'medium' | 'low';
    recommendedActions: string[];
  }>;
  confidence: number;
  lastUpdated: string;
}

export interface PredictionHistory {
  timestamp: string;
  actualFaults: string[];
  predictedFaults: string[];
  accuracy: number;
}

export const predictionService = {
  async getPredictions(): Promise<PredictionResult | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/predictions`);
      if (response.data.status === 'success') {
        return response.data.result;
      }
      return null;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return null;
    }
  },

  async getPredictionHistory(): Promise<PredictionHistory[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/prediction-history`);
      if (response.data.status === 'success') {
        return response.data.history;
      }
      return [];
    } catch (error) {
      console.error('Error fetching prediction history:', error);
      return [];
    }
  },

  async updatePredictionModel(): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/update-model`);
      return response.data.status === 'success';
    } catch (error) {
      console.error('Error updating prediction model:', error);
      return false;
    }
  },

  async getPredictionAccuracy(): Promise<{
    overall: number;
    byComponent: Record<string, number>;
    bySeverity: Record<string, number>;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/prediction-accuracy`);
      if (response.data.status === 'success') {
        return response.data.accuracy;
      }
      return {
        overall: 0,
        byComponent: {},
        bySeverity: {}
      };
    } catch (error) {
      console.error('Error fetching prediction accuracy:', error);
      return {
        overall: 0,
        byComponent: {},
        bySeverity: {}
      };
    }
  }
}; 