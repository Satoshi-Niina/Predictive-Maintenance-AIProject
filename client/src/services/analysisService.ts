import axios from 'axios';
import { FaultData } from './faultService';

const API_BASE_URL = 'http://localhost:8000/api';

export interface AnalysisResult {
  faultPattern: string;
  severity: 'high' | 'medium' | 'low';
  recommendedActions: string[];
  similarCases: Array<{
    id: number;
    description: string;
    solution: string;
  }>;
}

export const analysisService = {
  async analyzeFaultData(faultData: FaultData): Promise<AnalysisResult | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, faultData);
      if (response.data.status === 'success') {
        return response.data.result;
      }
      return null;
    } catch (error) {
      console.error('Error analyzing fault data:', error);
      return null;
    }
  },

  async getFaultPatterns(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/fault-patterns`);
      if (response.data.status === 'success') {
        return response.data.patterns;
      }
      return [];
    } catch (error) {
      console.error('Error fetching fault patterns:', error);
      return [];
    }
  },

  async getSimilarCases(problem: string): Promise<Array<{
    id: number;
    description: string;
    solution: string;
  }>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/similar-cases`, { problem });
      if (response.data.status === 'success') {
        return response.data.cases;
      }
      return [];
    } catch (error) {
      console.error('Error fetching similar cases:', error);
      return [];
    }
  }
}; 