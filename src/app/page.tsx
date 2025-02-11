export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
      <main className="flex flex-col items-center text-center px-6">
        <h2 className="text-4xl font-bold mb-4">Tymbug</h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Capture, replay, and diagnose webhooks in real-time.
        </p>
        <a href="/signup" className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600">
          Get Started
        </a>
      </main>
      
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl text-center">
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold">Capture</h3>
          <p className="text-gray-600 mt-2">Store webhook requests for inspection and analysis.</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold">Replay</h3>
          <p className="text-gray-600 mt-2">Resend webhooks to debug issues quickly.</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold">Compare</h3>
          <p className="text-gray-600 mt-2">Analyze webhook responses to ensure consistency.</p>
        </div>
      </section>
    </div>
  );
}
