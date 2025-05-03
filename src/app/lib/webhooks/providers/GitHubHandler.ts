import { BaseWebhookHandler } from './BaseHandler';
import { WebhookHandlerResult } from '../types';
import crypto from 'crypto';

/**
 * GitHub-specific webhook handler implementation
 * Handles validation and processing of GitHub webhooks
 */
export class GitHubWebhookHandler extends BaseWebhookHandler {
  /**
   * Handler identifier
   */
  private static readonly PROVIDER = 'github';

  /**
   * Checks if this handler supports the given provider
   * @param provider The provider identifier from the URL
   */
  canHandle(provider: string): boolean {
    return provider.toLowerCase() === GitHubWebhookHandler.PROVIDER;
  }

  /**
   * GitHub-specific webhook validation
   * Checks GitHub-specific headers and verifies signature if a secret is provided
   * @param request The webhook request
   * @param provider The provider identifier (should be 'github')
   */
  async validateWebhook(request: Request, provider: string): Promise<WebhookHandlerResult> {
    // First perform basic validation from the base handler
    const baseResult = await super.validateWebhook(request, provider);
    if (!baseResult.isValid) {
      return baseResult;
    }

    const headers = baseResult.payload.headers;
    
    // GitHub-specific validation
    const githubEvent = headers['x-github-event'] || headers['X-GitHub-Event'];
    const githubDelivery = headers['x-github-delivery'] || headers['X-GitHub-Delivery'];
    
    if (!githubEvent || !githubDelivery) {
      return {
        isValid: false,
        payload: baseResult.payload,
        error: 'Missing required GitHub webhook headers (x-github-event, x-github-delivery)'
      };
    }

    // Optional signature verification (if GITHUB_WEBHOOK_SECRET env variable is set)
    const signature = headers['x-hub-signature-256'] || headers['X-Hub-Signature-256'];
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      const payload = JSON.stringify(baseResult.payload.body);
      const hmac = crypto.createHmac('sha256', webhookSecret);
      const digest = 'sha256=' + hmac.update(payload).digest('hex');
      
      if (signature !== digest) {
        return {
          isValid: false,
          payload: baseResult.payload,
          error: 'GitHub webhook signature validation failed'
        };
      }
    }

    return {
      isValid: true,
      payload: baseResult.payload,
      metadata: {
        event: githubEvent,
        delivery: githubDelivery,
        signature_verified: Boolean(webhookSecret && signature)
      }
    };
  }
} 