"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function WebhookSetup() {
  const [userId, setUserId] = useState<string>('');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserId(data.id);
        const baseUrl = window.location.origin;
        setWebhookUrl(`${baseUrl}/api/github-webhook/${data.id}`);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Could not load user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      toast.success('Webhook URL copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      toast.error('Failed to copy URL');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading webhook setup...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">GitHub Webhook Setup</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-300 mb-2">Your Webhook URL</h3>
          <div className="flex items-center">
            <input
              type="text"
              value={webhookUrl}
              readOnly
              className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded-l text-gray-200"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-r"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Use this URL in your GitHub repository webhook settings
          </p>
        </div>

        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-md font-medium text-gray-200 mb-2">Setup Instructions</h3>
          <ol className="space-y-2 text-gray-300 list-decimal ml-4">
            <li>Go to your GitHub repository</li>
            <li>Click on <span className="text-gray-200">Settings &rarr; Webhooks &rarr; Add webhook</span></li>
            <li>For <span className="text-gray-200">Payload URL</span>, paste the webhook URL above</li>
            <li>Set <span className="text-gray-200">Content type</span> to <span className="text-gray-200">application/json</span></li>
            <li>Skip the Secret field (no secret required)</li>
            <li>Choose which events you want to trigger the webhook</li>
            <li>Click <span className="text-gray-200">Add webhook</span></li>
          </ol>
        </div>

        <div className="bg-gray-700/50 p-4 rounded text-sm text-gray-400 border border-gray-600">
          <p><strong>Note:</strong> All webhooks sent to this URL will appear in your TymBug dashboard. No additional authentication required!</p>
        </div>
      </div>
    </div>
  );
}
