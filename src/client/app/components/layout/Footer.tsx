"use client";

import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-6 px-4 overflow-x-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-4">
        {/* Footer Bottom */}
        <p className="text-xs text-gray-500 mt-4">
          © {currentYear} Developed by Abdelrahman Aboalkhair. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
