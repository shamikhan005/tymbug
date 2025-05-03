import { NextRequest, NextResponse } from "next/server";
import { initializeWebhookSystem } from "@/app/lib/webhooks";
import { findUserByIdentifier } from "@/app/lib/auth";

const webhookRegistry = initializeWebhookSystem();

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    
    const actualUserId = await findUserByIdentifier(userId);
    
    if (!actualUserId) {
      console.error(`User not found for identifier: ${userId}`);
      return NextResponse.json({ error: "Invalid webhook configuration" }, { status: 401 });
    }
    
    const handler = webhookRegistry.getHandlerForProvider('github');
    
    if (!handler) {
      return NextResponse.json({ error: "GitHub webhook handler not available" }, { status: 500 });
    }
    
    const validationResult = await handler.validateWebhook(request, 'github');
    
    if (!validationResult.isValid) {
      return NextResponse.json({ 
        error: validationResult.error || "Invalid GitHub webhook" 
      }, { status: 400 });
    }
    
    const webhookId = await handler.processWebhook(validationResult, actualUserId);
    
    return NextResponse.json({
      success: true,
      id: webhookId,
      event: validationResult.metadata?.event,
      message: "GitHub webhook received successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("GitHub webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 