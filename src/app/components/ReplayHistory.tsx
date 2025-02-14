"use client";

import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReplayHistory({ webhookId }: { webhookId: string }) {
  const { data: webhook, error } = useSWR(
    `/api/webhook/${webhookId}`,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  if (error)
    return <div className="text-red-400">Error loading replay history.</div>;
  if (!webhook) return <div className="text-gray-400">...</div>;

  return (
    <div className="bg-gray-800 shadow rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-8 text-green-500">
        Replay History
      </h2>
      {webhook.Replay.length > 0 ? (
        <div>
          {webhook.Replay.map((replay: any) => (
            <Link key={replay.id} href={`/replays/${replay.id}`} passHref>
              <div className="bg-gray-700 p-4 rounded cursor-pointer hover:bg-gray-600 transition-colors duration-300 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-200">
                    Status:{" "}
                    <span
                      className={
                        replay.responseStatus >= 200 &&
                        replay.responseStatus < 300
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {replay.responseStatus}
                    </span>
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(replay.replayedAt).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">
                    {replay.id}
                  </span>
                  <svg
                    className="w-5 h-5 text-green-500"
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
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No replays yet</p>
      )}
    </div>
  );
}
