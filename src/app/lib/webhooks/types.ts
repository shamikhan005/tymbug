import { z } from "zod";

/**
 * Represents the standardized webhook payload structure
 */
export interface WebhookPayload {
  headers: Record<string, string>;
  body: any;
  provider: string;
  path: string;
  method: string;
}

/**
 * Result object returned by webhook handlers after validation
 */
export interface WebhookHandlerResult {
  isValid: boolean;
  payload: WebhookPayload;
  metadata?: Record<string, any>;
  error?: string;
}

/**
 * Base schema for validating webhook data structure
 */
export const BaseWebhookSchema = z.object({
  headers: z.record(z.string()),
  body: z.record(z.any())
});

/**
 * Interface that all webhook handlers must implement
 */
export interface WebhookHandler {
  /**
   * Determines if this handler can process the given provider
   */
  canHandle(provider: string): boolean;
  
  /**
   * Validates the incoming webhook request
   */
  validateWebhook(request: Request, provider: string): Promise<WebhookHandlerResult>;
  
  /**
   * Processes a validated webhook and stores it
   */
  processWebhook(result: WebhookHandlerResult, userId: string): Promise<string>;
} 