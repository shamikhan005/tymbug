"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function WebhookSetup() {
  const [userId, setUserId] = useState<string>('');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [webhookSecret, setWebhookSecret] = useState<string>('');
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [secretCopied, setSecretCopied] = useState<boolean>(false);
  const [testSuccessful, setTestSuccessful] = useState<boolean | null>(null);
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
        
        const secret = Array.from(crypto.getRandomValues(new Uint8Array(24)))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        setWebhookSecret(secret);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Could not load user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  const copyToClipboard = async (text: string, isSecret: boolean = false) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isSecret) {
        setSecretCopied(true);
        toast.success('Webhook secret copied to clipboard');
        setTimeout(() => setSecretCopied(false), 2000);
      } else {
        setCopied(true);
        toast.success('Webhook URL copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  const testWebhook = async () => {
    try {
      setTestSuccessful(null);
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-GitHub-Event': 'ping',
          'X-GitHub-Delivery': crypto.randomUUID(),
        },
        body: JSON.stringify({
          zen: "Testing is good, but testing with real-world scenarios is better.",
          hook_id: 123456,
          hook: {
            type: "App",
            id: 123456,
            name: "web",
            active: true,
            events: ["push"],
            config: {
              content_type: "json",
              url: webhookUrl
            }
          }
        })
      });

      if (response.ok) {
        setTestSuccessful(true);
        toast.success('Webhook test successful!');
      } else {
        setTestSuccessful(false);
        toast.error('Webhook test failed');
      }
    } catch (error) {
      setTestSuccessful(false);
      console.error('Webhook test error:', error);
      toast.error('Failed to test webhook connection');
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
              onClick={() => copyToClipboard(webhookUrl)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-r"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Use this URL in your GitHub repository webhook settings
          </p>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-300 mb-2">Webhook Secret (Optional but Recommended)</h3>
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                type={showSecret ? "text" : "password"}
                value={webhookSecret}
                readOnly
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded-l text-gray-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-200"
              >
                {showSecret ? "Hide" : "Show"}
              </button>
            </div>
            <button
              onClick={() => copyToClipboard(webhookSecret, true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-r"
            >
              {secretCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Use this secret to verify webhook signatures from GitHub
          </p>
        </div>

        <div>
          <button
            onClick={testWebhook}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded"
          >
            Test Webhook
          </button>
          {testSuccessful !== null && (
            <span className={`ml-3 ${testSuccessful ? 'text-green-500' : 'text-red-500'}`}>
              {testSuccessful ? 'Test successful!' : 'Test failed. Check console for details.'}
            </span>
          )}
        </div>

        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-md font-medium text-gray-200 mb-2">Setup Instructions</h3>
          <ol className="space-y-2 text-gray-300 list-decimal ml-4">
            <li>Go to your GitHub repository</li>
            <li>Click on <span className="text-gray-200">Settings &rarr; Webhooks &rarr; Add webhook</span></li>
            <li>For <span className="text-gray-200">Payload URL</span>, paste the webhook URL above</li>
            <li>Set <span className="text-gray-200">Content type</span> to <span className="text-gray-200">application/json</span></li>
            <li>For <span className="text-gray-200">Secret</span>, paste the webhook secret (recommended for security)</li>
            <li>Choose which events you want to trigger the webhook</li>
            <li>Click <span className="text-gray-200">Add webhook</span></li>
          </ol>
        </div>

        <div className="bg-gray-700/50 p-4 rounded text-sm text-gray-400 border border-gray-600">
          <p>
            <strong>Note:</strong> All webhooks sent to this URL will appear in your TymBug dashboard. 
            The webhook secret is used to verify that requests are coming from GitHub.
          </p>
        </div>
      </div>
    </div>
  );
}
