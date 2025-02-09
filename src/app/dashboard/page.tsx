"use client";

import LogoutButton from "../components/LogoutButton";
import WebhookList from "../components/WebhookList";

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Webhook History
        </h1>
        <div className="flex items-center gap-4">
          <LogoutButton />
        </div>
      </div>
      <WebhookList />
    </div>
  );
}
