"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface WebhookDebuggerProps {
  webhookId: string;
  initialHeaders?: Record<string, any>;
  initialBody?: Record<string, any>;
  showResponse?: boolean;
}

export default function WebhookDebugger({ 
  webhookId, 
  initialHeaders, 
  initialBody,
  showResponse = true 
}: WebhookDebuggerProps) {
  const router = useRouter();
  
  const [environment, setEnvironment] = useState<'test' | 'custom'>('test');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('/api/test-endpoint');
  
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
      setTargetUrl('/api/test-endpoint');
    } else if (environment === 'custom' && customUrl) {
      setTargetUrl(customUrl);
    }
  }, [environment, customUrl]);

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
      toast.success('Webhook replayed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      toast.error(err instanceof Error ? err.message : 'Failed to replay webhook');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Webhook Debugger</h2>
      
      <div className="space-y-6">
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
          
          <p className="text-sm text-gray-400 mt-2">
            Current target: <span className="text-green-500">{targetUrl}</span>
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleEditMode}
              className={`px-4 py-2 rounded font-medium transition-colors ${
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
                className="px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded font-medium transition-colors"
              >
                Reset Changes
              </button>
            )}
          </div>
          
          <button
            onClick={handleReplay}
            disabled={isLoading || (editMode && !validJson)}
            className={`px-4 py-2 rounded-full font-bold transition-colors ${
              isLoading || (editMode && !validJson)
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-black'
            }`}
          >
            {isLoading ? 'Replaying...' : 'Replay Webhook'}
          </button>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-md font-medium text-gray-300">Headers</h3>
            {!editMode && (
              <span className="text-xs text-gray-400">Edit mode disabled</span>
            )}
          </div>
          
          <div className={`relative border ${!validJson && editMode ? 'border-red-500' : 'border-gray-700'} rounded`}>
            <textarea
              value={editMode ? headers : JSON.stringify(originalHeaders, null, 2)}
              onChange={(e) => {
                setHeaders(e.target.value);
                validateJson(e.target.value, 'headers');
              }}
              disabled={!editMode}
              rows={8}
              className="w-full bg-gray-900 p-4 rounded text-green-400 font-mono text-sm"
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-md font-medium text-gray-300">Body</h3>
            {!editMode && (
              <span className="text-xs text-gray-400">Edit mode disabled</span>
            )}
          </div>
          
          <div className={`relative border ${!validJson && editMode ? 'border-red-500' : 'border-gray-700'} rounded`}>
            <textarea
              value={editMode ? body : JSON.stringify(originalBody, null, 2)}
              onChange={(e) => {
                setBody(e.target.value);
                validateJson(e.target.value, 'body');
              }}
              disabled={!editMode}
              rows={10}
              className="w-full bg-gray-900 p-4 rounded text-green-400 font-mono text-sm"
            />
          </div>
        </div>
        
        {showResponse && (responseStatus !== null || error) && (
          <div>
            <h3 className="text-md font-medium text-gray-300 mb-2">Replay Results</h3>
            
            {error ? (
              <div className="p-3 bg-red-900/30 border border-red-800 rounded">
                <p className="text-red-400">{error}</p>
              </div>
            ) : (
              <div className="p-3 bg-gray-900 rounded border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-medium ${
                    responseStatus !== null && (responseStatus >= 200 && responseStatus < 300)
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {responseStatus}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-400">Response:</span>
                  <pre className="mt-1 p-2 bg-gray-800 rounded text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(responseBody, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 