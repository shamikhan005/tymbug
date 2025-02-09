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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Webhook Details</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Provider
            </label>
            <div className="mt-1">{webhook.provider}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Received At
            </label>
            <div className="mt-1">
              {new Date(webhook.receivedAt).toLocaleString()}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Method</label>
            <div className="mt-1">{webhook.method}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">{webhook.responseStatus}</div>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-500">Headers</label>
          <pre className="mt-1 bg-gray-50 p-4 rounded overflow-auto">
            {JSON.stringify(webhook.headers, null, 2)}
          </pre>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-500">Body</label>
          <pre className="mt-1 bg-gray-50 p-4 rounded overflow-auto">
            {JSON.stringify(webhook.body, null, 2)}
          </pre>
        </div>

        <ReplayButton webhookId={webhook.id} />
      </div>

      <ReplayHistory webhookId={webhook.id} />
    </div>
  );
}
