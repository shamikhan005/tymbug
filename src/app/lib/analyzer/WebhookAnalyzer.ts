import { AzureOpenAI } from "openai";
import { WebhookData } from '../webhooks/types';
import { AnalysisResult, AnalyzerConfig } from './types';
import { SYSTEM_PROMPT, buildAnalysisPrompt, FALLBACK_PROMPT } from './prompts';
import { processAnalysisResponse } from './processors';
import "@azure/openai/types";

export class WebhookAnalyzer {
  private client: AzureOpenAI;
  private config: AnalyzerConfig;
  private cache: Map<string, { result: AnalysisResult; timestamp: number }>;

  constructor(config: AnalyzerConfig) {
    if (!config.azure_endpoint || !config.azure_key) {
      throw new Error('Azure OpenAI endpoint and key are required');
    }

    this.client = new AzureOpenAI({
      apiKey: config.azure_key,
      endpoint: config.azure_endpoint,
      deployment: config.deployment_name,
      apiVersion: "2024-04-01-preview",
      dangerouslyAllowBrowser: true
    });

    this.config = {
      temperature: 0.1,
      max_tokens: 1000,
      cache_duration: 15 * 60 * 1000, 
      ...config
    };

    this.cache = new Map();
  }

  async analyzeWebhook(webhook: WebhookData): Promise<AnalysisResult> {
    const cacheKey = this.generateCacheKey(webhook);
    const cachedResult = this.getCachedResult(cacheKey);
    if (cachedResult) {
      console.log('Using cached analysis result');
      return cachedResult;
    }

    const startTime = Date.now();

    try {
      console.log('Sending webhook for analysis:', {
        provider: webhook.provider,
        method: webhook.method,
        path: webhook.path
      });

      const response = await this.client.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildAnalysisPrompt(webhook) }
        ],
        model: this.config.deployment_name,
        temperature: this.config.temperature,
        max_tokens: this.config.max_tokens,
        response_format: { type: "json_object" }
      });

      console.log('Raw API Response:', JSON.stringify(response, null, 2));

      const result = processAnalysisResponse(response);
      result.processing_time = Date.now() - startTime;

      if (this.isValidAnalysisResult(result)) {
        this.cacheResult(cacheKey, result);
      }
      
      return result;
    } catch (error) {
      console.error('Error analyzing webhook:', error);
      return this.fallbackAnalysis(webhook);
    }
  }

  private isValidAnalysisResult(result: AnalysisResult): boolean {
    return (
      Array.isArray(result.patterns) &&
      Array.isArray(result.schema_improvements) &&
      Array.isArray(result.security_risks) &&
      Array.isArray(result.potential_issues) &&
      typeof result.confidence_score === 'number' &&
      result.confidence_score >= 0
    );
  }

  private async fallbackAnalysis(webhook: WebhookData): Promise<AnalysisResult> {
    try {
      console.log('Attempting fallback analysis');
      
      const response = await this.client.chat.completions.create({
        messages: [
          {
            role: "user",
            content: FALLBACK_PROMPT.replace(
              "{webhook_data}",
              JSON.stringify(webhook, null, 2)
            )
          }
        ],
        model: this.config.deployment_name,
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      console.log('Fallback Raw Response:', JSON.stringify(response, null, 2));
      
      return processAnalysisResponse(response);
    } catch (error) {
      console.error('Fallback analysis failed:', error);
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
  }

  private generateCacheKey(webhook: WebhookData): string {
    const keyData = {
      provider: webhook.provider,
      method: webhook.method,
      path: webhook.path,
      bodyHash: this.hashObject(webhook.body),
      headersHash: this.hashObject(webhook.headers),
      model: this.config.deployment_name
    };
    return JSON.stringify(keyData);
  }

  private hashObject(obj: any): string {
    return JSON.stringify(obj)
      .split('')
      .reduce((hash, char) => {
        return ((hash << 5) - hash) + char.charCodeAt(0) | 0;
      }, 0)
      .toString(36);
  }

  private getCachedResult(key: string): AnalysisResult | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.config.cache_duration!) {
      this.cache.delete(key);
      return null;
    }

    return cached.result;
  }

  private cacheResult(key: string, result: AnalysisResult): void {
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });

    this.cleanCache();
  }

  private cleanCache(): void {
    const now = Date.now();
    const maxCacheSize = 100;

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.config.cache_duration!) {
        this.cache.delete(key);
      }
    }

    if (this.cache.size > maxCacheSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, entries.length - maxCacheSize);
      for (const [key] of toRemove) {
        this.cache.delete(key);
      }
    }
  }
} 