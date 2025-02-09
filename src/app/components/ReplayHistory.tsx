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

  if (error) return <div>Error loading replay history.</div>;
  if (!webhook) return <div>...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Replay History</h2>
      {webhook.Replay.length > 0 ? (
        <div className="space-y-4">
          {webhook.Replay.map((replay: any) => (
            <Link key={replay.id} href={`/replays/${replay.id}`} passHref>
              <div className="border p-4 rounded cursor-pointer hover:bg-gray-100">
                <div className="flex justify-between">
                  <span className="font-medium">
                    Status: {replay.responseStatus}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(replay.replayedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No replays yet</p>
      )}
    </div>
  );
}
