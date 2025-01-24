import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Dashboard() {
  const webhooks = await prisma.webhook.findMany({
    orderBy: { receivedAt: "desc" },
    take: 50
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        webhook history
      </h1>
      <div className="space-y-2">
        {webhooks.map(webhook => (
          <div key={webhook.id} className="border p-4 rounded">
            <div className="flex justify-between">
              <span className="font-medium">{webhook.provider}</span>
              <span className="text-sm text-gray-500">
                {new Date(webhook.receivedAt).toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              status: {webhook.responseStatus}
            </div>
            <div className="text-sm text-gray-600">
              ID: {webhook.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}