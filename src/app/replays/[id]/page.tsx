import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

interface ReplayDetailProps {
  params: {
    id: string;
  };
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
        <h1 className="text-2xl font-bold mb-6 text-green-500">
          Replay Details
        </h1>

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

          <h2 className="text-lg font-semibold mt-6 mb-4 text-green-400">
            Headers
          </h2>
          <pre className="bg-gray-700 p-4 rounded overflow-auto text-green-300">
            {JSON.stringify(replay.originalWebhook.headers, null, 2)}
          </pre>

          <h2 className="text-lg font-semibold mt-6 mb-4 text-green-400">
            Body
          </h2>
          <pre className="bg-gray-700 p-4 rounded overflow-auto text-green-300">
            {JSON.stringify(replay.originalWebhook.body, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
