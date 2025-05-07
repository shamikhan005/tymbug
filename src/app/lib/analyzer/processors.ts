import { AnalysisResult } from './types';

export function processAnalysisResponse(response: any): AnalysisResult {
  try {
    console.log('Processing response:', JSON.stringify(response, null, 2));
    
    if (!response || !response.choices || !Array.isArray(response.choices) || !response.choices[0]) {
      console.error('Invalid response structure:', response);
      return createEmptyAnalysis();
    }

    const messageContent = response.choices[0].message?.content;
    console.log('Message content:', messageContent);
    
    let content: any;
    
    if (typeof messageContent === 'string') {
      try {
        const cleanContent = messageContent
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();
          
        console.log('Cleaned content:', cleanContent);
        content = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('Error parsing LLM response:', parseError);
        console.log('Failed to parse content:', messageContent);
        return createEmptyAnalysis();
      }
    } else if (typeof messageContent === 'object' && messageContent !== null) {
      content = messageContent;
    } else {
      console.error('Unexpected message content type:', typeof messageContent);
      return createEmptyAnalysis();
    }

    console.log('Parsed content:', JSON.stringify(content, null, 2));

    const result = {
      patterns: validatePatterns(content.patterns),
      anomalies: validateAnomalies(content.anomalies),
      security_risks: validateSecurityRisks(content.security_risks),
      schema_improvements: validateSchemaImprovements(content.schema_improvements),
      potential_issues: validatePotentialIssues(content.potential_issues),
      confidence_score: calculateConfidenceScore(content),
      processing_time: response.usage?.total_tokens ? response.usage.total_tokens * 0.1 : 0
    };

    console.log('Final processed result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error processing analysis response:', error);
    return createEmptyAnalysis();
  }
}

function validatePatterns(value: any): any[] {
  if (!Array.isArray(value)) return [];
  
  return value.filter(pattern => (
    typeof pattern === 'object' &&
    pattern !== null &&
    typeof pattern.type === 'string' &&
    typeof pattern.description === 'string'
  )).map(pattern => ({
    ...pattern,
    confidence: typeof pattern.confidence === 'number' ? pattern.confidence : 0,
    examples: Array.isArray(pattern.examples) ? pattern.examples : [],
    path: typeof pattern.path === 'string' ? pattern.path : ''
  }));
}

function validateAnomalies(value: any): any[] {
  if (!Array.isArray(value)) return [];
  
  return value.filter(anomaly => (
    typeof anomaly === 'object' &&
    anomaly !== null &&
    typeof anomaly.type === 'string' &&
    typeof anomaly.description === 'string'
  )).map(anomaly => ({
    ...anomaly,
    severity: ['low', 'medium', 'high'].includes(anomaly.severity) ? anomaly.severity : 'medium',
    location: typeof anomaly.location === 'string' ? anomaly.location : '',
    suggestion: typeof anomaly.suggestion === 'string' ? anomaly.suggestion : ''
  }));
}

function validateSecurityRisks(value: any): any[] {
  if (!Array.isArray(value)) return [];
  
  return value.filter(risk => (
    typeof risk === 'object' &&
    risk !== null &&
    typeof risk.risk_type === 'string' &&
    typeof risk.description === 'string'
  )).map(risk => ({
    ...risk,
    severity: ['low', 'medium', 'high'].includes(risk.severity) ? risk.severity : 'medium',
    mitigation: typeof risk.mitigation === 'string' ? risk.mitigation : '',
    affected_fields: Array.isArray(risk.affected_fields) ? risk.affected_fields : []
  }));
}

function validateSchemaImprovements(value: any): any[] {
  if (!Array.isArray(value)) {
    console.warn('Schema improvements is not an array:', value);
    return [];
  }
  
  return value.filter(improvement => (
    typeof improvement === 'object' &&
    improvement !== null &&
    typeof improvement.field === 'string' &&
    typeof improvement.current_type === 'string' &&
    typeof improvement.suggested_type === 'string'
  )).map(improvement => ({
    ...improvement,
    reason: typeof improvement.reason === 'string' ? improvement.reason : '',
    example: typeof improvement.example === 'string' ? improvement.example : ''
  }));
}

function validatePotentialIssues(value: any): any[] {
  if (!Array.isArray(value)) return [];
  
  return value.filter(issue => (
    typeof issue === 'object' &&
    issue !== null &&
    typeof issue.issue_type === 'string' &&
    typeof issue.description === 'string'
  )).map(issue => ({
    ...issue,
    probability: typeof issue.probability === 'number' ? issue.probability : 0.5,
    impact: ['low', 'medium', 'high'].includes(issue.impact) ? issue.impact : 'medium',
    prevention: typeof issue.prevention === 'string' ? issue.prevention : ''
  }));
}

function calculateConfidenceScore(content: any): number {
  try {
    let score = 0;
    let total = 0;

    if (Array.isArray(content.patterns)) {
      score += content.patterns.reduce((acc: number, p: any) => acc + (p.confidence || 0), 0);
      total += content.patterns.length;
    }

    if (Array.isArray(content.anomalies)) {
      score += content.anomalies.length * 0.8;
      total += content.anomalies.length;
    }

    if (Array.isArray(content.security_risks)) {
      score += content.security_risks.length * 0.9;
      total += content.security_risks.length;
    }

    if (Array.isArray(content.schema_improvements)) {
      score += content.schema_improvements.length * 0.7;
      total += content.schema_improvements.length;
    }

    if (Array.isArray(content.potential_issues)) {
      score += content.potential_issues.length * 0.6;
      total += content.potential_issues.length;
    }

    const finalScore = total > 0 ? (score / total) : 0;
    return Math.min(Math.max(finalScore, 0), 1); // Ensure score is between 0 and 1
  } catch (error) {
    console.error('Error calculating confidence score:', error);
    return 0;
  }
}

function createEmptyAnalysis(): AnalysisResult {
  return {
    patterns: [],
    anomalies: [],
    security_risks: [],
    schema_improvements: [],
    potential_issues: [],
    confidence_score: 0,
    processing_time: 0
  };
} 