"use client";

import { useState } from "react";
import LogoutButton from "../components/LogoutButton";
import WebhookList from "../components/WebhookList";
import TokenDisplay from "../components/TokenDisplay";
import DebugDemo from "../components/DebugDemo";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'webhooks' | 'debug'>('webhooks');

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
          
          {/* Tab Navigation */}
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
          
          {/* Tab Content */}
          {activeTab === 'webhooks' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Webhook History</h2>
              <WebhookList />
            </div>
          )}
          
          {activeTab === 'debug' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Production Debugging</h2>
              <DebugDemo />
              
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
                <h3 className="text-lg font-medium text-gray-200 mb-4">How Production Debugging Works</h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    This feature allows you to replay webhooks to any endpoint, making it perfect for debugging production issues:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <strong>Select a webhook</strong> from your history that you want to replay
                    </li>
                    <li>
                      <strong>Enter your target endpoint URL</strong> where you want to send the webhook
                    </li>
                    <li>
                      <strong>Click "Replay Webhook"</strong> to send it to your specified endpoint
                    </li>
                    <li>
                      <strong>View the response</strong> to see if your endpoint handled it correctly
                    </li>
                  </ol>
                  
                  <div className="mt-4 p-3 bg-gray-700/50 rounded border border-gray-600">
                    <p className="text-sm">
                      <strong>Tip:</strong> This is especially useful when you've fixed a bug in your webhook handler and want to verify the fix works without waiting for the service to send another webhook.
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
