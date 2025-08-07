"use client";

import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-6 px-4 overflow-x-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-4">
        {/* About Me */}
        <div className="text-center">
          <h2 className="text-lg font-semibold">About Me</h2>
          <p className="text-sm text-gray-400 mt-1 max-w-md">
            I&apos;m a passionate developer and engineer building scalable
            full-stack applications and exploring innovative problem-solving
            through code.
          </p>
        </div>

        {/* Contact */}
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Mail size={14} />
          <span>your.email@example.com</span>
        </div>

        {/* Social Links */}
        <div className="flex space-x-4 text-gray-400 text-sm">
          <Link
            href="https://github.com/your-username"
            target="_blank"
            className="hover:text-white"
          >
            GitHub
          </Link>
          <Link
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            className="hover:text-white"
          >
            LinkedIn
          </Link>
          <Link
            href="https://twitter.com/your-handle"
            target="_blank"
            className="hover:text-white"
          >
            Twitter
          </Link>
        </div>

        {/* Footer Bottom */}
        <p className="text-xs text-gray-500 mt-4">
          © {currentYear} Your Name. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
