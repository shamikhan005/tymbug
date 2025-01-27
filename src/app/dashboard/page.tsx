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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Webhook History</h1>
        <div className="text-sm text-gray-500">
          Showing last {webhooks.length} webhooks
        </div>
      </div>

      <div className="grid gap-4">
        {webhooks.map((webhook) => (
          <Link
            href={`/database/${webhook.id}`}
            key={webhook.id}
            className="block border p-6 rounded-lg hover:border-blue-500 transition-colors bg-white"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                  {webhook.provider}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(webhook.receivedAt).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
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
                <span className="font-medium">{webhook._count.Replay}</span>
              </div>
              <div>
                <span className="text-gray-500">ID:</span>{" "}
                <span className="font-mono text-xs">{webhook.id}</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Click to view details →
            </div>
          </Link>
        ))}
      </div>

      {webhooks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No webhooks received yet
        </div>
      )}
    </div>
  );
}
