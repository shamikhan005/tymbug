"use client";

import TokenDisplay from "../components/TokenDisplay";
import LogoutButton from "../components/LogoutButton";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      <div className="max-w-5xl mx-auto p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">TymBug Demo</h1>
          <div className="flex items-center gap-4">
            <LogoutButton />
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Authentication Token</h2>
            <TokenDisplay />
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">How TymBug Works</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                TymBug helps you capture, inspect, and debug webhooks using this simple workflow:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Capture webhooks</strong> from any third-party service using your authentication token
                </li>
                <li>
                  <strong>Inspect the details</strong> with our JSON visualization and header analysis
                </li>
                <li>
                  <strong>Debug and test</strong> by replaying webhooks to your endpoints
                </li>
                <li>
                  <strong>Track history</strong> to compare responses over time
                </li>
              </ol>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-200 mb-2">Getting Started</h3>
                <ol className="list-decimal pl-5 space-y-2 mt-2">
                  <li>Copy your authentication token shown above</li>
                  <li>Configure your webhook provider to send webhooks to TymBug</li>
                  <li>Add the Authorization header to your requests</li>
                  <li>View captured webhooks in your dashboard</li>
                  <li>Click on any webhook to inspect details and replay it</li>
                </ol>
              </div>
              
              <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-700">
                <h3 className="text-md font-medium text-gray-300 mb-2">Test with cURL</h3>
                <p className="text-sm mb-2">
                  You can send a test webhook with this command:
                </p>
                <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                  curl -X POST https://tymbug.vercel.app/api/webhook \<br/>
                  &nbsp;&nbsp;-H "Authorization: Bearer YOUR_TOKEN" \<br/>
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                  &nbsp;&nbsp;-d {"{'"}event": "test", "message": "Hello from TymBug!"{"}"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
