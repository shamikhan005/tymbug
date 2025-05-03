import { WebhookHandlerRegistry } from './registry';
import { GitHubWebhookHandler } from './providers/GitHubHandler';
import { GenericWebhookHandler } from './providers/GenericHandler';

/**
 * Initialize the webhook handler system
 * This function registers all available webhook handlers
 * Should be called before using the webhook system
 */
export function initializeWebhookSystem(): WebhookHandlerRegistry {
  const registry = WebhookHandlerRegistry.getInstance();
  
  // Register all available handlers
  // Order is important - specific handlers first, generic handlers last
  new GitHubWebhookHandler();
  new GenericWebhookHandler();
  
  return registry;
}

// Export all the webhook types and handlers for use elsewhere
export * from './types';
export * from './registry';
export * from './providers/BaseHandler';
export * from './providers/GitHubHandler';
export * from './providers/GenericHandler'; 