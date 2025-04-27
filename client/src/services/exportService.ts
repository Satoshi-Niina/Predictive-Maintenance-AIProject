import axios from 'axios';
import { FaultData } from './faultService';
import { AnalysisResult } from './analysisService';
import { HistoryData } from './historyService';

const API_BASE_URL = 'http://localhost:8000/api';

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeAnalysis?: boolean;
  includeHistory?: boolean;
  includeDiagnostics?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export const exportService = {
  async exportFaultData(
    faultData: FaultData,
    analysisResult: AnalysisResult | null,
    options: ExportOptions
  ): Promise<Blob> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/export`,
        {
          faultData,
          analysisResult,
          options
        },
        {
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting fault data:', error);
      throw new Error('エクスポートに失敗しました');
    }
  },

  async exportHistoryData(
    historyData: HistoryData[],
    options: ExportOptions
  ): Promise<Blob> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/export-history`,
        {
          historyData,
          options
        },
        {
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting history data:', error);
      throw new Error('履歴データのエクスポートに失敗しました');
    }
  },

  async exportReport(
    faultData: FaultData,
    analysisResult: AnalysisResult | null,
    historyData: HistoryData[],
    options: ExportOptions
  ): Promise<Blob> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/export-report`,
        {
          faultData,
          analysisResult,
          historyData,
          options
        },
        {
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw new Error('レポートのエクスポートに失敗しました');
    }
  }
}; 