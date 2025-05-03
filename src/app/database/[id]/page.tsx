import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReplayButton from "@/app/components/ReplayButton";
import ReplayHistory from "@/app/components/ReplayHistory";
import WebhookDebugger from "@/app/components/WebhookDebugger";
import JsonVisualizer from "@/app/components/JsonTreeView";

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WebhookDetail({ params }: PageProps) {
  const { id } = await params;

  const webhook = await prisma.webhook.findUnique({
    where: { id },
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
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Webhook Details</h1>
            <p className="text-gray-400 text-sm mt-1">ID: {webhook.id}</p>
          </div>
          <Link 
            href="/dashboard" 
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gray-700 text-green-500 rounded-full text-sm font-medium">
                {webhook.provider}
              </span>
              <span className="text-gray-400">
                {new Date(webhook.receivedAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2 items-center">
                <span className="text-gray-400">Method:</span>
                <span className="font-medium">{webhook.method}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-gray-400">Status:</span>
                <span className={`font-medium ${
                  webhook.responseStatus >= 200 && webhook.responseStatus < 300
                    ? "text-green-500"
                    : "text-red-500"
                }`}>
                  {webhook.responseStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Payload Data</h2>
            <div className="space-y-4">
              <JsonVisualizer data={webhook.headers} title="Headers" />
              <JsonVisualizer data={webhook.body} title="Body" />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Replay Webhook</h2>
              <ReplayButton webhookId={webhook.id} />
            </div>
            <p className="text-gray-400 text-sm mt-1 mb-4">
              Click the button to replay this webhook with its original payload.
              For advanced options, use the debugger below.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="border-b border-gray-700 px-6 py-4">
            <h2 className="text-xl font-semibold">Webhook Debugger</h2>
            <p className="text-gray-400 text-sm">
              Modify headers and body content, then replay to any endpoint.
            </p>
          </div>
          
          <WebhookDebugger 
            webhookId={webhook.id} 
            initialHeaders={webhook.headers as Record<string, any>}
            initialBody={webhook.body as Record<string, any>}
          />
        </div>

        <div className="mt-6 bg-gray-800 rounded-lg overflow-hidden">
          <div className="border-b border-gray-700 px-6 py-4">
            <h2 className="text-xl font-semibold">Replay History</h2>
            <p className="text-gray-400 text-sm">
              Previous replay attempts of this webhook.
            </p>
          </div>
          <div className="p-6">
            <ReplayHistory webhookId={webhook.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
