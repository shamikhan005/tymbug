import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonVisualizer from "@/app/components/JsonTreeView";

const prisma = new PrismaClient();

interface ReplayDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReplayDetail({ params }: ReplayDetailProps) {
  const { id } = await params;

  const replay = await prisma.replay.findUnique({
    where: { id },
    include: { originalWebhook: true },
  });

  if (!replay) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-500">
            Replay Details
          </h1>
          <Link 
            href={`/database/${replay.originalWebhook.id}`} 
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded transition-colors"
          >
            Back to Webhook
          </Link>
        </div>

        <div className="bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-green-400">
            General Information
          </h2>
          <p className="mb-2">
            <span className="text-gray-400">Status:</span>{" "}
            <span
              className={
                replay.responseStatus >= 200 && replay.responseStatus < 300
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {replay.responseStatus}
            </span>
          </p>
          <p className="mb-2">
            <span className="text-gray-400">Replayed At:</span>{" "}
            <span className="text-gray-200">
              {new Date(replay.replayedAt).toLocaleString()}
            </span>
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-4 text-green-400">
            Original Webhook
          </h2>
          <p className="mb-2">
            <span className="text-gray-400">Method:</span>{" "}
            <span className="text-gray-200">
              {replay.originalWebhook.method}
            </span>
          </p>
          <p className="mb-2">
            <span className="text-gray-400">Path:</span>{" "}
            <span className="text-gray-200">{replay.originalWebhook.path}</span>
          </p>

          <div className="space-y-6 mt-6">
            <JsonVisualizer data={replay.originalWebhook.headers} title="Headers" />
            <JsonVisualizer data={replay.originalWebhook.body} title="Body" />
          </div>
        </div>
      </div>
    </div>
  );
}
