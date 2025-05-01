"use client";

import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">TymBug Documentation</h1>
          <Link
            href="/"
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-5xl mb-6">📝</div>
          <h2 className="text-2xl font-bold mb-4 text-green-500">Documentation Coming Soon</h2>
          <p className="text-lg mb-6">
            currently working on comprehensive documentation for TymBug.
            Check back later for detailed guides.
          </p>
          <p className="text-gray-400">
            In the meantime, explore the application and reach out if you have any questions.
          </p>
        </div>
      </div>
    </div>
  );
}
