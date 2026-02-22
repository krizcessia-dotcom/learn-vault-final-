"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ShoppingCart, Users, Ruler, Coins, User, ChevronDown } from "lucide-react";

interface HeaderProps {
  /** Show LV points balance (for authenticated layout) */
  lvPoints?: number;
  /** Show user menu instead of SIGN UP */
  showUser?: boolean;
  /** When set (e.g. "/dashboard"), logo links here instead of "/" (overrides session-based default) */
  homeHref?: string;
}

export function Header({ lvPoints = 100, showUser = false, homeHref }: HeaderProps) {
  const { status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLoggedIn = status === "authenticated" || showUser;
  const logoHref = homeHref ?? (isLoggedIn ? "/dashboard" : "/");

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href={logoHref} className="flex flex-col items-start">
            <span className="text-black font-bold text-lg md:text-xl tracking-tight">
              Learn <span className="border-b-2 border-black">Vault</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/marketplace"
              className="flex items-center gap-2 text-gray-800 hover:text-black transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-lv-purple" />
              <span className="text-sm font-medium">Marketplace</span>
            </Link>
            <Link
              href="/tutors"
              className="flex items-center gap-2 text-gray-800 hover:text-black transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Tutors</span>
            </Link>
            <Link
              href="/study-tools"
              className="flex items-center gap-2 text-gray-800 hover:text-black transition-colors"
            >
              <Ruler className="w-4 h-4" />
              <span className="text-sm font-medium">Study tools</span>
            </Link>
            {showUser && (
              <>
                <Link
                  href="/wallet"
                  className="flex items-center gap-2 text-gray-800 hover:text-black transition-colors"
                >
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium">{lvPoints} LV</span>
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="flex items-center gap-2 text-gray-800 hover:text-black transition-colors rounded-lg py-2 px-2 -m-2 hover:bg-gray-100"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">USER</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg py-1 z-50"
                      role="menu"
                    >
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 rounded-t-lg"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 rounded-b-lg"
                        role="menuitem"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            {!showUser && (
              <Link
                href="/signup"
                className="px-4 py-2 bg-gray-300 rounded text-black text-sm font-medium hover:bg-gray-400 transition-colors"
              >
                SIGN UP
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
