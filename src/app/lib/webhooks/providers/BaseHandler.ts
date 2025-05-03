import { WebhookHandler, WebhookHandlerResult, WebhookPayload, BaseWebhookSchema } from '../types';
import prisma from '@/lib/prisma';
import { WebhookHandlerRegistry } from '../registry';

/**
 * Base webhook handler implementation with common functionality
 * All provider-specific handlers should extend this class
 */
export abstract class BaseWebhookHandler implements WebhookHandler {
  constructor() {
    // Register this handler with the registry
    WebhookHandlerRegistry.getInstance().registerHandler(this);
  }

  /**
   * Determines if this handler can process the given provider
   * @param provider The provider identifier
   */
  abstract canHandle(provider: string): boolean;

  /**
   * Extracts headers from a request
   * @param request The request to extract headers from
   * @returns Object containing the headers
   */
  protected extractHeaders(request: Request): Record<string, string> {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      // Filter out sensitive headers
      if (!['authorization', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });
    return headers;
  }

  /**
   * Extracts and parses the body from a request
   * @param request The request to extract the body from
   * @returns The parsed body, or an empty object if parsing fails
   */
  protected async extractBody(request: Request): Promise<any> {
    try {
      const clonedRequest = request.clone();
      return await clonedRequest.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      // Try to extract as text if JSON parsing fails
      try {
        const clonedRequest = request.clone();
        const text = await clonedRequest.text();
        return { rawText: text };
      } catch {
        return {};
      }
    }
  }

  /**
   * Creates a standardized webhook payload object
   * @param request The original request
   * @param headers Extracted headers
   * @param body Extracted body
   * @param provider Provider identifier
   * @returns A WebhookPayload object
   */
  protected createPayload(
    request: Request,
    headers: Record<string, string>,
    body: any,
    provider: string
  ): WebhookPayload {
    return {
      headers,
      body,
      provider,
      path: new URL(request.url).pathname,
      method: request.method
    };
  }

  /**
   * Base implementation of webhook validation
   * Provider-specific validators should override this method
   * @param request The webhook request
   * @param provider The provider identifier
   */
  async validateWebhook(request: Request, provider: string): Promise<WebhookHandlerResult> {
    const headers = this.extractHeaders(request);
    const body = await this.extractBody(request);
    
    const validation = BaseWebhookSchema.safeParse({
      headers,
      body,
    });

    if (!validation.success) {
      return {
        isValid: false,
        payload: this.createPayload(request, headers, body, provider),
        error: `Invalid webhook format: ${validation.error.message}`
      };
    }

    return {
      isValid: true,
      payload: this.createPayload(request, headers, body, provider)
    };
  }

  /**
   * Base implementation of webhook processing
   * Stores the webhook in the database
   * @param result The validated webhook result
   * @param userId The user ID to associate with this webhook
   */
  async processWebhook(result: WebhookHandlerResult, userId: string): Promise<string> {
    if (!result.isValid) {
      throw new Error(result.error || 'Invalid webhook');
    }

    const webhook = await prisma.webhook.create({
      data: {
        provider: result.payload.provider,
        path: result.payload.path,
        method: result.payload.method,
        headers: result.payload.headers,
        body: result.payload.body,
        responseStatus: 200,
        userId
      },
    });

    return webhook.id;
  }
} 