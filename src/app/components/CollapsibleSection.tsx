"use client";

import { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  data: any;
}

export default function CollapsibleSection({ title, data }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-400">{title}</label>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      <div className={`mt-1 bg-gray-700 rounded overflow-hidden transition-all duration-200 ${isExpanded ? '' : 'max-h-44'}`}>
        <pre className="p-4 overflow-auto text-green-400">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      {!isExpanded && (
        <button 
          onClick={() => setIsExpanded(true)} 
          className="mt-1 w-full text-xs py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
        >
          Show More
        </button>
      )}
    </div>
  );
} 