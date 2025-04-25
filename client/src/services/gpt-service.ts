import axios from 'axios';

export class GPTService {
  private static instance: GPTService;
  private apiKey: string;
  private baseUrl: string;

  private constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1';
  }

  public static getInstance(): GPTService {
    if (!GPTService.instance) {
      GPTService.instance = new GPTService();
    }
    return GPTService.instance;
  }

  async analyze(text: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '機械の故障分析を行うアシスタントです。'
            },
            {
              role: 'user',
              content: text
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw error;
    }
  }
} 