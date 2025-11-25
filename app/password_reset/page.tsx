"use client";

import { useState } from "react";
import Link from "next/link";
import InputField from "@/components/InputField";
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (resetError) {
        setError(resetError.message);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
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
          <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
          <p className="text-white/60 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Reset Form */}
        {!success ? (
          <form onSubmit={handlePasswordReset} className="space-y-4 mb-6">
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

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white cursor-pointer font-semibold transition-all duration-200 ease-out transform hover:scale-105 hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[#6366F140] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-4"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
            <p className="text-green-400 text-sm text-center">
              Password reset link sent! Check your email for instructions.
            </p>
          </div>
        )}

        {/* Back to Sign In Link */}
        <p className="text-center text-white/60 text-sm mt-6">
          Remember your password?{" "}
          <Link
            href="/signin"
            className="text-[#6366F1] hover:text-[#6366F1]/80 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
