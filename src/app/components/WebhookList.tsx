"use client";

import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WebhookList() {
  const { data: webhooks, error } = useSWR("/api/hookfetch", fetcher, {
    refreshInterval: 5000,
  });

  if (error) return <div className="text-red-400">Error loading webhooks.</div>;
  if (!webhooks) return <div className="text-gray-400">...</div>;

  return (
    <div className="space-y-4">
      {webhooks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No webhooks received yet
        </div>
      ) : (
        webhooks.map((webhook: any) => (
          <Link
            href={`/database/${webhook.id}`}
            key={webhook.id}
            className="block hover:bg-gray-800 transition-colors rounded-lg overflow-hidden bg-gray-800/50"
          >
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                    {webhook.provider}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(webhook.receivedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Status:</span>{" "}
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
                  <div>
                    <span className="text-gray-400">Method:</span>{" "}
                    <span className="font-medium text-gray-200">{webhook.method}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Replays:</span>{" "}
                    <span className="font-medium text-gray-200">{webhook._count.Replay}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">
                  {webhook.id}
                </span>
                <svg
                  className="w-5 h-5 text-gray-500"
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
          </Link>
        ))
      )}
    </div>
  );
}
