import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      <header className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-down">
          Tymbug: A Webhook Playground
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 animate-fade-in-up">
          A personal project for experimenting with webhook debugging,
          replaying, and analysis.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="inline-block bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded-full transition-colors duration-300 animate-pulse"
          >
            Get Started
          </Link>
          <Link
            href="/docs"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-6 rounded-full transition-colors duration-300"
          >
            Documentation
          </Link>
        </div>
        <div className="mt-12 p-4 bg-gray-800 rounded-lg overflow-hidden">
          <pre className="text-left text-sm md:text-base whitespace-pre-wrap break-all">
            <code className="block">
              {`POST /webhook HTTP/1.1
Host: api.tymbug.com
Content-Type: application/json

{
  "event": "user.created",
  "data": {
    "id": "123",
    "name": "Shami khan",
    "email": "shamikhan005@proton.me"
  }
}`}
            </code>
          </pre>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Real-time Webhook Logging",
              description: "Stores incoming webhook events for later analysis.",
              icon: "📥",
            },
            {
              title: "Replay Webhooks",
              description: "Resend past requests to test API behavior.",
              icon: "🔁",
            },
            {
              title: "Compare Responses",
              description: "View differences between webhook attempts.",
              icon: "🔍",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg transition-transform duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How to Use It</h2>
        <div className="space-y-8">
          {[
            {
              step: "1",
              title: "Send a webhook to Tymbug's test endpoint",
              description:
                "Use your favorite API client or curl to send a webhook.",
            },
            {
              step: "2",
              title: "View and replay requests from the dashboard",
              description:
                "Log in to the Tymbug dashboard to see your incoming webhooks and replay them with a single click.",
            },
            {
              step: "3",
              title: "Analyze headers, payload, and response history",
              description:
                "Dive deep into the details of each webhook, compare different attempts.",
            },
          ].map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="bg-green-500 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                {step.step}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gray-800 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-400 mb-6">
            Check out our comprehensive documentation to learn more about TymBug's features.
          </p>
          <Link
            href="/docs"
            className="inline-block bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded-full transition-colors duration-300"
          >
            Read the Docs
          </Link>
        </div>
      </section>
    </div>
  );
}
