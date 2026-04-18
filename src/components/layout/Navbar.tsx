"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create" },
  { href: "/map", label: "Atlas" },
  { href: "/archive", label: "Archive" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-void/90 backdrop-blur-md border-b border-chalk/5"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-condensed text-xl font-bold tracking-[0.15em] text-chalk group-hover:text-neon transition-colors uppercase">
            LONDON
          </span>
          <span className="font-mono text-xs text-neon border border-neon/40 px-1.5 py-0.5 tracking-widest">
            CUTS
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono text-xs uppercase tracking-widest transition-colors duration-200",
                pathname === link.href
                  ? "text-neon"
                  : "text-bone hover:text-chalk"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/create"
            className="font-mono text-xs uppercase tracking-widest border border-magenta text-magenta px-4 py-1.5 hover:bg-magenta hover:text-void transition-all duration-200"
          >
            New Cut
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={cn("block w-6 h-px bg-chalk transition-all", open && "rotate-45 translate-y-2")} />
          <span className={cn("block w-4 h-px bg-chalk transition-all", open && "opacity-0")} />
          <span className={cn("block w-6 h-px bg-chalk transition-all", open && "-rotate-45 -translate-y-2")} />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ash border-b border-chalk/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "font-mono text-sm uppercase tracking-widest",
                    pathname === link.href ? "text-neon" : "text-bone"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
