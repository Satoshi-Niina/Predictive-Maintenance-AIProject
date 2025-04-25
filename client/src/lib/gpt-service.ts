import axios from 'axios';
import { MachineData, MaintenanceRecord, FailurePrediction } from './data-processor';

export class GPTService {
  private static instance: GPTService;
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';

  private constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  public static getInstance(): GPTService {
    if (!GPTService.instance) {
      GPTService.instance = new GPTService();
    }
    return GPTService.instance;
  }

  public async analyzeFailure(
    machineData: MachineData,
    maintenanceRecords: MaintenanceRecord[]
  ): Promise<FailurePrediction> {
    const prompt = this.generateFailureAnalysisPrompt(machineData, maintenanceRecords);
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in machine maintenance and failure analysis.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parseGPTResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error in GPT analysis:', error);
      throw error;
    }
  }

  private generateFailureAnalysisPrompt(
    machineData: MachineData,
    maintenanceRecords: MaintenanceRecord[]
  ): string {
    return `
      Analyze the following machine data and maintenance records to predict potential failures and recommend preventive measures:
      
      Machine Information:
      - Type: ${machineData.type}
      - Model: ${machineData.model}
      - Specifications: ${JSON.stringify(machineData.specifications)}
      
      Maintenance History:
      ${maintenanceRecords.map(record => `
        - Date: ${record.date}
        - Type: ${record.type}
        - Description: ${record.description}
        - Status: ${record.status}
      `).join('\n')}
      
      Please provide:
      1. Predicted failure points
      2. Confidence level for each prediction
      3. Recommended preventive measures
      4. Suggested maintenance schedule
    `;
  }

  private parseGPTResponse(response: string): FailurePrediction {
    // TODO: Implement response parsing logic
    return {
      machineId: '',
      predictedFailure: '',
      confidence: 0,
      recommendedActions: [],
      preventiveMeasures: []
    };
  }

  public async generateMaintenanceSchedule(
    machineData: MachineData,
    failurePrediction: FailurePrediction
  ): Promise<string[]> {
    const prompt = this.generateMaintenanceSchedulePrompt(machineData, failurePrediction);
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in creating maintenance schedules for industrial machinery.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parseMaintenanceSchedule(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error in GPT schedule generation:', error);
      throw error;
    }
  }

  private generateMaintenanceSchedulePrompt(
    machineData: MachineData,
    failurePrediction: FailurePrediction
  ): string {
    return `
      Create a detailed maintenance schedule based on the following information:
      
      Machine Information:
      - Type: ${machineData.type}
      - Model: ${machineData.model}
      
      Predicted Failures:
      ${failurePrediction.predictedFailure}
      
      Confidence Level: ${failurePrediction.confidence}
      
      Please provide:
      1. Daily maintenance tasks
      2. Weekly inspection points
      3. Monthly maintenance procedures
      4. Quarterly comprehensive checks
      5. Annual overhaul recommendations
    `;
  }

  private parseMaintenanceSchedule(response: string): string[] {
    // TODO: Implement schedule parsing logic
    return [];
  }
} 