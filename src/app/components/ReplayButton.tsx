"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReplayButton({ webhookId }: { webhookId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReplay = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/replay/${webhookId}`, {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        router.push(`/replays/${data.id}`);
      } else {
        alert("Replay failed: " + data.error);
      }
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleReplay}
      disabled={loading}
      className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-full transition-colors duration-300"
    >
      {loading ? "Replaying..." : "Replay Webhook"}
    </button>
  );
}
