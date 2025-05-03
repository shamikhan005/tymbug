"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import ProviderFilter from "./ProviderFilter";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const PROVIDER_COLORS: Record<string, string> = {
  github: "bg-blue-600/20 text-blue-400 border border-blue-700/30",
  generic: "bg-purple-600/20 text-purple-400 border border-purple-700/30",
  stripe: "bg-green-600/20 text-green-400 border border-green-700/30",
  test: "bg-yellow-600/20 text-yellow-400 border border-yellow-700/30",
  default: "bg-gray-600/20 text-gray-400 border border-gray-700/30"
};

export default function WebhookList() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  
  const { data: webhooks, error } = useSWR("/api/hookfetch", fetcher, {
    refreshInterval: 5000,
  });

  const { data: providerData } = useSWR("/api/hookfetch/providers", fetcher);
  const supportedProviders = providerData?.supportedProviders || [];

  if (error) return <div className="text-red-400">Error loading webhooks.</div>;
  if (!webhooks) return <div className="text-gray-400">Loading webhooks...</div>;

  const filteredWebhooks = selectedProvider 
    ? webhooks.filter((webhook: any) => webhook.provider === selectedProvider)
    : webhooks;

  const getProviderColor = (provider: string): string => {
    return PROVIDER_COLORS[provider.toLowerCase()] || PROVIDER_COLORS.default;
  };

  return (
    <div>
      <div className="mb-4">
      <ProviderFilter 
        selectedProvider={selectedProvider} 
        onSelectProvider={setSelectedProvider} 
      />
      </div>
      
      <div className="space-y-3">
        {filteredWebhooks.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-12 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {selectedProvider 
              ? <p>No webhooks from <span className="font-medium">{selectedProvider}</span> provider</p> 
              : <p>No webhooks received yet</p>}
            <p className="mt-2 text-sm text-gray-500">Configure a webhook provider to send data to your TymBug endpoint</p>
          </div>
        ) : (
          filteredWebhooks.map((webhook: any) => (
            <Link
              href={`/database/${webhook.id}`}
              key={webhook.id}
              className="block hover:bg-gray-800 transition-colors rounded-lg border border-gray-700/50 hover:border-gray-600 bg-gray-800/50 overflow-hidden"
            >
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 ${getProviderColor(webhook.provider)} rounded-full text-xs font-medium flex items-center gap-1`}>
                      {webhook.provider}
                      {supportedProviders.includes(webhook.provider) && (
                        <span title="Officially supported provider" className="inline-block w-2 h-2 bg-blue-400 rounded-full ml-1"></span>
                      )}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(webhook.receivedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`font-medium ${
                          webhook.responseStatus >= 200 &&
                          webhook.responseStatus < 300
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {webhook.responseStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500">Method:</span>
                      <span className="font-medium text-gray-200">{webhook.method}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500">Replays:</span>
                      <span className="font-medium text-gray-200">{webhook._count.Replay}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-mono truncate max-w-[120px] sm:max-w-[180px]">
                    {webhook.id}
                  </span>
                  <div className="bg-gray-700 rounded-full p-1">
                  <svg
                      className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
