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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Replay Details</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">General Information</h2>
        <p>
          <strong>Status:</strong> {replay.responseStatus}
        </p>
        <p>
          <strong>Replayed At:</strong>{" "}
          {new Date(replay.replayedAt).toLocaleString()}
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-4">Original Webhook</h2>
        <p>
          <strong>Method:</strong> {replay.originalWebhook.method}
        </p>
        <p>
          <strong>Path:</strong> {replay.originalWebhook.path}
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-4">Headers</h2>
        <pre className="bg-gray-50 p-4 rounded overflow-auto">
          {JSON.stringify(replay.originalWebhook.headers, null, 2)}
        </pre>

        <h2 className="text-lg font-semibold mt-6 mb-4">Body</h2>
        <pre className="bg-gray-50 p-4 rounded overflow-auto">
          {JSON.stringify(replay.originalWebhook.body, null, 2)}
        </pre>
      </div>
    </div>
  );
}
