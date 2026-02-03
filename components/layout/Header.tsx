"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "Services",
    href: "/services",
    children: [
      { name: "Headshot Activation", href: "/services/headshot-activation" },
      { name: "Corporate Event Coverage", href: "/services/corporate-event-coverage" },
      { name: "Corporate Headshot Program", href: "/services/corporate-headshot-program" },
      { name: "Event Video Systems", href: "/services/event-video-systems" },
    ],
  },
  { name: "Venues", href: "/venues" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "FAQs", href: "/faqs" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((name: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(name);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150); // 150ms delay before closing
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-jhr-black/90 backdrop-blur-md border-b border-jhr-black-lighter">
      <nav className="section-container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/jhr-logo-white.png"
              alt="JHR Photography"
              width={120}
              height={40}
              className="h-8 lg:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 text-body-sm text-jhr-white-muted hover:text-jhr-white transition-colors duration-200"
                >
                  {item.name}
                  {item.children && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && openDropdown === item.name && (
                  <>
                    {/* Invisible bridge to prevent gap closing */}
                    <div className="absolute top-full left-0 w-full h-2" />
                    <div className="absolute top-full left-0 w-64 py-2 mt-2 bg-jhr-black-light border border-jhr-black-lighter rounded-lg shadow-xl animate-fade-in">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-3 text-body-sm text-jhr-white-muted hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors duration-200"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link href="/schedule" className="btn-primary">
              Schedule a Strategy Call
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2.5 -mr-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-jhr-white-muted hover:text-jhr-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-jhr-black-lighter animate-fade-in-down">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        className="flex items-center justify-between w-full px-4 py-3 text-body-md text-jhr-white-muted hover:text-jhr-white hover:bg-jhr-black-lighter rounded-lg transition-colors duration-200"
                        onClick={() =>
                          setMobileDropdownOpen(
                            mobileDropdownOpen === item.name ? null : item.name
                          )
                        }
                      >
                        {item.name}
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-200 ${
                            mobileDropdownOpen === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileDropdownOpen === item.name && (
                        <div className="pl-4 py-2 space-y-1 bg-jhr-black-lighter/50 rounded-lg mx-2 mb-2">
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-body-sm text-jhr-gold hover:text-jhr-gold-light transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            All {item.name}
                          </Link>
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-4 py-2 text-body-sm text-jhr-white-dim hover:text-jhr-white transition-colors duration-200"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-4 py-3 text-body-md text-jhr-white-muted hover:text-jhr-white hover:bg-jhr-black-lighter rounded-lg transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 px-4">
              <Link
                href="/schedule"
                className="btn-primary w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Schedule a Strategy Call
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
