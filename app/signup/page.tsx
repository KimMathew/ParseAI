"use client";


import { useState } from "react";
import Link from "next/link";
import InputField from "@/components/InputField";
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
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
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
    <main className="min-h-screen overflow-y-auto bg-[#0B0C10] text-white flex items-center justify-center px-6 py-8">
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
          <h1 className="text-2xl font-bold mb-2">Create PARSeAI Account</h1>
          <p className="text-white/60 text-sm">Join us and unlock intelligent research insights.</p>
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
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white cursor-pointer font-semibold transition-all duration-200 ease-out transform hover:scale-105 hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[#6366F140] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-4"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-white/60 text-sm mt-6">
          Already have an account?{" "}
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