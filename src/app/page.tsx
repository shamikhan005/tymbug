import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-green-500 animate-fade-in-down">
            Tymbug
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto animate-fade-in-up">
            A platform for webhook testing and debugging
          </p>

          <div className="bg-gray-800 rounded-lg p-6 mb-10 max-w-2xl mx-auto overflow-hidden">
            <pre className="text-left text-sm md:text-base text-green-400 whitespace-pre-wrap">
              {`POST /api/webhooks/{provider} HTTP/1.1
Content-Type: application/json
Authorization: Bearer {your-token}

{
  "event": "object.updated",
  "data": { ... }
}`}
            </pre>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            <Link
              href="/signup"
              className="inline-block bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-8 rounded-full transition-colors duration-300"
            >
              Sign Up
            </Link>
            <Link
              href="https://deepwiki.com/shamikhan005/tymbug"
              className="inline-block bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-8 rounded-full transition-colors duration-300"
            >
              Documentation
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-6 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Tymbug • A webhook debugging platform
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="https://github.com/shamikhan005/tymbug" className="text-gray-500 hover:text-gray-300">GitHub</a>
              <a href="https://x.com/shamikhan005" className="text-gray-500 hover:text-gray-300">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
