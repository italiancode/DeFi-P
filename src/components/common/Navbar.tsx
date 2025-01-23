"use client";

import { useState } from "react";
import Link from "next/link";
import { ConnectButton } from "../wallet/ConnectButton";
import ClientOnly from "../ClientOnly";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import Image from "next/image";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b border-defi-dark-light/50 backdrop-blur-md bg-defi-dark/80 dark:bg-black/80 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/defip-logo.png"
                alt="DeFiP Logo"
                className="h-8 w-8"
                width={32}
                height={32}
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-defi-primary to-defi-secondary bg-clip-text text-transparent">
                DeFiP
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/portfolio">Portfolio</NavLink>
            <NavLink href="/exchange">Exchange</NavLink>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-defi-dark-light"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <ClientOnly>
              <ConnectButton />
            </ClientOnly>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              <span className="sr-only">Open menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink href="/portfolio">Portfolio</MobileNavLink>
              <MobileNavLink href="/exchange">Exchange</MobileNavLink>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full text-left py-2 text-gray-300 hover:text-white hover:bg-defi-dark-light transition-colors"
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              <div className="py-2">
                <ClientOnly>
                  <ConnectButton />
                </ClientOnly>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="text-gray-300 hover:text-white hover:bg-defi-dark-light px-3 py-2 rounded-lg transition-colors"
  >
    {children}
  </Link>
);

const MobileNavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="block py-2 text-gray-300 hover:text-white hover:bg-defi-dark-light transition-colors"
  >
    {children}
  </Link>
);
