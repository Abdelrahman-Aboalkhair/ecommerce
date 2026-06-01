import React from "react";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/sign-in", label: "Sign in" },
] as const;

const REPO_URL =
  "https://github.com/Abdelrahman-Aboalkhair/Full-Stack-E-Commerce-Platform";
const DEVELOPER_URL = "https://www.abdalrahman-aboalkhair.work/";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
            >
              Ecommerce
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-relaxed">
              Open-source demo store. Run locally — no hosted demo is maintained.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Source code
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm">
          <p>© {currentYear} Ecommerce. Open source under MIT.</p>
          <p>
            Developed by{" "}
            <a
              href={DEVELOPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-900 hover:text-indigo-600"
            >
              Abdelrahman Aboalkhair
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
