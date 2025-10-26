"use client";
import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full">
      <nav className="w-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-md mt-8">
        {/* left: logo */}
        <div className="flex items-center gap-3">
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
          <span className="text-white font-semibold text-lg tracking-tight">ParseAI</span>
        </div>

        {/* middle / right: nav links */}
        <ul className="hidden md:flex items-center gap-8 text-sm">
          <li><a href="#" className="text-white/90 hover:text-white transition">Home</a></li>
          <li><a href="#" className="text-white/80 hover:text-white transition">How it Works</a></li>
          <li><a href="#" className="text-white/80 hover:text-white transition">Login</a></li>
          <li>
            <a href="#" className="inline-block px-4 py-2 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-sm hover:opacity-95 transition">Sign Up</a>
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

      {/* mobile dropdown panel */}
      {open && (
        <div className="md:hidden mt-3 max-w-5xl mx-auto px-6">
          <div className="rounded-2xl bg-white/4 border border-white/8 backdrop-blur-md p-4 space-y-2 text-center">
            <a href="#" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-white/5 transition">Home</a>
            <a href="#" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-white/5 transition">How it Works</a>
            <a href="#" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-white/5 transition">Login</a>
            <a href="#" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white text-center font-medium">Sign Up</a>
          </div>
        </div>
      )}
    </header>
  );
}
