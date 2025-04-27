import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface FaultData {
  session_id: number;
  timestamp: string;
  user_id: number;
  device_context: {
    detected_models: string[];
    environment: string;
    last_export: string;
  };
  conversation_history: Array<{
    id: number;
    timestamp: string;
    role: string;
    content: string;
    media: any[];
    base64_images: Record<string, string>;
  }>;
  diagnostics: {
    components: string[];
    symptoms: string[];
    possible_models: string[];
    primary_problem: string;
    problem_description: string;
  };
  metadata: {
    message_count: number;
    has_images: boolean;
    extracted_timestamp: string;
    version: string;
  };
}

export const faultService = {
  async getFaultData(): Promise<FaultData | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/fault-data`);
      if (response.data.status === 'success') {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching fault data:', error);
      return null;
    }
  },

  async getFaultHistory() {
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

  async getDiagnostics() {
    try {
      const response = await axios.get(`${API_BASE_URL}/diagnostics`);
      if (response.data.status === 'success') {
        return response.data.diagnostics;
      }
      return null;
    } catch (error) {
      console.error('Error fetching diagnostics:', error);
      return null;
    }
  }
}; 