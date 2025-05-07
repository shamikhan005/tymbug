"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import JsonVisualizer from "./JsonTreeView";
import WebhookAnalysis from './WebhookAnalysis';

interface WebhookDebuggerProps {
  webhookId: string;
  initialHeaders?: Record<string, any>;
  initialBody?: Record<string, any>;
  showResponse?: boolean;
}

const TEST_PARAMETER_PRESETS = [
  { name: "Success (200)", params: "?status=200" },
  { name: "Not Found (404)", params: "?status=404" },
  { name: "Server Error (500)", params: "?status=500" },
  { name: "Delayed Response (2s)", params: "?delay=2000" },
  { name: "Random Error", params: "?fail=true" },
];

export default function WebhookDebugger({ 
  webhookId, 
  initialHeaders, 
  initialBody,
  showResponse = true 
}: WebhookDebuggerProps) {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'setup' | 'headers' | 'body' | 'response' | 'analysis'>('setup');
  
  const [environment, setEnvironment] = useState<'test' | 'custom'>('test');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('/api/test-endpoint');
  const [selectedParams, setSelectedParams] = useState<string>('');
  
  const [originalHeaders, setOriginalHeaders] = useState<Record<string, any>>(initialHeaders || {});
  const [headers, setHeaders] = useState<string>('');
  const [originalBody, setOriginalBody] = useState<Record<string, any>>(initialBody || {});
  const [body, setBody] = useState<string>('');
  
  const [editMode, setEditMode] = useState<boolean>(false);
  const [validJson, setValidJson] = useState<boolean>(true);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [replayHistory, setReplayHistory] = useState<Array<{status: number, timestamp: string}>>([]);

  useEffect(() => {
    if (initialHeaders) {
      setOriginalHeaders(initialHeaders);
      setHeaders(JSON.stringify(initialHeaders, null, 2));
    }
    
    if (initialBody) {
      setOriginalBody(initialBody);
      setBody(JSON.stringify(initialBody, null, 2));
    }
  }, [initialHeaders, initialBody]);

  useEffect(() => {
    if (environment === 'test') {
      let baseUrl = '/api/test-endpoint';
      setTargetUrl(`${baseUrl}${selectedParams}`);
    } else if (environment === 'custom' && customUrl) {
      const baseUrl = customUrl.includes('?') ? customUrl.split('?')[0] : customUrl;
      const existingParams = customUrl.includes('?') ? customUrl.split('?')[1] : '';
      
      if (selectedParams && selectedParams !== '?') {
        if (existingParams) {
          setTargetUrl(`${baseUrl}?${existingParams}&${selectedParams.substring(1)}`);
        } else {
          setTargetUrl(`${baseUrl}${selectedParams}`);
        }
      } else {
        setTargetUrl(customUrl);
      }
    }
  }, [environment, customUrl, selectedParams]);

  const validateJson = (json: string, type: 'headers' | 'body') => {
    try {
      JSON.parse(json);
      setValidJson(true);
      return true;
    } catch (e) {
      setValidJson(false);
      toast.error(`Invalid JSON in ${type}`);
      return false;
    }
  };

  const handleToggleEditMode = () => {
    if (editMode) {
      const headersValid = validateJson(headers, 'headers');
      const bodyValid = validateJson(body, 'body');
      
      if (headersValid && bodyValid) {
        setEditMode(false);
      }
    } else {
      setEditMode(true);
    }
  };

  const handleResetChanges = () => {
    setHeaders(JSON.stringify(originalHeaders, null, 2));
    setBody(JSON.stringify(originalBody, null, 2));
    setValidJson(true);
    toast.success('Changes reset to original values');
  };
  
  const handleSelectPreset = (params: string) => {
    setSelectedParams(params);
    toast.success(`Test parameters set: ${params}`);
  };

  const handleReplay = async () => {
    if (!webhookId) {
      toast.error('Webhook ID is missing');
      return;
    }

    if (editMode && !validJson) {
      toast.error('Please fix the JSON errors before replaying');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponseStatus(null);
    setResponseBody(null);

    try {
      let headersToSend = originalHeaders;
      let bodyToSend = originalBody;
      
      if (editMode) {
        try {
          headersToSend = JSON.parse(headers);
          bodyToSend = JSON.parse(body);
        } catch (e) {
          throw new Error('Invalid JSON format');
        }
      }

      const response = await fetch('/api/replay/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookId,
          targetUrl,
          headers: headersToSend,
          body: bodyToSend
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to replay webhook');
      }

      setResponseStatus(data.responseStatus);
      setResponseBody(data.responseBody);
      
      setReplayHistory(prev => [
        {
          status: data.responseStatus,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev.slice(0, 9) 
      ]);
      
      setActiveTab('response');
      toast.success('Webhook replayed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      toast.error(err instanceof Error ? err.message : 'Failed to replay webhook');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabNav = () => (
    <div className="border-b border-gray-700 mb-6">
      <nav className="-mb-px flex space-x-4">
        {[
          { id: 'setup', label: 'Setup' },
          { id: 'headers', label: 'Headers' },
          { id: 'body', label: 'Body' },
          { id: 'response', label: 'Response' },
          { id: 'analysis', label: 'AI Analysis' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-3 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-green-500 text-green-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">Webhook Debugger</h2>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400">
            Edit Mode: {editMode ? 
              <span className="text-green-500">On</span> : 
              <span className="text-gray-500">Off</span>
            }
          </div>
          
          <button
            onClick={handleToggleEditMode}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editMode 
                ? 'bg-green-500 text-black' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {editMode ? 'Apply Changes' : 'Edit Webhook'}
          </button>
          
          {editMode && (
            <button
              onClick={handleResetChanges}
              className="px-3 py-1 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              Reset
            </button>
          )}
          
          <button
            onClick={handleReplay}
            disabled={isLoading || (editMode && !validJson)}
            className={`ml-2 px-4 py-1 rounded-full text-sm font-bold transition-colors ${
              isLoading || (editMode && !validJson)
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-black'
            }`}
          >
            {isLoading ? 'Replaying...' : 'Replay Webhook'}
          </button>
        </div>
      </div>
      
      {renderTabNav()}
      
      <div className="space-y-6">
        {activeTab === 'setup' && (
          <>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-2">What is this?</h3>
              <p className="text-sm text-gray-400">
                The webhook debugger allows you to test webhook delivery by sending this webhook's payload to any endpoint.
                You can modify the headers and body before sending, and see the response from your endpoint.
              </p>
            </div>
          
            <div>
              <h3 className="text-md font-medium text-gray-300 mb-2">Target Environment</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setEnvironment('test')}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    environment === 'test' 
                      ? 'bg-green-500 text-black' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Test Environment
                </button>
                <button
                  onClick={() => setEnvironment('custom')}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    environment === 'custom' 
                      ? 'bg-green-500 text-black' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Custom Endpoint
                </button>
              </div>
              
              {environment === 'custom' && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://your-endpoint.com/webhook"
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-gray-200"
                  />
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Test Parameters (Optional)</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedParams('')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedParams === '' 
                        ? 'bg-green-500 text-black' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    None
                  </button>
                  
                  {TEST_PARAMETER_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectPreset(preset.params)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedParams === preset.params 
                          ? 'bg-green-500 text-black' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                
                <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs text-gray-400">
                  <span className="text-gray-300">Tip:</span> Test parameters let you control how the test endpoint responds. Try "Delayed Response" to test timeout handling.
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mt-4">
                Current target: <span className="text-green-500 break-all">{targetUrl}</span>
              </p>
            </div>
            
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-300 mb-2">Replay History</h3>
              {replayHistory.length === 0 ? (
                <p className="text-sm text-gray-400">No replays yet</p>
              ) : (
                <div className="bg-gray-900/50 rounded p-2 max-h-40 overflow-y-auto">
                  {replayHistory.map((replay, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b border-gray-700 last:border-0">
                      <span className="text-xs text-gray-400">{replay.timestamp}</span>
                      <span className={`text-xs font-medium ${
                        replay.status >= 200 && replay.status < 300 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        Status: {replay.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        
        {activeTab === 'headers' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-medium text-gray-300">Headers</h3>
              {!editMode && (
                <span className="text-xs text-gray-400">Enable edit mode to modify headers</span>
              )}
            </div>
            
            <div className="p-2 bg-gray-900/50 rounded text-xs text-gray-400 mb-3">
              <p>Headers control how your webhook request is processed. Common important headers:</p>
              <ul className="list-disc ml-4 mt-1 space-y-1">
                <li><code>Content-Type</code>: Specifies the format (usually application/json)</li>
                <li><code>Authorization</code>: Contains authentication credentials</li>
                <li><code>User-Agent</code>: Identifies the client making the request</li>
              </ul>
            </div>
            
            {editMode ? (
              <div className={`relative border ${!validJson ? 'border-red-500' : 'border-gray-700'} rounded`}>
                <textarea
                  value={headers}
                  onChange={(e) => {
                    setHeaders(e.target.value);
                    validateJson(e.target.value, 'headers');
                  }}
                  rows={12}
                  className="w-full bg-gray-900 p-4 rounded text-green-400 font-mono text-sm"
                />
              </div>
            ) : (
              <JsonVisualizer data={JSON.parse(headers || '{}')} title="Headers Visualization" />
            )}
            
            {!validJson && editMode && (
              <p className="mt-2 text-xs text-red-400">
                Invalid JSON format. Please fix the errors before continuing.
              </p>
            )}
          </div>
        )}
        
        {activeTab === 'body' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-medium text-gray-300">Body</h3>
              {!editMode && (
                <span className="text-xs text-gray-400">Enable edit mode to modify body</span>
              )}
            </div>
            
            <div className="p-2 bg-gray-900/50 rounded text-xs text-gray-400 mb-3">
              <p>The body contains the main payload of your webhook. This is what your endpoint will process.</p>
              <p className="mt-1">Try modifying specific values to test how your endpoint handles different scenarios.</p>
            </div>
            
            {editMode ? (
              <div className={`relative border ${!validJson ? 'border-red-500' : 'border-gray-700'} rounded`}>
                <textarea
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    validateJson(e.target.value, 'body');
                  }}
                  rows={16}
                  className="w-full bg-gray-900 p-4 rounded text-green-400 font-mono text-sm"
                />
              </div>
            ) : (
              <JsonVisualizer data={JSON.parse(body || '{}')} title="Body Visualization" />
            )}
          </div>
        )}
        
        {activeTab === 'response' && (
          <div>
            <h3 className="text-md font-medium text-gray-300 mb-2">Response</h3>
            
            {!responseStatus && !error ? (
              <div className="bg-gray-900/50 p-6 rounded border border-gray-700 text-center">
                <p className="text-gray-400 mb-2">No response data yet</p>
                <button
                  onClick={handleReplay}
                  disabled={isLoading || (editMode && !validJson)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-full"
                >
                  Send Request
                </button>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-900/30 border border-red-800 rounded">
                <h4 className="text-red-400 font-medium mb-2">Error</h4>
                <p className="text-red-300">{error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-gray-400">Status Code:</span>
                  <span className={`font-medium ${
                    responseStatus !== null && (responseStatus >= 200 && responseStatus < 300)
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {responseStatus}
                  </span>
                  <span className="text-xs text-gray-500">
                    {responseStatus !== null && (responseStatus >= 200 && responseStatus < 300) 
                      ? 'Success' 
                      : 'Error'}
                  </span>
                </div>
                
                <JsonVisualizer 
                  data={responseBody || {}} 
                  title="Response Body" 
                  className="border border-gray-700"
                />
                
                <div className="mt-4 p-3 bg-gray-800/50 rounded text-xs">
                  <p className="text-gray-400">
                    <span className="text-gray-300 font-medium">Debugging Tip:</span> Check that the response contains the expected data and status code.
                    If you're seeing errors, you might need to adjust your webhook handler or authentication.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'analysis' && (
          <div className="mt-4">
            <WebhookAnalysis
              webhook={{
                provider: environment,
                method: 'POST',
                path: targetUrl,
                headers: editMode && headers ? JSON.parse(headers) : originalHeaders || {},
                body: editMode && body ? JSON.parse(body) : originalBody || {}
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
} 