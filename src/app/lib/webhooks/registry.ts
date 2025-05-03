import { WebhookHandler } from './types';

/**
 * Registry for webhook handlers that implements the singleton pattern
 * Manages provider-specific webhook handlers and provides factory functionality
 */
export class WebhookHandlerRegistry {
  private handlers: WebhookHandler[] = [];
  private static instance: WebhookHandlerRegistry;
  
  private constructor() {
    // Handlers will be registered when they're imported
  }
  
  /**
   * Gets the singleton instance of the registry
   */
  public static getInstance(): WebhookHandlerRegistry {
    if (!WebhookHandlerRegistry.instance) {
      WebhookHandlerRegistry.instance = new WebhookHandlerRegistry();
    }
    return WebhookHandlerRegistry.instance;
  }
  
  /**
   * Registers a new webhook handler
   * @param handler The handler to register
   */
  public registerHandler(handler: WebhookHandler): void {
    // Prevent duplicate registrations
    if (!this.handlers.some(h => h.constructor.name === handler.constructor.name)) {
      this.handlers.push(handler);
      console.log(`Registered webhook handler: ${handler.constructor.name}`);
    }
  }
  
  /**
   * Gets the appropriate handler for the given provider
   * @param provider The provider identifier
   * @returns The handler that can handle this provider, or undefined if none
   */
  public getHandlerForProvider(provider: string): WebhookHandler | undefined {
    return this.handlers.find(h => h.canHandle(provider));
  }
} 