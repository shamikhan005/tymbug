import { WebhookAnalyzer } from '@/app/lib/analyzer';
import { WebhookData } from '@/app/lib/webhooks/types';
import { NextResponse } from 'next/server';

const analyzer = new WebhookAnalyzer({
  azure_key: process.env.AZURE_OPENAI_KEY || '',
  azure_endpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
  deployment_name: 'gpt-4o',
  temperature: 0.1,
  max_tokens: 4096,
  cache_duration: 15 * 60 * 1000
});

export async function POST(request: Request) {
  try {
    const webhookData: WebhookData = await request.json();
    const analysis = await analyzer.analyzeWebhook(webhookData);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 