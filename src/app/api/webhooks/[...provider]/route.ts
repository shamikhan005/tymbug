import { NextResponse } from "next/server";
import { initializeWebhookSystem, WebhookHandlerRegistry } from "@/app/lib/webhooks";
import { authenticateRequestWithToken } from "@/app/lib/auth";

const webhookRegistry = initializeWebhookSystem();

export async function POST(
  request: Request,
  context: { params: Promise<{ provider: string[] }> }
) {
  try {
    const { provider } = await context.params;
    const providerPath = provider.join('/');
    const providerName = provider[0]; // Get the first segment as the provider name

    console.log(`Received webhook for provider: ${providerName}, path: ${providerPath}`);

    const handler = webhookRegistry.getHandlerForProvider(providerName);

    if (!handler) {
      return NextResponse.json(
        { error: `Unsupported webhook provider: ${providerName}` },
        { status: 400 }
      );
    }

    const userId = await authenticateRequestWithToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'No authentication token provided or invalid token' },
        { status: 401 }
      );
    }

    const validationResult = await handler.validateWebhook(request, providerName);

    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.error || 'Invalid webhook format' },
        { status: 400 }
      );
    }

    const webhookId = await handler.processWebhook(validationResult, userId);

    return NextResponse.json({
      success: true,
      id: webhookId,
      provider: providerName,
      metadata: validationResult.metadata
    }, { status: 200 });
  } catch (error) {
    console.error(`Webhook error:`, error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unexpected error"
      },
      { status: 500 }
    );
  }
}
