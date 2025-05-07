import { WebhookData } from '../webhooks/types';

export interface AnalysisResult {
  patterns: Pattern[];
  anomalies: Anomaly[];
  security_risks: SecurityRisk[];
  schema_improvements: SchemaImprovement[];
  potential_issues: PotentialIssue[];
  confidence_score: number;
  processing_time: number;
}

export interface Pattern {
  type: string;
  description: string;
  path: string;
  confidence: number;
  examples: string[];
}

export interface Anomaly {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  location: string;
  suggestion: string;
}

export interface SecurityRisk {
  risk_type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  mitigation: string;
  affected_fields: string[];
}

export interface SchemaImprovement {
  field: string;
  current_type: string;
  suggested_type: string;
  reason: string;
  example: string;
}

export interface PotentialIssue {
  issue_type: string;
  description: string;
  probability: number;
  impact: 'low' | 'medium' | 'high';
  prevention: string;
}

export interface AnalyzerConfig {
  temperature?: number;
  max_tokens?: number;
  azure_key: string;
  azure_endpoint: string;
  deployment_name: string;
  cache_duration?: number;
} 