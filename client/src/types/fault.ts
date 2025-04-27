export interface FaultData {
  session_id: number;
  timestamp: string;
  user_id: number;
  device_context: {
    detected_models: string[];
    environment: string;
    last_export: string;
  };
  conversation_history: {
    id: number;
    timestamp: string;
    role: 'user' | 'assistant';
    content: string;
    media: string[];
    base64_images: Record<string, string>;
  }[];
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

export interface FaultRecord {
  id: string;
  timestamp: string;
  components: string[];
  primary_problem: string;
  problem_description: string;
  severity: 'low' | 'medium' | 'high';
  status: string;
} 