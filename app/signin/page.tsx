"use client";


import { useState } from "react";
import Link from "next/link";
import InputField from "@/components/InputField";
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // TODO: Implement Google OAuth
    console.log("Sign in with Google");
    setIsLoading(false);
  };

  return (
    <main className="h-screen overflow-hidden bg-[#0B0C10] text-white flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/images/parseai-logo.png" 
            alt="PARSeAI Logo" 
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Sign in to PARSeAI</h1>
          <p className="text-white/60 text-sm">Welcome back. Enter your credentials to continue.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="space-y-4 mb-6">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
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
            helperLink={{ text: "Forgot password?", href: "#" }}
          />

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white cursor-pointer font-semibold transition-all duration-200 ease-out transform hover:scale-105 hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[#6366F140] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-4"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#0B0C10] text-white/50">or</span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 rounded-full cursor-pointer bg-white/5 border border-white/15 text-white font-medium transition-all duration-200 ease-out hover:bg-white/10 hover:border-white/25 focus:outline-none focus:ring-4 focus:ring-white/5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-white/60 text-sm mt-6">
          New to PARSeAI?{" "}
          <Link
            href="/signup"
            className="text-[#6366F1] hover:text-[#6366F1]/80 font-medium transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}