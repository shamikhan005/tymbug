"use client";

import { useState, useCallback, useMemo } from "react";

const TYPE_COLORS = {
  string: "text-green-400",
  number: "text-blue-400",
  boolean: "text-yellow-400",
  null: "text-red-400",
  object: "text-purple-400",
  array: "text-indigo-400",
  key: "text-gray-300",
};

const KEY_HIGHLIGHTS = {
  id: "bg-purple-800/30",
  _id: "bg-purple-800/30",
  uuid: "bg-purple-800/30",
  time: "bg-blue-800/30",
  timestamp: "bg-blue-800/30",
  date: "bg-blue-800/30",
  status: "bg-yellow-800/30",
  code: "bg-yellow-800/30",
  error: "bg-red-800/30",
};

interface JsonTreeViewProps {
  data: any;
  level?: number;
  path?: string;
  isLast?: boolean;
}

const JsonTreeView: React.FC<JsonTreeViewProps> = ({
  data,
  level = 0,
  path = "",
  isLast = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const getType = useCallback((value: any): string => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  }, []);

  const formatValue = useCallback((value: any, type: string): string => {
    if (type === "string") return `"${value}"`;
    if (type === "null") return "null";
    return String(value);
  }, []);

  const getKeyHighlightClass = useCallback((key: string): string => {
    for (const [highlight, className] of Object.entries(KEY_HIGHLIGHTS)) {
      if (key.toLowerCase().includes(highlight.toLowerCase())) {
        return className;
      }
    }
    return "";
  }, []);

  const isExpandable = useMemo(() => {
    const type = getType(data);
    return type === "object" || type === "array";
  }, [data, getType]);

  const itemCount = useMemo(() => {
    if (!isExpandable) return 0;
    return Object.keys(data).length;
  }, [data, isExpandable]);

  const renderPrimitive = useCallback(
    (value: any, type: string) => {
      return (
        <span className={TYPE_COLORS[type as keyof typeof TYPE_COLORS]}>
          {formatValue(value, type)}
        </span>
      );
    },
    [formatValue]
  );

  const renderToggle = useCallback(() => {
    if (!isExpandable) return null;

    return (
      <button
        onClick={toggleExpand}
        className="w-4 inline-block text-center text-gray-400 hover:text-gray-100 focus:outline-none"
        aria-label={isExpanded ? "Collapse" : "Expand"}
      >
        {isExpanded ? "▼" : "▶"}
      </button>
    );
  }, [isExpandable, isExpanded, toggleExpand]);

  const renderKey = useCallback(
    (key: string) => {
      const highlightClass = getKeyHighlightClass(key);

      return (
        <span className={`${TYPE_COLORS.key} ${highlightClass} px-1 rounded`}>
          "{key}":
        </span>
      );
    },
    [getKeyHighlightClass]
  );

  const renderTree = () => {
    const type = getType(data);

    if (type !== "object" && type !== "array") {
      return renderPrimitive(data, type);
    }

    return (
      <div>
        <div className="flex items-start">
          <span className="mr-1">{renderToggle()}</span>

          <div className="flex-1">
            <span className={TYPE_COLORS[type as keyof typeof TYPE_COLORS]}>
              {type === "array" ? "[" : "{"}
            </span>

            {!isExpanded && (
              <span className="text-gray-400 ml-1">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}

            {!isExpanded && (
              <span className={TYPE_COLORS[type as keyof typeof TYPE_COLORS]}>
                {type === "array" ? "]" : "}"}
              </span>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="ml-5 pl-2 border-l border-gray-700">
            {Object.entries(data).map(([key, value], index, arr) => {
              const isLastItem = index === arr.length - 1;
              const childPath = path ? `${path}.${key}` : key;

              return (
                <div key={childPath} className="flex items-start">
                  <div className="flex-1">
                    <span>{renderKey(key)} </span>
                    <JsonTreeView
                      data={value}
                      level={level + 1}
                      path={childPath}
                      isLast={isLastItem}
                    />
                    {!isLastItem && <span className="text-gray-400">,</span>}
                  </div>
                </div>
              );
            })}

            <div className={TYPE_COLORS[type as keyof typeof TYPE_COLORS]}>
              {type === "array" ? "]" : "}"}
              {!isLast && <span className="text-gray-400">,</span>}
            </div>
          </div>
        )}
      </div>
    );
  };

  return renderTree();
};

interface JsonVisualizerProps {
  data: any;
  title?: string;
  className?: string;
}

const JsonVisualizer: React.FC<JsonVisualizerProps> = ({
  data,
  title,
  className = "",
}) => {
  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      <div className="flex justify-between items-center p-3 bg-gray-700">
        {title && (
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        )}
      </div>

      <div className="p-4 overflow-auto font-mono text-sm max-h-96">
        <JsonTreeView data={data} />
      </div>

      <div className="p-2 bg-gray-700 text-xs text-gray-400">
        <div className="flex items-center flex-wrap gap-3">
          <span>Types:</span>
          <span className={`${TYPE_COLORS.string} px-1`}>String</span>
          <span className={`${TYPE_COLORS.number} px-1`}>Number</span>
          <span className={`${TYPE_COLORS.boolean} px-1`}>Boolean</span>
          <span className={`${TYPE_COLORS.object} px-1`}>Object</span>
          <span className={`${TYPE_COLORS.array} px-1`}>Array</span>
          <span className={`${TYPE_COLORS.null} px-1`}>Null</span>
        </div>
        <div className="flex items-center flex-wrap gap-3 mt-1">
          <span>Highlights:</span>
          <span className="bg-purple-800/30 px-1 rounded">IDs</span>
          <span className="bg-blue-800/30 px-1 rounded">Timestamps</span>
          <span className="bg-yellow-800/30 px-1 rounded">Status</span>
          <span className="bg-red-800/30 px-1 rounded">Errors</span>
        </div>
      </div>
    </div>
  );
};

export default JsonVisualizer;
