"use client";

import { useState, useEffect, useCallback } from 'react';
import { AnalysisResult } from '../lib/analyzer/types';
import { WebhookData } from '../lib/webhooks/types';

interface WebhookAnalysisProps {
  webhook: WebhookData;
}

export default function WebhookAnalysis({ webhook }: WebhookAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeWebhook = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhook),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis request failed');
      }

      const result = await response.json();
      console.log('Analysis result:', result);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }, [webhook]);

  useEffect(() => {
    analyzeWebhook();
  }, [analyzeWebhook]);

  const renderSeverityBadge = (severity: 'low' | 'medium' | 'high') => (
    <span className={`text-xs px-2 py-1 rounded-full ${
      severity === 'high' ? 'bg-red-500/20 text-red-400' :
      severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
      'bg-blue-500/20 text-blue-400'
    }`}>
      {severity}
    </span>
  );

  if (loading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
        <p className="text-red-400">Analysis Error: {error}</p>
        <button 
          onClick={analyzeWebhook}
          className="mt-2 px-3 py-1 bg-red-800/30 hover:bg-red-800/50 text-red-300 rounded text-sm"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-200">Analysis Results</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Confidence:</span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            analysis.confidence_score > 0.7 ? 'bg-green-500/20 text-green-400' :
            analysis.confidence_score > 0.4 ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {Math.round(analysis.confidence_score * 100)}%
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Identified Patterns</h4>
        <div className="space-y-2">
          {analysis.patterns && analysis.patterns.length > 0 ? (
            analysis.patterns.map((pattern, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-200">{pattern.type}</span>
                    <p className="text-sm text-gray-400 mt-1">{pattern.description}</p>
                    {pattern.examples && pattern.examples.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Examples:</span>
                        <ul className="list-disc list-inside mt-1">
                          {pattern.examples.map((example, i) => (
                            <li key={i} className="text-xs text-gray-400">{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end ml-4">
                    {pattern.path && (
                      <span className="text-xs text-gray-500">Path: {pattern.path}</span>
                    )}
                    <span className="text-xs text-gray-400 mt-1">
                      Confidence: {Math.round((pattern.confidence || 0) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No patterns identified</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Security Risks</h4>
        <div className="space-y-2">
          {analysis.security_risks && analysis.security_risks.length > 0 ? (
            analysis.security_risks.map((risk, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded-lg border-l-4 border-red-500">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-red-400">{risk.risk_type}</span>
                  {risk.severity && renderSeverityBadge(risk.severity)}
                </div>
                <p className="text-sm text-gray-400 mb-2">{risk.description}</p>
                <div className="space-y-2">
                  {risk.mitigation && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-400">Mitigation: </span>
                      {risk.mitigation}
                    </p>
                  )}
                  {risk.affected_fields && risk.affected_fields.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-gray-500">Affected fields:</span>
                      {risk.affected_fields.map((field, i) => (
                        <span key={i} className="text-xs bg-gray-700/50 px-2 py-0.5 rounded">
                          {field}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No security risks identified</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Suggested Improvements</h4>
        <div className="space-y-2">
          {analysis.schema_improvements && analysis.schema_improvements.length > 0 ? (
            analysis.schema_improvements.map((improvement, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-blue-400">{improvement.field}</span>
                  <div className="text-xs text-gray-500">
                    {improvement.current_type} → {improvement.suggested_type}
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">{improvement.reason}</p>
                {improvement.example && (
                  <div className="text-xs bg-gray-900/50 p-2 rounded">
                    <span className="text-gray-500">Example: </span>
                    <code className="text-green-400">{improvement.example}</code>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No schema improvements suggested</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Potential Issues</h4>
        <div className="space-y-2">
          {analysis.potential_issues && analysis.potential_issues.length > 0 ? (
            analysis.potential_issues.map((issue, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-400">{issue.issue_type}</span>
                  <div className="flex items-center gap-2">
                    {issue.impact && renderSeverityBadge(issue.impact)}
                    {typeof issue.probability === 'number' && (
                      <span className="text-xs text-gray-500">
                        {Math.round(issue.probability * 100)}% probability
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">{issue.description}</p>
                {issue.prevention && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-400">Prevention: </span>
                    {issue.prevention}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No potential issues identified</p>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 text-right">
        Processed in {Math.round(analysis.processing_time)}ms
      </div>
    </div>
  );
} 