import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function Dashboard() {
  const webhooks = await prisma.webhook.findMany({
    orderBy: { receivedAt: "desc" },
    take: 50,
    include: {
      _count: {
        select: { Replay: true },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Webhook History
        </h1>
        <div className="text-sm text-gray-500">
          Showing last {webhooks.length} webhooks
        </div>
      </div>

      {webhooks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No webhooks received yet
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <Link
              href={`/database/${webhook.id}`}
              key={webhook.id}
              className="block hover:bg-gray-50 transition-colors rounded-lg overflow-hidden"
            >
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-800">
                      {webhook.provider}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(webhook.receivedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>{" "}
                      <span
                        className={`font-medium ${
                          webhook.responseStatus >= 200 &&
                          webhook.responseStatus < 300
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {webhook.responseStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Method:</span>{" "}
                      <span className="font-medium">{webhook.method}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Replays:</span>{" "}
                      <span className="font-medium">
                        {webhook._count.Replay}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-mono">
                    {webhook.id}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400"
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
      )}
    </div>
  );
}
