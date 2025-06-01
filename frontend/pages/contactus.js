export default function Contact() {
    return (
      <div className="bg-gray-50 min-h-screen text-gray-900">
        <section className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-gray-900">Contact Us</h1>
          <form className="bg-white rounded-xl shadow p-6 space-y-4">
            <div>
              <label className="block mb-1 text-gray-700">Your Name</label>
              <input
                type="text"
                className="w-full rounded-md bg-gray-100 border border-gray-300 text-gray-900 px-4 py-2"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Your Email</label>
              <input
                type="email"
                className="w-full rounded-md bg-gray-100 border border-gray-300 text-gray-900 px-4 py-2"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Your Message</label>
              <textarea
                className="w-full rounded-md bg-gray-100 border border-gray-300 text-gray-900 px-4 py-2"
                rows={4}
                placeholder="Enter your message"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-full transition">
                Send Message
              </button>
            </div>
          </form>
          <div className="mt-8 text-gray-500 text-sm text-left">
            Support: support@portfolyo.com
          </div>
        </section>
      </div>
    );
  }