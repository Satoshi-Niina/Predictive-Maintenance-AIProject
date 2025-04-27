import axios from 'axios';
import { FaultData } from './faultService';
import { AnalysisResult } from './analysisService';
import { HistoryData } from './historyService';
import { PredictionResult } from './predictionService';

const API_BASE_URL = 'http://localhost:8000/api';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: Array<{
    id: string;
    title: string;
    type: 'fault_info' | 'analysis' | 'history' | 'prediction' | 'custom';
    content?: string;
  }>;
}

export interface ReportData {
  faultData: FaultData;
  analysisResult: AnalysisResult | null;
  historyData: HistoryData[];
  predictionResult: PredictionResult | null;
  customContent?: Record<string, string>;
}

export interface ReportOptions {
  template: string;
  format: 'pdf' | 'excel' | 'html';
  includeCharts: boolean;
  includeImages: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export const reportService = {
  async getTemplates(): Promise<ReportTemplate[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/report-templates`);
      if (response.data.status === 'success') {
        return response.data.templates;
      }
      return [];
    } catch (error) {
      console.error('Error fetching report templates:', error);
      return [];
    }
  },

  async generateReport(data: ReportData, options: ReportOptions): Promise<Blob> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-report`,
        {
          data,
          options
        },
        {
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('レポートの生成に失敗しました');
    }
  },

  async saveTemplate(template: ReportTemplate): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/save-template`, template);
      return response.data.status === 'success';
    } catch (error) {
      console.error('Error saving template:', error);
      return false;
    }
  },

  async deleteTemplate(templateId: string): Promise<boolean> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete-template/${templateId}`);
      return response.data.status === 'success';
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }
}; 