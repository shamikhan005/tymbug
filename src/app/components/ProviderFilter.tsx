"use client";

import { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ProviderFilterProps {
  selectedProvider: string | null;
  onSelectProvider: (provider: string | null) => void;
}

export default function ProviderFilter({ selectedProvider, onSelectProvider }: ProviderFilterProps) {
  const { data, error } = useSWR("/api/hookfetch/providers", fetcher);
  const [providers, setProviders] = useState<string[]>([]);
  const [supportedProviders, setSupportedProviders] = useState<string[]>([]);

  useEffect(() => {
    if (data?.providers) {
      setProviders(data.providers);
    }
    if (data?.supportedProviders) {
      setSupportedProviders(data.supportedProviders);
    }
  }, [data]);

  if (error) return null;
  if (!providers.length) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-400 mb-2">Filter by Provider</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectProvider(null)}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            selectedProvider === null
              ? 'bg-green-500 text-black font-bold'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {providers.map((provider) => (
          <button
            key={provider}
            onClick={() => onSelectProvider(provider)}
            className={`px-3 py-1 text-xs rounded-full transition-colors flex items-center gap-1 ${
              selectedProvider === provider
                ? 'bg-green-500 text-black font-bold'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {provider}
            {supportedProviders.includes(provider) && (
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full ml-1" title="Officially supported provider"></span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500 flex items-center">
        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
        <span>= Officially supported provider</span>
      </div>
    </div>
  );
}
