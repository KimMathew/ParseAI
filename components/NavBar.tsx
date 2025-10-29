"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/route";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    // fixed container keeps nav visible while scrolling and centered
    <div className="fixed inset-x-0 top-6 z-40 pointer-events-auto px-6">
      <nav className="mx-auto w-full max-w-5xl px-6 py-3 flex items-center justify-between rounded-full bg-white/6 border border-white/8 backdrop-blur-md shadow-sm">
        {/* left: logo */}
        <div className="flex items-center gap-3">
          <a 
            href="#hero" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/8 backdrop-blur-sm">
              {/* simple spark/logo SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 2v4" stroke="white" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18v4" stroke="white" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.93 4.93l2.83 2.83" stroke="white" strokeOpacity="0.85" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.24 16.24l2.83 2.83" stroke="white" strokeOpacity="0.85" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3.2" stroke="white" strokeOpacity="0.95" strokeWidth="1.2" fill="rgba(255,255,255,0.03)" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">PARSeAI</span>
          </a>
        </div>

        {/* middle / right: nav links */}
        <ul className="hidden md:flex items-center gap-8 text-sm">
          <li>
            <a 
              href="#hero" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('hero');
              }}
              className="text-white/90 hover:text-white transition cursor-pointer"
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#how-it-works" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how-it-works');
              }}
              className="text-white/80 hover:text-white transition cursor-pointer"
            >
              How it Works
            </a>
          </li>
          <li><button onClick={() => router.push(ROUTES.SIGNIN)} className="text-white/80 hover:text-white transition cursor-pointer">Sign in</button></li>
          <li>
            <a href="#" className="inline-block px-4 py-2 rounded-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white font-medium shadow-sm hover:opacity-95 transition">Sign Up</a>
          </li>
        </ul>

        {/* mobile menu button */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-white/90 hover:bg-white/5"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            {open ? (
              <>
                <path d="M6 6l12 12" stroke="white" strokeOpacity="0.9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 6L6 18" stroke="white" strokeOpacity="0.9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </>
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeOpacity="0.9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            )}
          </svg>
        </button>
      </nav>

      {/* mobile dropdown panel (positioned below the fixed nav) */}
      {open && (
        <div className="md:hidden mt-8 mx-auto max-w-5xl px-6">
          <div className="rounded-2xl bg-white/4 border border-white/8 backdrop-blur-md p-4 space-y-2 text-center">
            <a 
              href="#hero" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('hero');
                setOpen(false);
              }} 
              className="block px-3 py-2 rounded hover:bg-white/5 transition cursor-pointer"
            >
              Home
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how-it-works');
                setOpen(false);
              }} 
              className="block px-3 py-2 rounded hover:bg-white/5 transition cursor-pointer"
            >
              How it Works
            </a>
            <button onClick={() => { router.push(ROUTES.SIGNIN); setOpen(false); }} className="block w-full px-3 py-2 rounded hover:bg-white/5 transition cursor-pointer text-left">Sign in</button>
            <a href="#" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white text-center font-medium">Sign Up</a>
          </div>
        </div>
      )}
    </div>
  );
}
