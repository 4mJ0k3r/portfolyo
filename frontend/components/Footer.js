// frontend/components/Footer.js
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXTwitter, faLinkedin, faSquareGithub } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-8 border-t border-gray-100">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-4 px-4">
        {/* Top Links */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 text-[#1F2C3D] font-medium text-base w-full text-center">
          <Link href="/about" className="hover:underline">About Us</Link>
          <Link href="/contactus" className="hover:underline">Contact</Link>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div>
        {/* Social Icons */}
        <div className="flex justify-center space-x-6 text-[#1F2C3D] text-2xl w-full">
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter X">
            <FontAwesomeIcon icon={faSquareXTwitter} />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FontAwesomeIcon icon={faSquareGithub} />
          </a>
        </div>
        {/* Copyright */}
        <div className="text-[#1F2C3D] font-medium text-sm mt-2 text-center w-full">
          &copy; {new Date().getFullYear()} PortFolyo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
