import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono flex flex-col relative overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/Green_Mist_Video_Generation_Complete.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
    
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10"></div>
      
  
      <main className="flex-grow flex flex-col items-center justify-center relative z-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-green-500 animate-fade-in-down drop-shadow-2xl">
            Tymbug
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto animate-fade-in-up drop-shadow-lg">
            A platform for webhook testing and debugging
          </p>

          <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-6 mb-10 max-w-2xl mx-auto overflow-hidden border border-gray-700">
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
              className="inline-block bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-8 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </Link>
            <Link
              href="https://deepwiki.com/shamikhan005/tymbug"
              className="inline-block bg-gray-700 bg-opacity-90 backdrop-blur-sm hover:bg-gray-600 text-gray-100 font-bold py-2 px-8 rounded-full transition-colors duration-300 border border-gray-600 shadow-lg hover:shadow-xl"
            >
              Documentation
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-6 border-t border-gray-700 border-opacity-50 relative z-20 bg-gray-900 bg-opacity-80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Tymbug • A webhook debugging platform
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="https://github.com/shamikhan005/tymbug" className="text-gray-300 hover:text-white transition-colors">GitHub</a>
              <a href="https://x.com/shamikhan005" className="text-gray-300 hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
