import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPixiv } from '@fortawesome/free-brands-svg-icons';
import { config as faConfig } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
faConfig.autoAddCss = false;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 w-full">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Left: Logo and Nav Links */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-lg text-gray-900">
            <FontAwesomeIcon icon={faPixiv} className="text-2xl text-navyblue-600" />
            <span>PortFolyo</span>
          </Link>
          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-800 hover:text-black font-medium">Home</Link>
            <Link href="/browse" className="text-gray-800 hover:text-black font-medium">Browse</Link>
            <Link href="/pricing" className="text-gray-800 hover:text-black font-medium">Pricing</Link>
            <Link href="/contactus" className="text-gray-800 hover:text-black font-medium">Contact</Link>
          </div>
        </div>
        {/* Right: Search and Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white text-gray-800 placeholder-gray-400 w-36 lg:w-56"
            />
          </div>
          {/* Create Profile Button */}
          <Link href="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition">Create Profile</Link>
          {/* Log In Button */}
          <Link href="/login" className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-4 py-2 rounded-md border border-gray-300 transition">Log In</Link>
        </div>
        {/* Hamburger Menu (Mobile/Tablet) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 hover:text-black focus:outline-none"
            aria-label="Open menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 pt-4 pb-2 space-y-2 flex flex-col">
            <Link href="/" className="text-gray-800 hover:text-black font-medium py-2">Home</Link>
            <Link href="/browse" className="text-gray-800 hover:text-black font-medium py-2">Browse</Link>
            <Link href="/pricing" className="text-gray-800 hover:text-black font-medium py-2">Pricing</Link>
            <Link href="/contact" className="text-gray-800 hover:text-black font-medium py-2">Contact</Link>
            <div className="flex flex-col space-y-2 mt-2">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white text-gray-800 placeholder-gray-400 w-full"
                style={{ backgroundPosition: '10px center' }}
              />
              <Link href="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition text-center">Create Profile</Link>
              <Link href="/login" className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-4 py-2 rounded-md border border-gray-300 transition text-center">Log In</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
