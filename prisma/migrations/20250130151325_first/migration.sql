-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "headers" JSONB NOT NULL,
    "body" JSONB NOT NULL,
    "responseStatus" INTEGER NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Replay" (
    "id" TEXT NOT NULL,
    "originalId" TEXT NOT NULL,
    "replayedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseStatus" INTEGER NOT NULL,

    CONSTRAINT "Replay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Webhook_provider_idx" ON "Webhook"("provider");

-- CreateIndex
CREATE INDEX "Webhook_receivedAt_idx" ON "Webhook"("receivedAt");

-- CreateIndex
CREATE INDEX "Replay_replayedAt_idx" ON "Replay"("replayedAt");

-- AddForeignKey
ALTER TABLE "Replay" ADD CONSTRAINT "Replay_originalId_fkey" FOREIGN KEY ("originalId") REFERENCES "Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
