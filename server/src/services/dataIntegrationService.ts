import { OpenAI } from 'langchain/llms/openai';
import { DocumentProcessor } from './documentProcessor';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class DataIntegrationService {
  private documentProcessor: DocumentProcessor;
  private llm: OpenAI;

  constructor() {
    this.documentProcessor = new DocumentProcessor();
    this.llm = new OpenAI({
      temperature: 0.7,
      modelName: 'gpt-4-turbo-preview',
    });
  }

  // ナレッジデータと故障報告の統合
  async integrateData(machineId: string): Promise<any> {
    try {
      const dataDir = path.join(__dirname, '../../data');
      const knowledgePath = path.join(dataDir, 'knowledge', machineId, 'processed');
      const externalPath = path.join(dataDir, 'external', machineId, 'processed');

      // ナレッジデータの読み込み
      const knowledgeData = await this.loadProcessedData(knowledgePath);
      
      // 故障報告データの読み込み
      const failureReports = await this.loadProcessedData(externalPath);

      // データの統合と分析
      const integratedData = {
        machineId,
        knowledge: knowledgeData,
        failureReports,
        lastUpdated: new Date().toISOString()
      };

      // 統合データの保存
      const savePath = path.join(dataDir, 'integrated', machineId);
      if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath, { recursive: true });
      }

      const saveFileName = `${Date.now()}_integrated.json`;
      fs.writeFileSync(
        path.join(savePath, saveFileName),
        JSON.stringify(integratedData, null, 2)
      );

      return integratedData;
    } catch (error) {
      console.error('Error integrating data:', error);
      throw error;
    }
  }

  // 新しい故障報告の処理と分析
  async processNewFailureReport(machineId: string, reportData: any): Promise<any> {
    try {
      // 故障報告の分析
      const analysisPrompt = `
        以下の故障報告を分析し、考えられる原因と対策を提案してください。
        故障報告: ${JSON.stringify(reportData)}
      `;

      const analysis = await this.llm.call(analysisPrompt);

      // 分析結果の保存
      const dataDir = path.join(__dirname, '../../data');
      const analysisPath = path.join(dataDir, 'analysis', machineId);
      if (!fs.existsSync(analysisPath)) {
        fs.mkdirSync(analysisPath, { recursive: true });
      }

      const analysisResult = {
        machineId,
        reportData,
        analysis,
        timestamp: new Date().toISOString()
      };

      const saveFileName = `${Date.now()}_analysis.json`;
      fs.writeFileSync(
        path.join(analysisPath, saveFileName),
        JSON.stringify(analysisResult, null, 2)
      );

      return analysisResult;
    } catch (error) {
      console.error('Error processing failure report:', error);
      throw error;
    }
  }

  // 対策の詳細分析
  async analyzeCountermeasures(machineId: string, analysisId: string): Promise<any> {
    try {
      const dataDir = path.join(__dirname, '../../data');
      const analysisPath = path.join(dataDir, 'analysis', machineId, `${analysisId}_analysis.json`);

      if (!fs.existsSync(analysisPath)) {
        throw new Error('Analysis not found');
      }

      const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));

      // 対策の詳細分析
      const countermeasurePrompt = `
        以下の故障分析に基づいて、具体的な対策案を提案してください。
        また、各対策の実施優先度と期待される効果も含めてください。
        
        分析結果: ${JSON.stringify(analysis.analysis)}
      `;

      const countermeasures = await this.llm.call(countermeasurePrompt);

      // 対策分析結果の保存
      const countermeasureResult = {
        machineId,
        analysisId,
        countermeasures,
        timestamp: new Date().toISOString()
      };

      const saveFileName = `${Date.now()}_countermeasures.json`;
      fs.writeFileSync(
        path.join(dataDir, 'analysis', machineId, saveFileName),
        JSON.stringify(countermeasureResult, null, 2)
      );

      return countermeasureResult;
    } catch (error) {
      console.error('Error analyzing countermeasures:', error);
      throw error;
    }
  }

  private async loadProcessedData(directory: string): Promise<any[]> {
    if (!fs.existsSync(directory)) {
      return [];
    }

    const files = fs.readdirSync(directory)
      .filter(file => file.endsWith('_processed.json'));

    return files.map(file => {
      const content = fs.readFileSync(path.join(directory, file), 'utf-8');
      return JSON.parse(content);
    });
  }
} 