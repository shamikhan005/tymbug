import { BaseWebhookHandler } from './BaseHandler';

/**
 * Generic webhook handler for any provider not specifically supported
 * This is a fallback handler that provides basic functionality
 */
export class GenericWebhookHandler extends BaseWebhookHandler {
  /**
   * Makes this handler the fallback for any provider
   * This should be registered last so specific providers take precedence
   * @param provider The provider identifier
   */
  canHandle(provider: string): boolean {
    // This will handle any provider not explicitly handled by another handler
    return true;
  }
} 