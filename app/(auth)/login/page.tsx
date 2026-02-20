"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState<{ name: string; path: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoginSuccess(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Please verify your email before logging in");
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Authentication failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Step 2: Determine role from email (fast, no DB call)
      const emailLower = email.toLowerCase();
      let userRole = "student";
      let userName = "Student";

      if (emailLower.includes("professor") || emailLower.includes("prof")) {
        userRole = "professor";
        userName = "Professor";
      } else if (emailLower.includes("admin")) {
        userRole = "admin";
        userName = "Admin";
      }

      // Step 3: Try to get actual user data (with 3 second timeout)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const { data: userData } = await supabase
          .from("users")
          .select("role, full_name")
          .eq("id", authData.user.id)
          .single()
          .abortSignal(controller.signal);

        clearTimeout(timeoutId);

        if (userData) {
          userRole = userData.role || userRole;
          userName = userData.full_name || userName;
        }
      } catch {
        // Timeout or error - continue with email-based role
        console.log("DB fetch skipped, using email-based role");
      }

      // Step 4: Determine redirect path
      const redirectPath =
        userRole === "professor" ? "/professor" :
        userRole === "college_admin" ? "/admin" :
        userRole === "super_admin" ? "/super-admin" :
        "/student";

      // Step 5: Show success and redirect
      setLoginSuccess({ name: userName, path: redirectPath });
      setIsLoading(false);

      // Auto-redirect after 1 second
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);

    } catch (err: any) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setLoginSuccess(null);
    setError("");
  };

  // Success Screen
  if (loginSuccess) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back!</h1>
        <p className="text-gray-400 mb-4">{loginSuccess.name}</p>
        <p className="text-emerald-400 text-sm mb-8">Redirecting to dashboard...</p>
        
        <Link
          href={loginSuccess.path}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-gray-400">Sign in to your ClinAid account</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@institution.edu"
              disabled={isLoading}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              className="w-full pl-12 pr-12 py-3.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-950 text-gray-500">Quick Login</span>
        </div>
      </div>

      {/* Test Credentials */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => quickLogin("professor@clinaid.test", "Professor123!")}
          disabled={isLoading}
          className="w-full p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-left hover:bg-blue-500/20 transition-colors disabled:opacity-50"
        >
          <p className="text-blue-400 font-medium text-sm mb-1">👨‍⚕️ Professor</p>
          <p className="text-gray-400 text-xs">professor@clinaid.test</p>
        </button>
        <button
          type="button"
          onClick={() => quickLogin("student@clinaid.test", "Student123!")}
          disabled={isLoading}
          className="w-full p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-left hover:bg-green-500/20 transition-colors disabled:opacity-50"
        >
          <p className="text-green-400 font-medium text-sm mb-1">👨‍🎓 Student</p>
          <p className="text-gray-400 text-xs">student@clinaid.test</p>
        </button>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-gray-400 mt-8">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}