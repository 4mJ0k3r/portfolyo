import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-8 pb-12 flex flex-col items-center">
        <div
          className="w-full h-[500px] md:h-[600px] rounded-xl flex items-center justify-center relative overflow-hidden mb-1"
          style={{
            backgroundImage: "url('/images/hs1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 flex flex-col items-center text-center w-full px-2">
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
              Your Code Tells Your Story
            </h1>
            <p className="text-white text-sm md:text-base mb-6 drop-shadow px-4">
              Transform your static resume into a dynamic, interactive developer profile. Showcase your skills, projects, and contributions in a way that truly represents your expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition">
                Create Profile
              </button>
              <button className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-6 py-2 rounded-md transition">
                Browse Talent
              </button>
            </div>
          </div>
          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </section>

      {/* Showcase Your Skills */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Showcase Your Skills</h2>
        <p className="text-gray-600 mb-8">
          Highlight your technical abilities and expertise with interactive features.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
            <div className="mb-4">
              {/* Radar Chart SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Interactive Radar Charts</h3>
            <p className="text-gray-500 text-sm">
              Visualize your skill proficiency with dynamic radar charts that adapt to your project portfolio.
            </p>
          </div>
          {/* Feature Card 2 */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
            <div className="mb-4">
              {/* Platform Integrations SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Platform Integrations</h3>
            <p className="text-gray-500 text-sm">
              Seamlessly integrate with platforms like GitHub, GitLab, and Stack Overflow to showcase your contributions.
            </p>
          </div>
          {/* Feature Card 3 */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
            <div className="mb-4">
              {/* Verification Badge SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Verification Badges</h3>
            <p className="text-gray-500 text-sm">
              Build trust and credibility with verified skills and experience badges.
            </p>
          </div>
        </div>
      </section>

      {/* Top Developers */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Top Developers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {/* Developer Card 1 */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-4">
            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&w=120&h=120&fit=crop" alt="Alex R." className="w-20 h-20 rounded-full mb-2 object-cover" />
            <div className="font-semibold">Alex R.</div>
            <div className="text-xs text-gray-500">Senior Software Engineer</div>
          </div>
          {/* Developer Card 2 */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-4">
            <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&w=120&h=120&fit=crop" alt="Sophia L." className="w-20 h-20 rounded-full mb-2 object-cover" />
            <div className="font-semibold">Sophia L.</div>
            <div className="text-xs text-gray-500">Full-Stack Developer</div>
          </div>
          {/* Developer Card 3 */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-4">
            <img src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&w=120&h=120&fit=crop" alt="Ethan M." className="w-20 h-20 rounded-full mb-2 object-cover" />
            <div className="font-semibold">Ethan M.</div>
            <div className="text-xs text-gray-500">Mobile App Developer</div>
          </div>
          {/* Developer Card 4 */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-4">
            <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&w=120&h=120&fit=crop" alt="Olivia K." className="w-20 h-20 rounded-full mb-2 object-cover" />
            <div className="font-semibold">Olivia K.</div>
            <div className="text-xs text-gray-500">Data Scientist</div>
          </div>
          {/* Developer Card 5 */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-4">
            <img
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80"
              alt="Liam B."
              className="w-20 h-20 rounded-full mb-2 object-cover"
            />
            <div className="font-semibold">Liam B.</div>
            <div className="text-xs text-gray-500">Frontend Developer</div>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-2 rounded-md transition">
            View Full Rankings
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
        <h3 className="text-xl font-bold mb-2">Get Started in 3 Easy Steps</h3>
        <p className="text-gray-600 mb-8">Create your interactive developer profile and showcase your skills and experience.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-lg shadow p-2.5 flex flex-col items-center">
            <img src="/images/hiw3.png" alt="Upload Your Resume" className="w-full rounded-lg mb-4 object-cover" />
            <div className="font-semibold mb-1">Upload Your Resume</div>
            <p className="text-gray-500 text-sm text-center">Easily import your existing resume to create a foundation for your interactive profile.</p>
          </div>
          {/* Step 2 */}
          <div className="bg-white rounded-lg shadow p-2.5 flex flex-col items-center">
            <img src="images/hiw2.png" alt="Customize Your Profile" className="w-full rounded-lg mb-4 object-cover" />
            <div className="font-semibold mb-1">Customize Your Profile</div>
            <p className="text-gray-500 text-sm text-center">Personalize your profile with projects, skills, and contributions to highlight your expertise.</p>
          </div>
          {/* Step 3 */}
          <div className="bg-white rounded-lg shadow p-2.5 flex flex-col items-center">
            <img src="images/hiw1.png" alt="Share Your Profile" className="w-full rounded-lg mb-4 object-cover" />
            <div className="font-semibold mb-1">Share Your Profile</div>
            <p className="text-gray-500 text-sm text-center">Share your unique profile link with potential employers and collaborators.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center">
            <div className="text-2xl font-bold mb-1">10,000+</div>
            <div className="text-gray-500 text-sm">Active Developers</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center">
            <div className="text-2xl font-bold mb-1">500+</div>
            <div className="text-gray-500 text-sm">Companies Hiring</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center">
            <div className="text-2xl font-bold mb-1">2,000+</div>
            <div className="text-gray-500 text-sm">Successful Placements</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Showcase Your Skills?</h2>
        <p className="text-gray-600 mb-6">Join PortFolyo today and take your developer career to the next level.</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition">
          Create Your Profile
        </button>
      </section>
    </div>
  );
}
