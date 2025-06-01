export default function Blog() {
    return (
      <div className="bg-gray-50 min-h-screen text-gray-900">
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-gray-900">Blog</h1>
          <div className="space-y-8">
            {/* Blog Post Card Example */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-2">How to Build a Great Developer Portfolio</h2>
              <p className="text-gray-600 mb-4">
                Learn the key elements of a standout developer portfolio and how PortFolyo can help you showcase your skills.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition">
                Read More
              </button>
            </div>
            {/* Add more blog post cards here */}
          </div>
        </section>
      </div>
    );
  }