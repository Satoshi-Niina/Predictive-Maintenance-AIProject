export interface FaultRecord {
  id: string;
  timestamp: string;
  affectedComponents: string[];
  primaryProblem: string;
  problemDescription: string;
  severity: 'low' | 'medium' | 'high';
  status: 'New' | 'In Progress' | 'Resolved';
} 