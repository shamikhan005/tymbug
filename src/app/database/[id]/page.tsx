import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReplayButton from "@/app/components/ReplayButton";
import ReplayHistory from "@/app/components/ReplayHistory";
import WebhookDebugger from "@/app/components/WebhookDebugger";
import CollapsibleSection from "@/app/components/CollapsibleSection";

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
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Webhook Details</h1>
          <Link 
            href="/dashboard" 
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

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

          <CollapsibleSection title="Headers" data={webhook.headers} />
          <CollapsibleSection title="Body" data={webhook.body} />

          <div className="flex gap-3">
            <ReplayButton webhookId={webhook.id} />
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Advanced Debugging</h2>
          <WebhookDebugger 
            webhookId={webhook.id} 
            initialHeaders={webhook.headers as Record<string, any>}
            initialBody={webhook.body as Record<string, any>}
          />
        </div>

        <ReplayHistory webhookId={webhook.id} />
      </div>
    </div>
  );
}
