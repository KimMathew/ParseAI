"use client";


import { useState } from "react";
import Link from "next/link";
import InputField from "@/components/InputField";
import MeshGradient from "@/components/MeshGradient";
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import { createUser } from "@/lib/supabaseApi";
import { v4 as uuidv4 } from 'uuid';

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    // if (password !== confirmPassword) {
    //   setError("Passwords do not match.");
    //   return;
    // }
    setIsLoading(true);
    try {
      // Supabase Auth sign up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }
      // Only proceed if user id is available
      const userId = data.user?.id;
      if (!userId) {
        setError("Failed to get user id from Supabase Auth.");
        setIsLoading(false);
        return;
      }
      // Set SSR session cookies if session exists
      if (data.session) {
        await fetch('/api/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          }),
        });
      }
      const { error: userError } = await createUser({ id: userId, name, email });
      if (userError) {
        setError(userError.message || "Failed to create user profile.");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      // Redirect to signin with message
      window.location.href = "/signin?signup=success";
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[#0B0C10] text-white flex">
      {/* Left Column - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <img 
              src="/images/parseai-logo.png" 
              alt="PARSeAI Logo" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-white font-semibold text-2xl tracking-tight">PARSeAI</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-white/60 text-base">Join us and unlock intelligent research insights.</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignUp} className="space-y-5 mb-6">
            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            
            {/* Name Input */}
            <InputField
              id="name"
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />

            {/* Email Input */}
            <InputField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            
            {/* Password Input */}
            <InputField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {/* Confirm Password Input */}
            {/* <InputField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            /> */}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white cursor-pointer font-semibold transition-all duration-200 ease-out transform hover:scale-105 hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[#6366F140] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-white/60 text-sm">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#6366F1] hover:text-[#8B5CF6] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column - Brand Section */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden p-6">
        <MeshGradient />

        {/* Floating Glassy Feature Cards - Grid Layout */}
        <div className="absolute inset-0 z-[5] pointer-events-none flex items-center justify-center px-12">
          <div className="relative w-full h-full max-w-3xl mx-auto">
            {/* Top Row Cards */}
            <div className="absolute top-[20%] left-[10%] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl animate-float-1 w-56">
              <div className="flex flex-col gap-3">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white border border-white/30 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.85) 0%, rgba(139,92,246,0.85) 100%)' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <div>
                  <div className="text-white font-semibold text-base mb-1">Lightning Fast</div>
                  <div className="text-white/60 text-sm">Process documents in seconds</div>
                </div>
              </div>
            </div>

            <div className="absolute top-[18%] right-[8%] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl animate-float-2 w-60">
              <div className="flex flex-col gap-3">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white border border-white/30 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.85) 0%, rgba(16,185,129,0.85) 100%)' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <div>
                  <div className="text-white font-semibold text-base mb-1">Secure & Private</div>
                  <div className="text-white/60 text-sm">Your data stays protected</div>
                </div>
              </div>
            </div>

            {/* Middle Row Cards */}
            <div className="absolute top-[50%] left-[5%] -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl animate-float-3 w-64">
              <div className="flex flex-col gap-3">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white border border-white/30 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.85) 0%, rgba(109,40,217,0.85) 100%)' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                <div>
                  <div className="text-white font-semibold text-base mb-1">Smart Insights</div>
                  <div className="text-white/60 text-sm">AI extracts key findings instantly</div>
                </div>
              </div>
            </div>

            <div className="absolute top-[48%] right-[12%] -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl animate-float-4 w-56">
              <div className="flex flex-col gap-3">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white border border-white/30 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.85) 0%, rgba(219,39,119,0.85) 100%)' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </span>
                <div>
                  <div className="text-white font-semibold text-base mb-1">Interactive Chat</div>
                  <div className="text-white/60 text-sm">Ask questions about papers</div>
                </div>
              </div>
            </div>

            
          </div>
        </div>

        {/* Content - Bottom Center */}
        <div className="relative z-10 flex flex-col justify-end w-full px-16 pb-16 ">
          <h2 className="text-5xl font-bold leading-tight tracking-tight mb-4">
            Join the research<br />revolution
          </h2>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
            Transform how you interact with academic papers. Get started in seconds and unlock intelligent research insights.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignUp} className="space-y-4 mb-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* Name Input */}
          <InputField
            id="name"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </form>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes float-1 {
            0%, 100% {
              transform: translateY(0px) translateX(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-15px) translateX(8px) rotate(1deg);
            }
          }
        

          @keyframes float-2 {
            0%, 100% {
              transform: translateY(0px) translateX(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) translateX(-10px) rotate(-1deg);
            }
          }

          @keyframes float-3 {
            0%, 100% {
              transform: translateY(-50%) translateX(0px) rotate(0deg);
            }
            50% {
              transform: translateY(calc(-50% - 18px)) translateX(12px) rotate(2deg);
            }
          }

          @keyframes float-4 {
            0%, 100% {
              transform: translateY(-50%) translateX(0px) rotate(0deg);
            }
            50% {
              transform: translateY(calc(-50% - 22px)) translateX(-8px) rotate(-1.5deg);
            }
          }

          @keyframes float-5 {
            0%, 100% {
              transform: translateX(-50%) translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateX(-50%) translateY(-25px) rotate(1.5deg);
            }
          }

          .animate-float-1 {
            animation: float-1 5s ease-in-out infinite;
          }

          .animate-float-2 {
            animation: float-2 6s ease-in-out infinite;
            animation-delay: -1s;
          }

          .animate-float-3 {
            animation: float-3 5.5s ease-in-out infinite;
            animation-delay: -2s;
          }

          .animate-float-4 {
            animation: float-4 6.5s ease-in-out infinite;
            animation-delay: -1.5s;
          }

          .animate-float-5 {
            animation: float-5 7s ease-in-out infinite;
            animation-delay: -0.5s;
          }
        `}</style>
      </div>
    </main>
  );
}