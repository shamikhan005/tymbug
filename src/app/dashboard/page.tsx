"use client";

import { useState } from "react";
import LogoutButton from "../components/LogoutButton";
import WebhookList from "../components/WebhookList";
import TokenDisplay from "../components/TokenDisplay";
import DebugDemo from "../components/DebugDemo";
import WebhookSetup from "../components/WebhookSetup";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'webhooks' | 'debug' | 'setup'>('webhooks');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      <div className="max-w-5xl mx-auto p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <LogoutButton />
          </div>
        </div>
        <div className="space-y-8">
          <TokenDisplay />
          
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('webhooks')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'webhooks'
                    ? 'border-green-500 text-green-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                Webhook History
              </button>
              <button
                onClick={() => setActiveTab('setup')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'setup'
                    ? 'border-green-500 text-green-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                GitHub Setup
              </button>
              <button
                onClick={() => setActiveTab('debug')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'debug'
                    ? 'border-green-500 text-green-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                Production Debugging
              </button>
            </nav>
          </div>
          
          {activeTab === 'webhooks' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Webhook History</h2>
              <p className="text-gray-400 mb-6">
                View all captured webhooks. Click on any webhook to view details, modify, and replay it to any endpoint.
              </p>
              <WebhookList />
            </div>
          )}
          
          {activeTab === 'setup' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">GitHub Webhook Setup</h2>
              <WebhookSetup />
            </div>
          )}
          
          {activeTab === 'debug' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Production Debugging</h2>
              <DebugDemo />
              
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Advanced Debugging Features</h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Our enhanced debugging tools give you more control over webhook testing:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <strong>View detailed webhook information</strong> including headers, body, and metadata
                    </li>
                    <li>
                      <strong>Edit webhook payloads</strong> before replaying to test different scenarios
                    </li>
                    <li>
                      <strong>Choose target environments</strong> - test locally or send to any custom endpoint
                    </li>
                    <li>
                      <strong>View detailed responses</strong> including status codes and response bodies
                    </li>
                    <li>
                      <strong>Test with delays and errors</strong> using our test endpoint parameters:
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        <li><code>?status=404</code> - Force a specific HTTP status code</li>
                        <li><code>?delay=2000</code> - Add a delay in milliseconds</li>
                        <li><code>?fail=true</code> - Simulate a random error response</li>
                      </ul>
                    </li>
                  </ol>
                  
                  <div className="mt-4 p-3 bg-gray-700/50 rounded border border-gray-600">
                    <p className="text-sm">
                      <strong>TIP:</strong> Click on any webhook in the history to access the advanced debugger, which lets you modify headers and body content before replaying.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
