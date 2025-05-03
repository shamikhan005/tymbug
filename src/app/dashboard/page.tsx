"use client";

import { useState } from "react";
import LogoutButton from "../components/LogoutButton";
import WebhookList from "../components/WebhookList";
import TokenDisplay from "../components/TokenDisplay";
import WebhookSetup from "../components/WebhookSetup";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'webhooks' | 'setup'>('webhooks');

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
                Webhook Setup
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
              <h2 className="text-xl font-semibold mb-4">Webhook Setup</h2>
              <p className="text-gray-400 mb-6">
                Configure webhooks for different providers. GitHub is officially supported, but you can use any provider that sends JSON payloads.
              </p>
              <WebhookSetup />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
