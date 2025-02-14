import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReplayButton from "@/app/components/ReplayButton";
import ReplayHistory from "@/app/components/ReplayHistory";

const prisma = new PrismaClient();

export default async function WebhookDetail(context: {
  params: { id: string };
}) {
  const params = await Promise.resolve(context.params);

  const webhook = await prisma.webhook.findUnique({
    where: { id: params.id },
    include: {
      Replay: {
        orderBy: { replayedAt: "desc" },
      },
    },
  });

  if (!webhook) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Webhook Details</h1>

        <div className="bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-400">
                Provider
              </label>
              <div className="mt-1 text-green-500">{webhook.provider}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">
                Received At
              </label>
              <div className="mt-1">
                {new Date(webhook.receivedAt).toLocaleString()}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">
                Method
              </label>
              <div className="mt-1">{webhook.method}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">
                Status
              </label>
              <div className="mt-1">{webhook.responseStatus}</div>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-400">Headers</label>
            <pre className="mt-1 bg-gray-700 p-4 rounded overflow-auto text-green-400">
              {JSON.stringify(webhook.headers, null, 2)}
            </pre>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-400">Body</label>
            <pre className="mt-1 bg-gray-700 p-4 rounded overflow-auto text-green-400">
              {JSON.stringify(webhook.body, null, 2)}
            </pre>
          </div>

          <ReplayButton webhookId={webhook.id} />
        </div>

        <ReplayHistory webhookId={webhook.id} />
      </div>
    </div>
  );
}
