"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Provider {
  id: string;
  name: string;
  description: string;
  setupInstructions: string[];
  secretSupported: boolean;
  example?: string;
}

const PROVIDERS: Provider[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Receive webhook events from GitHub repositories',
    secretSupported: true,
    setupInstructions: [
      'Go to your GitHub repository',
      'Click on Settings → Webhooks → Add webhook',
      'For Payload URL, paste the webhook URL above',
      'Set Content type to application/json',
      'For Secret, paste the webhook secret (recommended for security)',
      'Choose which events you want to trigger the webhook',
      'Click Add webhook'
    ],
    example: `{
  "event": "push",
  "repository": "username/repo",
  "ref": "refs/heads/main",
  "before": "abc123",
  "after": "def456"
}`
  },
  {
    id: 'generic',
    name: 'Custom Webhook',
    description: 'Generic webhook endpoint for any provider',
    secretSupported: false,
    setupInstructions: [
      'Use the webhook URL in your provider settings',
      'Ensure your requests include a valid authorization token',
      'Set Content-Type to application/json',
      'Send POST requests to the webhook URL'
    ],
    example: `{
  "event": "custom_event",
  "payload": {
    "key": "value"
  }
}`
  }
];

export default function ProviderSetup() {
  const [userId, setUserId] = useState<string>('');
  const [webhookUrls, setWebhookUrls] = useState<Record<string, string>>({});
  const [webhookSecret, setWebhookSecret] = useState<string>('');
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [secretCopied, setSecretCopied] = useState<boolean>(false);
  const [testSuccessful, setTestSuccessful] = useState<boolean | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('github');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserId(data.id);
        
        let baseUrl = window.location.origin;
        
        if (baseUrl.includes('localhost')) {
          baseUrl = 'https://tymbug.vercel.app';
        }
        
        const urls: Record<string, string> = {};
        
        PROVIDERS.forEach(provider => {
          if (provider.id === 'github') {
            urls[provider.id] = `${baseUrl}/api/webhooks/github/${data.id}`;
          } else {
            urls[provider.id] = `${baseUrl}/api/webhooks/${provider.id}/${data.id}`;
          }
        });
        
        setWebhookUrls(urls);
        
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

  const copyToClipboard = async (text: string, key: string = 'default', isSecret: boolean = false) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isSecret) {
        setSecretCopied(true);
        toast.success('Webhook secret copied to clipboard');
        setTimeout(() => setSecretCopied(false), 2000);
      } else {
        setCopied(prev => ({ ...prev, [key]: true }));
        toast.success(`${key} URL copied to clipboard`);
        setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  const testWebhook = async () => {
    try {
      setTestSuccessful(null);
      const webhookUrl = webhookUrls[selectedProvider];
      
      let headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      let body = {};
      
      if (selectedProvider === 'github') {
        headers = {
          ...headers,
          'X-GitHub-Event': 'ping',
          'X-GitHub-Delivery': crypto.randomUUID(),
        };
        
        body = {
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
        };
      } else {
        body = {
          event: "test",
          timestamp: new Date().toISOString(),
          data: {
            message: "Test webhook from Tymbug",
            success: true
          }
        };
      }
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setTestSuccessful(true);
        toast.success('Webhook test successful!');
      } else {
        setTestSuccessful(false);
        toast.error(`Webhook test failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestSuccessful(false);
      console.error('Webhook test error:', error);
      toast.error('Failed to test webhook connection');
    }
  };

  const currentProvider = PROVIDERS.find(p => p.id === selectedProvider) || PROVIDERS[0];

  if (loading) {
    return <div className="text-center p-4">Loading webhook setup...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Webhook Provider Setup</h2>
      
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-300 mb-2">Select Provider</h3>
        <div className="flex flex-wrap gap-2">
          {PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedProvider === provider.id
                  ? 'bg-green-500 text-black font-bold'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {provider.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-2">
            <h3 className="text-md font-medium text-gray-300">Your {currentProvider.name} Webhook URL</h3>
            {currentProvider.id === 'github' && (
              <span className="ml-2 bg-blue-800/30 text-blue-400 text-xs px-2 py-0.5 rounded">
                Recommended
              </span>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={webhookUrls[selectedProvider]}
              readOnly
              className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded-l text-gray-200"
            />
            <button
              onClick={() => copyToClipboard(webhookUrls[selectedProvider], selectedProvider)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-r"
            >
              {copied[selectedProvider] ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            {currentProvider.description}
          </p>
        </div>

        {currentProvider.secretSupported && (
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
                onClick={() => copyToClipboard(webhookSecret, "secret", true)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-r"
              >
                {secretCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Use this secret to verify webhook signatures
            </p>
          </div>
        )}

        <div>
          <button
            onClick={testWebhook}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded"
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
            {currentProvider.setupInstructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>

        {currentProvider.example && (
          <div>
            <h3 className="text-md font-medium text-gray-300 mb-2">Example Payload</h3>
            <pre className="p-3 bg-gray-900 rounded text-green-400 text-sm overflow-auto max-h-60">
              {currentProvider.example}
            </pre>
          </div>
        )}

        <div className="bg-gray-700/50 p-4 rounded text-sm text-gray-400 border border-gray-600">
          <p>
            <strong>Note:</strong> All webhooks sent to this URL will appear in your TymBug dashboard. 
            {currentProvider.secretSupported && " The webhook secret is used to verify the authenticity of incoming webhooks."}
          </p>
        </div>
      </div>
    </div>
  );
} 