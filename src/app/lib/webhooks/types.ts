import { z } from "zod";

export interface WebhookPayload {
  headers: Record<string, string>;
  body: any;
  provider: string;
  path: string;
  method: string;
}

export interface WebhookHandlerResult {
  isValid: boolean;
  payload: WebhookPayload;
  metadata?: Record<string, any>;
  error?: string;
}

export const BaseWebhookSchema = z.object({
  headers: z.record(z.string()),
  body: z.record(z.any())
});

export interface WebhookHandler {
  canHandle(provider: string): boolean;
  
  validateWebhook(request: Request, provider: string): Promise<WebhookHandlerResult>;
  
  processWebhook(result: WebhookHandlerResult, userId: string): Promise<string>;
}

export interface WebhookData {
  provider: string;
  method: string;
  path: string;
  headers: Record<string, any>;
  body: Record<string, any>;
} 