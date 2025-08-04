"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "../molecules/UserMenu";
import { ShoppingCart, Menu, X, CircleUserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import SearchBar from "../molecules/SearchBar";
import { useGetCartCountQuery } from "@/app/store/apis/CartApi";
import Topbar from "./Topbar";
import useClickOutside from "@/app/hooks/dom/useClickOutside";
import useEventListener from "@/app/hooks/dom/useEventListener";
import { useAppSelector } from "@/app/store/hooks";

const Navbar = () => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const { data: cartData } = useGetCartCountQuery(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEventListener("scroll", () => {
    setScrolled(window.scrollY > 20);
  });

  useClickOutside(menuRef, () => setMenuOpen(false));

  return (
    <>
      <Topbar />
      <header
        className={`w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md py-2"
            : "bg-white bg-opacity-95 backdrop-blur-sm py-4"
        }`}
      >
        <nav className="max-w-[80%] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-semibold text-xl whitespace-nowrap text-gray-900"
          >
            SS-Ecommerce
          </Link>

          {/* Right section - Search, Cart, User */}
          <div className="flex items-center w-full justify-end">
            <SearchBar />

            {cartData && (
              <Link
                href="/cart"
                className="relative text-gray-700 transition-colors mx-9"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={25} />
                {cartData?.cartCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-medium 
                  rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartData?.cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center focus:outline-none"
                  aria-label="User menu"
                >
                  {/* <div className="rounded-full overflow-hidden flex items-center justify-center bg-gray-200/70 p-3"> */}
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="User Profile"
                      width={30}
                      height={30}
                      className="rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <CircleUserRound size={25} className="text-gray-800" />
                  )}
                  {/* </div> */}
                </button>

                {menuOpen && (
                  <UserMenu
                    user={user}
                    menuOpen={menuOpen}
                    closeMenu={() => setMenuOpen(false)}
                  />
                )}
              </div>
            ) : (
              pathname !== "/sign-up" &&
              pathname !== "/sign-in" && (
                <Link
                  href="/sign-in"
                  className="text-md font-medium text-gray-800 whitespace-nowrap pl-4"
                >
                  Sign in
                </Link>
              )
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-indigo-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
