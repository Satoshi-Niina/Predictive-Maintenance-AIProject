import axios from 'axios';

export interface MachineData {
  id: string;
  type: string;
  model: string;
  specifications: Record<string, any>;
  maintenanceHistory: MaintenanceRecord[];
  technicalDocuments: TechnicalDocument[];
}

export interface TechnicalDocument {
  id: string;
  type: string;
  content: any;
  uploadedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  machineId: string;
  date: string;
  type: 'routine' | 'repair' | 'inspection';
  description: string;
  status: 'completed' | 'pending' | 'failed';
  details: Record<string, any>;
}

export interface FailurePrediction {
  machineId: string;
  predictedFailure: string;
  confidence: number;
  recommendedActions: string[];
  preventiveMeasures: string[];
}

export class DataProcessor {
  private static instance: DataProcessor;
  private machineData: Map<string, MachineData> = new Map();
  private maintenanceRecords: Map<string, MaintenanceRecord[]> = new Map();
  private apiBaseUrl: string = 'http://localhost:3001/api';

  private constructor() {
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/machines`);
      const machines = response.data;
      machines.forEach((machine: MachineData) => {
        this.machineData.set(machine.id, machine);
      });
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  public static getInstance(): DataProcessor {
    if (!DataProcessor.instance) {
      DataProcessor.instance = new DataProcessor();
    }
    return DataProcessor.instance;
  }

  public async processTechnicalDocument(file: File): Promise<void> {
    const fileType = file.type;
    let content: any;

    switch (fileType) {
      case 'application/json':
        content = await this.processJSON(file);
        break;
      case 'text/plain':
        content = await this.processText(file);
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        content = await this.processExcel(file);
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

    await this.updateMachineData(content);
  }

  private async processJSON(file: File): Promise<any> {
    const text = await file.text();
    return JSON.parse(text);
  }

  private async processText(file: File): Promise<string> {
    return await file.text();
  }

  private async processExcel(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${this.apiBaseUrl}/process/excel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error processing Excel file:', error);
      throw error;
    }
  }

  private async updateMachineData(data: any): Promise<void> {
    try {
      // データの検証と正規化
      const normalizedData = this.normalizeMachineData(data);
      
      // バックエンドに保存
      await axios.post(`${this.apiBaseUrl}/machines`, normalizedData);
      
      // メモリに保存
      this.machineData.set(normalizedData.id, normalizedData);
    } catch (error) {
      console.error('Error updating machine data:', error);
      throw error;
    }
  }

  private normalizeMachineData(data: any): MachineData {
    return {
      id: data.id || this.generateId(),
      type: data.type || 'unknown',
      model: data.model || 'unknown',
      specifications: data.specifications || {},
      maintenanceHistory: data.maintenanceHistory || [],
      technicalDocuments: data.technicalDocuments || []
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  public async addExternalData(data: any): Promise<void> {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/external-data`, data);
      const processedData = response.data;
      
      // 既存のデータと統合
      const machineId = processedData.machineId;
      const existingData = this.machineData.get(machineId);
      
      if (existingData) {
        const updatedData = {
          ...existingData,
          ...processedData,
          technicalDocuments: [
            ...existingData.technicalDocuments,
            ...processedData.technicalDocuments
          ]
        };
        
        this.machineData.set(machineId, updatedData);
      } else {
        this.machineData.set(machineId, processedData);
      }
    } catch (error) {
      console.error('Error adding external data:', error);
      throw error;
    }
  }

  public async predictFailure(machineId: string): Promise<FailurePrediction> {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/predict`, { machineId });
      return response.data;
    } catch (error) {
      console.error('Error predicting failure:', error);
      throw error;
    }
  }

  public async generateMaintenanceSchedule(machineId: string): Promise<string[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/maintenance-schedule/${machineId}`);
      return response.data;
    } catch (error) {
      console.error('Error generating maintenance schedule:', error);
      throw error;
    }
  }

  public getMachineData(machineId: string): MachineData | undefined {
    return this.machineData.get(machineId);
  }

  public getMaintenanceRecords(machineId: string): MaintenanceRecord[] {
    return this.maintenanceRecords.get(machineId) || [];
  }
} 