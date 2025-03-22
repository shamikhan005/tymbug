"use client";

import { useState, useEffect } from 'react';

export default function TokenDisplay() {
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch('/api/auth/token');
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || 'Failed to fetch token');
          return;
        }

        if (data.token) {
          setToken(data.token);
        } else {
          setError('No token found');
        }
      } catch (err) {
        console.error('Error fetching token:', err);
        setError('Failed to fetch token');
      }
    };
    getToken();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const displayToken = showFull ? token : `${token.slice(0, 20)}...${token.slice(-4)}`;

  if (error) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <p className="text-red-400">{error}</p>
        <p className="text-gray-400 text-sm mt-2">Please make sure you are logged in.</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <p className="text-gray-400">Loading token...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-100">Your Authentication Token</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFull(!showFull)}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors duration-300"
          >
            {showFull ? 'Show Less' : 'Show Full'}
          </button>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-black font-bold rounded transition-colors duration-300"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="relative">
        <pre className="bg-gray-900 p-3 rounded text-sm text-gray-300 overflow-x-auto font-mono whitespace-pre-wrap break-all">
          {displayToken}
        </pre>
        <div className="mt-4 text-sm text-gray-400">
          <p className="font-semibold mb-2">How to use:</p>
          <p className="mb-2">Add this header to your webhook requests:</p>
          <pre className="bg-gray-900 p-2 rounded font-mono">
            Authorization: Bearer {displayToken}
          </pre>
          <p className="mt-2 text-xs">This token is required for all webhook endpoints.</p>
        </div>
      </div>
    </div>
  );
}