"use client";

import { useState } from "react";
import Link from "next/link";
import InputField from "@/components/InputField";
import MeshGradient from "@/components/MeshGradient";
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }
      // Optionally redirect after sign in
      window.location.href = "/upload";
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[#0B0C10] text-white flex">
      {/* Left Column - Sign In Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
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
            <h1 className="text-3xl font-bold mb-2">Sign in</h1>
            <p className="text-white/60 text-base">Welcome back. Enter your credentials to continue.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="space-y-5 mb-6">
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
              helperLink={{ text: "Forgot password?", href: "/password_reset" }}
            />

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white cursor-pointer font-semibold transition-all duration-200 ease-out transform hover:scale-105 hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[#6366F140] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-white/60 text-sm">
            New to PARSeAI?{" "}
            <Link
              href="/signup"
              className="text-[#6366F1] hover:text-[#8B5CF6] font-medium transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column - Brand Section */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden p-6">
        <MeshGradient />

        {/* Floating Feature Cards - Centered */}
        <div className="absolute inset-0 z-[5] pointer-events-none flex items-center justify-center">
          <div className="relative w-full h-full max-w-2xl mx-auto">
            {/* Top Center Card - AI Powered */}
            <div className="absolute top-[25%] left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-2xl animate-float-slow">
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white border border-white/30"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.85) 0%, rgba(139,92,246,0.85) 100%)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <div>
                  <div className="text-white/90 font-semibold text-sm">AI-Powered</div>
                  <div className="text-white/60 text-xs">Advanced analysis</div>
                </div>
              </div>
            </div>

            {/* Middle Left Card - Automated Processing */}
            <div className="absolute top-[45%] left-[15%] -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-2xl animate-float-medium">
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white border border-white/30"
                  style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.85) 0%, rgba(16,185,129,0.85) 100%)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <div className="text-white/90 font-semibold text-sm">Automated</div>
                  <div className="text-white/60 text-xs">Effortless processing</div>
                </div>
              </div>
            </div>

            {/* Bottom Right Card - Smart Insights */}
            <div className="absolute top-[45%] right-[15%] -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-2xl animate-float-fast">
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white border border-white/30"
                  style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.85) 0%, rgba(109,40,217,0.85) 100%)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                <div>
                  <div className="text-white/90 font-semibold text-sm">Smart Insights</div>
                  <div className="text-white/60 text-xs">Extract key findings</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full px-16 py-12">
          {/* Top Section - Trust Badges */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-white/80 font-medium">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-white/80 font-medium">Free to Start</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-white/80 font-medium">AI-Powered</span>
            </div>
          </div>

          {/* Bottom Section - Main Message */}
          <div className="space-y-4">
            <h2 className="text-5xl font-bold leading-tight tracking-tight">
              From complexity to clarity
            </h2>
            
            <p className="text-lg text-white/80 leading-relaxed max-w-lg">
              Pick up right where you left off. Your AI assistant is ready to turn dense academic papers into actionable insights.
            </p>

            {/* Feature List */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#22D3EE]/30 to-[#6366F1]/30 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">Instant summaries and key findings extraction</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#22D3EE]/30 to-[#6366F1]/30 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">Interactive chat with your documents</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#22D3EE]/30 to-[#6366F1]/30 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">Secure cloud storage and history tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes float-slow {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            50% {
              transform: translateY(-20px) translateX(10px);
            }
          }

          @keyframes float-medium {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            50% {
              transform: translateY(-15px) translateX(-10px);
            }
          }

          @keyframes float-fast {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            50% {
              transform: translateY(-25px) translateX(15px);
            }
          }

          .animate-float-slow {
            animation: float-slow 6s ease-in-out infinite;
          }

          .animate-float-medium {
            animation: float-medium 5s ease-in-out infinite;
            animation-delay: -2s;
          }

          .animate-float-fast {
            animation: float-fast 4s ease-in-out infinite;
            animation-delay: -1s;
          }
        `}</style>
      </div>
    </main>
  );
}