"use client";

import React from "react";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const linkSections = [
    {
      title: "Shop",
      links: ["New Arrivals", "Best Sellers"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact"],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white py-6 px-4 overflow-x-hidden">
      <div className="max-w-5xl mx-auto grid grid-cols-1 gap-6">
        {/* Logo & Contact */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold">NexsyMart</h2>
          <p className="text-xs text-gray-400">
            Handcrafted products. Premium experience.
          </p>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex items-center">
              <Phone className="text-indigo-400 mr-2 flex-shrink-0" size={14} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <Mail className="text-indigo-400 mr-2 flex-shrink-0" size={14} />
              <span>support@nexsymart.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          {linkSections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="font-semibold text-sm">{section.title}</h3>
              <ul className="space-y-1 text-xs text-gray-400">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-6 pt-4 border-t border-gray-700 text-xs text-gray-400 flex flex-col items-center space-y-3">
        <p>© {currentYear} NexsyMart. All rights reserved.</p>
        <div className="flex space-x-4">
          {["Terms", "Privacy"].map((item, idx) => (
            <Link
              key={idx}
              href="#"
              className="hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
