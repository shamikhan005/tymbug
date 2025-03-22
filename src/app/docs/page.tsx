"use client";

import Link from "next/link";
import { useState } from "react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    { id: "getting-started", title: "Getting Started" },
    { id: "webhook-basics", title: "Webhook Basics" },
    { id: "authentication", title: "Authentication" },
    { id: "sending-webhooks", title: "Sending Webhooks" },
    { id: "viewing-webhooks", title: "Viewing Webhooks" },
    { id: "replaying-webhooks", title: "Replaying Webhooks" },
    { id: "debugging", title: "Production Debugging" },
    { id: "use-cases", title: "Use Cases" },
    { id: "api-reference", title: "API Reference" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">TymBug Documentation</h1>
          <Link
            href="/"
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? "bg-green-500 text-black"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg p-6">
              {activeSection === "getting-started" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-green-500">Getting Started</h2>
                  <p className="mb-4">
                    TymBug is a webhook testing and debugging platform that helps developers capture, inspect, and replay webhooks.
                    This documentation will guide you through setting up and using TymBug effectively.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Quick Start</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Create an account or sign in to TymBug</li>
                    <li>Get your authentication token from the dashboard</li>
                    <li>Configure your webhook provider to send webhooks to TymBug</li>
                    <li>View and analyze incoming webhooks on your dashboard</li>
                  </ol>
                </div>
              )}

              {activeSection === "webhook-basics" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-green-500">Webhook Basics</h2>
                  <p className="mb-4">
                    Webhooks are automated messages sent from apps when something happens. They're HTTP callbacks that occur when a specific event is triggered.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">How Webhooks Work</h3>
                  <p className="mb-4">
                    1. A service provider (like Stripe, GitHub, etc.) sends an HTTP POST request to a URL you specify
                    <br />
                    2. The request contains data about the event that occurred
                    <br />
                    3. Your application receives this data and processes it accordingly
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Common Webhook Providers</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Payment processors (Stripe, PayPal)</li>
                    <li>Version control systems (GitHub, GitLab)</li>
                    <li>CRM systems (Salesforce, HubSpot)</li>
                    <li>Communication tools (Slack, Discord)</li>
                    <li>And many more...</li>
                  </ul>
                </div>
              )}

              {activeSection === "authentication" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-green-500">Authentication</h2>
                  <p className="mb-4">
                    TymBug uses token-based authentication to secure your webhooks and ensure only you can access them.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Getting Your Token</h3>
                  <p className="mb-4">
                    Your authentication token is available on the dashboard after logging in. You can:
                    <br />
                    - View the full token by clicking the eye icon
                    <br />
                    - Copy it to your clipboard with the copy button
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Using Your Token</h3>
                  <p className="mb-4">
                    Include your token in the Authorization header when sending webhooks to TymBug:
                  </p>
                  <div className="bg-gray-900 p-3 rounded-md font-mono text-sm mb-4">
                    <code>Authorization: Bearer your-token-here</code>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Token Security</h3>
                  <p className="mb-4">
                    - Keep your token secure and never share it publicly
                    <br />
                    - Tokens are stored securely in HTTP-only cookies
                    <br />
                    - If you suspect your token has been compromised, you can generate a new one
                  </p>
                </div>
              )}

              {activeSection === "sending-webhooks" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-green-500">Sending Webhooks</h2>
                  <p className="mb-4">
                    To send webhooks to TymBug, you'll need to configure your webhook provider or use an API client.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Webhook URL Format</h3>
                  <p className="mb-4">
                    Use the following URL format to send webhooks to TymBug:
                  </p>
                  <div className="bg-gray-900 p-3 rounded-md font-mono text-sm mb-4">
                    <code>https://tymbug.vercel.app/api/webhooks/&#123;provider-name&#125;</code>
                  </div>
                  <p className="mb-4">
                    Replace <code className="bg-gray-700 px-1 rounded">&#123;provider-name&#125;</code> with an identifier for the service sending the webhook (e.g., "stripe", "github", etc.).
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Required Headers</h3>
                  <div className="bg-gray-900 p-3 rounded-md font-mono text-sm mb-4">
                    <code>
                      Content-Type: application/json<br />
                      Authorization: Bearer your-token-here
                    </code>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Example with cURL</h3>
                  <div className="bg-gray-900 p-3 rounded-md font-mono text-sm mb-4 whitespace-pre-wrap">
                    <code>
                      curl -X POST \<br />
                      &nbsp;&nbsp;https://tymbug.vercel.app/api/webhooks/stripe \<br />
                      &nbsp;&nbsp;-H "Authorization: Bearer your-token-here" \<br />
                      &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                      &nbsp;&nbsp;-d &apos;&#123;&quot;event&quot;: &quot;payment.succeeded&quot;, &quot;data&quot;: &#123;&quot;amount&quot;: 1000&#125;&#125;&apos;
                    </code>
                  </div>
                </div>
              )}

              {activeSection === "viewing-webhooks" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-green-500">Viewing Webhooks</h2>
                  <p className="mb-4">
                    Once webhooks are sent to TymBug, you can view and analyze them on your dashboard.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Webhook List</h3>
                  <p className="mb-4">
                    The dashboard displays a list of all webhooks you've received, showing:
                    <br />
                    - Provider name
                    <br />
                    - Timestamp
                    <br />
                    - HTTP status code
                    <br />
                    - HTTP method
                    <br />
                    - Number of replays
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Filtering by Provider</h3>
                  <p className="mb-4">
                    Use the provider filter at the top of the webhook list to focus on webhooks from a specific provider.
                    This helps you organize and find webhooks more efficiently.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Webhook Details</h3>
                  <p className="mb-4">
                    Click on any webhook to view its details, including:
                    <br />
                    - Full request headers
                    <br />
                    - Complete request body
                    <br />
                    - Response details
                    <br />
                    - Path information
                  </p>
                </div>
              )}

              {activeSection === "replaying-webhooks" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-green-500">Replaying Webhooks</h2>
                  <p className="mb-4">
                    TymBug allows you to replay webhooks to test your endpoint's behavior and verify fixes.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Standard Replay</h3>
                  <p className="mb-4">
                    From a webhook's detail page:
                    <br />
                    1. Click the "Replay Webhook" button
                    <br />
                    2. TymBug will send the exact same payload and headers to the original endpoint
                    <br />
                    3. The response will be recorded in the replay history
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Replay History</h3>
                  <p className="mb-4">
                    Each webhook's detail page shows a history of all replays, including:
                    <br />
                    - Timestamp of the replay
                    <br />
                    - HTTP status code received
                    <br />
                    - A unique ID for the replay
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Comparing Responses</h3>
                  <p className="mb-4">
                    Click on any replay in the history to view its details and compare it with other replays.
                    This helps you track changes in your endpoint's behavior over time.
                  </p>
                </div>
              )}

              {activeSection === "debugging" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-green-500">Production Debugging</h2>
                  <p className="mb-4">
                    The Production Debugging feature allows you to replay webhooks to custom endpoints, making it perfect for debugging issues in different environments.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Accessing Production Debugging</h3>
                  <p className="mb-4">
                    1. Go to your dashboard
                    <br />
                    2. Click on the "Production Debugging" tab
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Using Production Debugging</h3>
                  <p className="mb-4">
                    1. Select a webhook from your history
                    <br />
                    2. Enter the target endpoint URL where you want to send the webhook
                    <br />
                    3. Click "Replay Webhook" to send it to your specified endpoint
                    <br />
                    4. View the response to see if your endpoint handled it correctly
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Common Debugging Scenarios</h3>
                  <p className="mb-4">
                    - Testing a fix in your development environment with real production data
                    <br />
                    - Comparing how different versions of your code handle the same webhook
                    <br />
                    - Verifying webhook handling across different environments (dev, staging, production)
                  </p>
                </div>
              )}

              {activeSection === "use-cases" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-green-500">Use Cases</h2>
                  <p className="mb-4">
                    TymBug supports several key use cases for webhook testing and debugging.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Development & Testing</h3>
                  <p className="mb-4">
                    - Configure test services to send webhooks to TymBug instead of your application
                    <br />
                    - View and analyze the webhook structure
                    <br />
                    - Develop your webhook handlers based on real data
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Production Debugging</h3>
                  <p className="mb-4">
                    - Temporarily redirect production webhooks to TymBug when troubleshooting issues
                    <br />
                    - Inspect the webhook details to identify problems
                    <br />
                    - Fix your code and use the replay feature to verify the solution
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Webhook Development</h3>
                  <p className="mb-4">
                    - Capture example webhooks from providers to understand their structure
                    <br />
                    - Use these examples to build your API and data models
                    <br />
                    - Test different webhook formats to ensure your code handles all cases
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Recovery from Outages</h3>
                  <p className="mb-4">
                    - If your service was temporarily down, replay missed webhooks
                    <br />
                    - Ensure no important events were lost during the outage
                    <br />
                    - Maintain data consistency across systems
                  </p>
                </div>
              )}

              {activeSection === "api-reference" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-green-500">API Reference</h2>
                  <p className="mb-4">
                    TymBug provides several API endpoints for webhook handling and management.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Webhook Endpoints</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-700 rounded-md overflow-hidden">
                      <div className="bg-gray-700 px-4 py-2 font-semibold">
                        POST /api/webhooks/&#123;provider-name&#125;
                      </div>
                      <div className="p-4">
                        <p className="mb-2">Receives webhooks from external services.</p>
                        <p className="text-sm text-gray-400 mb-2"><strong>Headers:</strong></p>
                        <ul className="list-disc pl-5 text-sm text-gray-400 mb-2">
                          <li>Authorization: Bearer &#123;your-token&#125;</li>
                          <li>Content-Type: application/json</li>
                        </ul>
                        <p className="text-sm text-gray-400"><strong>Response:</strong> 200 OK if successful</p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-700 rounded-md overflow-hidden">
                      <div className="bg-gray-700 px-4 py-2 font-semibold">
                        GET /api/hookfetch
                      </div>
                      <div className="p-4">
                        <p className="mb-2">Retrieves a list of webhooks for the authenticated user.</p>
                        <p className="text-sm text-gray-400"><strong>Response:</strong> Array of webhook objects</p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-700 rounded-md overflow-hidden">
                      <div className="bg-gray-700 px-4 py-2 font-semibold">
                        GET /api/hookfetch/providers
                      </div>
                      <div className="p-4">
                        <p className="mb-2">Retrieves a list of unique webhook providers for the authenticated user.</p>
                        <p className="text-sm text-gray-400"><strong>Response:</strong> Array of provider names</p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-700 rounded-md overflow-hidden">
                      <div className="bg-gray-700 px-4 py-2 font-semibold">
                        POST /api/replay/&#123;webhook-id&#125;
                      </div>
                      <div className="p-4">
                        <p className="mb-2">Replays a webhook to its original endpoint.</p>
                        <p className="text-sm text-gray-400"><strong>Response:</strong> Replay object with status and ID</p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-700 rounded-md overflow-hidden">
                      <div className="bg-gray-700 px-4 py-2 font-semibold">
                        POST /api/replay/demo
                      </div>
                      <div className="p-4">
                        <p className="mb-2">Replays a webhook to a custom endpoint.</p>
                        <p className="text-sm text-gray-400 mb-2"><strong>Body:</strong></p>
                        <ul className="list-disc pl-5 text-sm text-gray-400 mb-2">
                          <li>webhookId: ID of the webhook to replay</li>
                          <li>targetUrl: URL to send the webhook to</li>
                        </ul>
                        <p className="text-sm text-gray-400"><strong>Response:</strong> Object with response status and body</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
