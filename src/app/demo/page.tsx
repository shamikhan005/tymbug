"use client";

import DebugDemo from "../components/DebugDemo";
import TokenDisplay from "../components/TokenDisplay";
import LogoutButton from "../components/LogoutButton";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      <div className="max-w-5xl mx-auto p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Production Debugging Demo</h1>
          <div className="flex items-center gap-4">
            <LogoutButton />
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Authentication Token</h2>
            <TokenDisplay />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Debugging Scenario</h2>
            <DebugDemo />
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">How This Works</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                This demo simulates a production debugging scenario where you:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Capture a webhook</strong> from a third-party service using TymBug
                </li>
                <li>
                  <strong>Debug the issue</strong> by examining the webhook's contents
                </li>
                <li>
                  <strong>Fix your endpoint</strong> to handle the webhook correctly
                </li>
                <li>
                  <strong>Replay the webhook</strong> to your fixed endpoint to verify the solution
                </li>
              </ol>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-200 mb-2">Real-world Example</h3>
                <p>
                  Imagine you're receiving webhooks from Stripe, but some payments are failing to process. You would:
                </p>
                <ol className="list-decimal pl-5 space-y-2 mt-2">
                  <li>Configure Stripe to temporarily send webhooks to TymBug</li>
                  <li>Wait for the problematic webhook to arrive</li>
                  <li>Examine the webhook payload to identify the issue</li>
                  <li>Fix your payment processing code</li>
                  <li>Use TymBug to replay the exact same webhook to test your fix</li>
                  <li>Once confirmed working, switch Stripe back to your production endpoint</li>
                </ol>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-200 mb-2">Getting Started</h3>
                <p>
                  To try this demo:
                </p>
                <ol className="list-decimal pl-5 space-y-2 mt-2">
                  <li>Send a test webhook to TymBug using your authentication token</li>
                  <li>Select that webhook in the demo above</li>
                  <li>Use the test endpoint URL (pre-filled) or your own endpoint</li>
                  <li>Click "Replay Webhook" to send it to the target endpoint</li>
                  <li>View the response to see if your endpoint handled it correctly</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
