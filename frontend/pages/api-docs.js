export default function ApiDocs() {
    return (
      <div className="bg-gray-50 min-h-screen text-gray-900">
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-gray-900">API Documentation</h1>
          <div className="bg-white rounded-xl shadow p-6 space-y-6">
            <h2 className="text-xl font-bold">Getting Started</h2>
            <p>
              Welcome to the PortFolyo API! Here you’ll find all the information you need to integrate with our platform.
            </p>
            <h2 className="text-xl font-bold">Authentication</h2>
            <p>
              All API requests require an API key. You can find your key in your account settings.
            </p>
            <h2 className="text-xl font-bold">Endpoints</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li><span className="font-semibold">GET /api/users</span> - List all users</li>
              <li><span className="font-semibold">POST /api/profile</span> - Create a new profile</li>
              {/* Add more endpoints as needed */}
            </ul>
          </div>
        </section>
      </div>
    );
  }