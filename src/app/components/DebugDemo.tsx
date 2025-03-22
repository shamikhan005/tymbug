"use client";

import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DebugDemo() {
  const [targetUrl, setTargetUrl] = useState('http://localhost:3000/api/test-endpoint');
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null);
  const [replayResult, setReplayResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: webhooks, error: webhooksError } = useSWR("/api/hookfetch", fetcher);

  const handleReplay = async () => {
    if (!selectedWebhook) {
      setError('Please select a webhook to replay');
      return;
    }

    setIsLoading(true);
    setError(null);
    setReplayResult(null);

    try {
      const response = await fetch('/api/replay/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookId: selectedWebhook,
          targetUrl
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to replay webhook');
      }

      setReplayResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (webhooksError) return <div className="text-red-400">Error loading webhooks.</div>;
  if (!webhooks) return <div className="text-gray-400">Loading webhooks...</div>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Production Debugging Demo</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-300 mb-2">Step 1: Select a captured webhook</h3>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {webhooks.length === 0 ? (
              <p className="text-gray-400">No webhooks available</p>
            ) : (
              webhooks.map((webhook: any) => (
                <div 
                  key={webhook.id}
                  onClick={() => setSelectedWebhook(webhook.id)}
                  className={`p-2 rounded cursor-pointer ${
                    selectedWebhook === webhook.id 
                      ? 'bg-green-500 text-black font-bold' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gray-600 text-gray-300 rounded-full text-xs">
                        {webhook.provider}
                      </span>
                      <span className="text-xs">
                        {new Date(webhook.receivedAt).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs font-mono">{webhook.id.substring(0, 8)}...</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-300 mb-2">Step 2: Enter your production endpoint URL</h3>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-gray-200"
            placeholder="https://your-production-api.com/webhook"
          />
          <p className="text-xs text-gray-400 mt-1">
            For demo purposes, you can use the test endpoint: http://localhost:3000/api/test-endpoint
          </p>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-300 mb-2">Step 3: Replay the webhook</h3>
          <button
            onClick={handleReplay}
            disabled={isLoading || !selectedWebhook}
            className={`px-4 py-2 rounded-full font-bold transition-colors ${
              isLoading 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-black'
            }`}
          >
            {isLoading ? 'Replaying...' : 'Replay Webhook'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-800 rounded">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {replayResult && (
          <div>
            <h3 className="text-md font-medium text-gray-300 mb-2">Replay Results</h3>
            <div className="p-3 bg-gray-900 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400">Status:</span>
                <span className={`font-medium ${
                  replayResult.responseStatus >= 200 && replayResult.responseStatus < 300
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {replayResult.responseStatus}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Response:</span>
                <pre className="mt-1 p-2 bg-gray-800 rounded text-xs text-gray-300 overflow-x-auto">
                  {JSON.stringify(replayResult.responseBody, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
