import { OpenAI } from 'langchain/llms/openai';
import { DocumentProcessor } from './documentProcessor';
import { PromptTemplate } from 'langchain/prompts';

export class AnalysisService {
  private documentProcessor: DocumentProcessor;
  private llm: OpenAI;

  constructor() {
    this.documentProcessor = new DocumentProcessor();
    this.llm = new OpenAI({
      temperature: 0.7,
      modelName: 'gpt-4-turbo-preview',
    });
  }

  private async getContext(query: string): Promise<string> {
    const similarDocs = await this.documentProcessor.searchSimilarDocuments(query);
    return similarDocs.map(doc => doc.pageContent).join('\n\n');
  }

  async analyzeFailure(query: string): Promise<string> {
    const context = await this.getContext(query);
    
    const prompt = PromptTemplate.fromTemplate(`
      以下の情報を基に、機械故障の原因分析を行ってください。
      
      関連情報:
      {context}
      
      質問:
      {query}
      
      以下の形式で回答してください：
      1. 考えられる原因
      2. 確認すべき点
      3. 推奨される対策
    `);

    const formattedPrompt = await prompt.format({
      context,
      query,
    });

    return this.llm.call(formattedPrompt);
  }

  async predictMaintenanceItems(query: string): Promise<string> {
    const context = await this.getContext(query);
    
    const prompt = PromptTemplate.fromTemplate(`
      以下の情報を基に、点検時に確認すべき項目と交換が必要な部品を予測してください。
      
      関連情報:
      {context}
      
      質問:
      {query}
      
      以下の形式で回答してください：
      1. 点検項目
      2. 交換推奨部品
      3. 点検頻度の推奨
    `);

    const formattedPrompt = await prompt.format({
      context,
      query,
    });

    return this.llm.call(formattedPrompt);
  }

  async predictPreventiveMaintenance(schedule: string): Promise<string> {
    const context = await this.getContext(schedule);
    
    const prompt = PromptTemplate.fromTemplate(`
      以下の情報を基に、予防保全の計画を立ててください。
      
      関連情報:
      {context}
      
      スケジュール:
      {schedule}
      
      以下の形式で回答してください：
      1. 定期点検項目
      2. 部品交換計画
      3. 予算見積もり
    `);

    const formattedPrompt = await prompt.format({
      context,
      schedule,
    });

    return this.llm.call(formattedPrompt);
  }
} 