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
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white cursor-pointer font-semibold transition-all duration-200 ease-out transform hover:scale-105 hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[#6366F140] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-4"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

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