export default function About() {
    return (
      <div className="bg-gray-50 min-h-screen text-gray-900">
        {/* Hero/About Section */}
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-8">
          <div className="bg-white rounded-xl p-8 h-126 flex flex-col items-center relative overflow-hidden shadow">
            {/* Hero Image Placeholder */}
            <div className="absolute inset-0 opacity-60">
              <img src="/images/ab1.png" alt="About Hero" className="w-full h-full object-cover" /> 
            </div>
            {/* Overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/15" />
            <div className="relative z-10 flex flex-col items-center text-center p-35">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">About PortFolyo</h1>
              <p className="text-lg text-white mb-6">
                PortFolyo is a platform that transforms static resumes into dynamic, interactive developer profiles, showcasing skills and projects in a compelling way.
              </p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition">
                Get Started
              </button>
            </div>
          </div>
        </section>
  
        {/* Mission Section */}
        <section className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 order-2 md:order-1">
            <h2 className="font-bold mb-2 text-gray-900">Our Mission</h2>
            <p className="text-gray-700">
              Our mission is to empower developers to showcase their skills and projects in a dynamic and interactive way, transforming static resumes into compelling, interactive profiles.
            </p>
          </div>
          <div className="flex-1 flex justify-center order-1 md:order-2">
            {/* Mission Image Placeholder - ab2.png */}
            <img src="/images/ab2.png" alt="Mission" className="rounded-lg w-full max-w-md object-cover" />
          </div>
        </section>
  
        {/* Company Story Section */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="font-bold text-gray-900 mb-4">Company Story</h2>
          <div className="space-y-6 border-l-2 border-gray-200 pl-6">
            <div>
              <h3 className="font-semibold text-gray-800">2020: Founded</h3>
              <p className="text-gray-600">PortFolyo was founded with the vision of revolutionizing how developers present their work.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">2022: Launched Public Beta</h3>
              <p className="text-gray-600">The public beta was launched, allowing developers to create and share interactive profiles.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">2024: Expanded Features</h3>
              <p className="text-gray-600">New features were added, including project showcases and skill assessments.</p>
            </div>
          </div>
        </section>
  
        {/* Team Members Section */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="font-bold text-gray-900 mb-4">Team Members</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center">
              {/* Paste image: /images/ethan-carter.png */}
              {/* <img src="/images/ethan-carter.png" alt="Ethan Carter" className="w-20 h-20 rounded-full mb-2 object-cover" /> */}
              <div className="font-semibold text-gray-800">Ethan Carter</div>
              <div className="text-gray-500 text-sm">CEO</div>
            </div>
            {/* Team Member 2 */}
            <div className="flex flex-col items-center">
              {/* Paste image: /images/olivia-bennett.png */}
              {/* <img src="/images/olivia-bennett.png" alt="Olivia Bennett" className="w-20 h-20 rounded-full mb-2 object-cover" /> */}
              <div className="font-semibold text-gray-800">Olivia Bennett</div>
              <div className="text-gray-500 text-sm">CTO</div>
            </div>
            {/* Team Member 3 */}
            <div className="flex flex-col items-center">
              {/* Paste image: /images/noah-thompson.png */}
              {/* <img src="/images/noah-thompson.png" alt="Noah Thompson" className="w-20 h-20 rounded-full mb-2 object-cover" /> */}
              <div className="font-semibold text-gray-800">Noah Thompson</div>
              <div className="text-gray-500 text-sm">Head of Design</div>
            </div>
            {/* Team Member 4 */}
            <div className="flex flex-col items-center">
              {/* Paste image: /images/ava-harper.png */}
              {/* <img src="/images/ava-harper.png" alt="Ava Harper" className="w-20 h-20 rounded-full mb-2 object-cover" /> */}
              <div className="font-semibold text-gray-800">Ava Harper</div>
              <div className="text-gray-500 text-sm">Head of Marketing</div>
            </div>
            {/* Team Member 5 */}
            <div className="flex flex-col items-center">
              {/* Paste image: /images/liam-foster.png */}
              {/* <img src="/images/liam-foster.png" alt="Liam Foster" className="w-20 h-20 rounded-full mb-2 object-cover" /> */}
              <div className="font-semibold text-gray-800">Liam Foster</div>
              <div className="text-gray-500 text-sm">Lead Developer</div>
            </div>
            {/* Team Member 6 */}
            <div className="flex flex-col items-center">
              {/* Paste image: /images/isabella-hayes.png */}
              {/* <img src="/images/isabella-hayes.png" alt="Isabella Hayes" className="w-20 h-20 rounded-full mb-2 object-cover" /> */}
              <div className="font-semibold text-gray-800">Isabella Hayes</div>
              <div className="text-gray-500 text-sm">Community Manager</div>
            </div>
          </div>
        </section>
  
        {/* Contact Us Section */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="font-bold text-gray-900 mb-4">Contact Us</h2>
          <form className="space-y-4">
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
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition">
                Send Message
              </button>
            </div>
          </form>
          <div className="mt-8 text-gray-500 text-sm">
            Support: support@portfolyo.com
          </div>
        </section>
      </div>
    );
  }