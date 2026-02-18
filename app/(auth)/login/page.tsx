"use client";

import { useState } from "react";
import Link from "next/link";
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
    console.log("1. Starting login for:", email);

    try {
      // Sign in with Supabase Auth
      console.log("2. Calling supabase.auth.signInWithPassword...");
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("3. Auth response:", { 
        userId: authData?.user?.id, 
        error: authError?.message 
      });

      if (authError) {
        console.log("4. Auth error:", authError.message);
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
        console.log("4. No user in auth response");
        setError("Authentication failed. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log("4. Auth successful, user ID:", authData.user.id);

      // Try to fetch user from database, but don't block on failure
      console.log("5. Fetching user from database...");
      let userData: any = null;
      
      try {
        const userResponse = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();
        
        if (!userResponse.error && userResponse.data) {
          userData = userResponse.data;
        }
        console.log("6. User fetch result:", { found: !!userData, role: userData?.role });
      } catch (fetchError) {
        console.log("6. User fetch failed, will use email to determine role");
      }

      // If user doesn't exist, try to create them
      if (!userData) {
        console.log("7. User not found, creating profile...");
        const role = email.toLowerCase().includes("professor") ? "professor" : "student";
        
        try {
          const createResponse = await supabase
            .from("users")
            .upsert({
              id: authData.user.id,
              email: authData.user.email,
              full_name: role === "professor" ? "Dr. Ahmed Khan" : "John Smith",
              role: role,
              status: "approved",
            })
            .select()
            .single();

          if (!createResponse.error && createResponse.data) {
            userData = createResponse.data;
          }
        } catch (upsertError) {
          console.log("8. Upsert failed, using default role from email");
        }
      }

      // Determine role - fallback to email-based detection
      const userRole = userData?.role || (email.toLowerCase().includes("professor") ? "professor" : "student");
      const userName = userData?.full_name || (userRole === "professor" ? "Professor" : "Student");

      // Determine redirect path based on role
      const redirectPath =
        userRole === "professor" ? "/professor" :
        userRole === "student" ? "/student" :
        userRole === "college_admin" ? "/admin" :
        userRole === "super_admin" ? "/super-admin" :
        "/student";

      console.log("9. Login complete! Role:", userRole, "Path:", redirectPath);

      // Set success state with redirect info
      setLoginSuccess({
        name: userName,
        path: redirectPath,
      });
      
      setIsLoading(false);
      console.log("10. Success state set, showing welcome screen");

    } catch (err: any) {
      console.error("CATCH ERROR:", err);
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

  // Show success screen with link after successful login
  if (loginSuccess) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back!</h1>
        <p className="text-gray-400 mb-8">{loginSuccess.name}</p>
        
        <Link
          href={loginSuccess.path}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
          <ArrowRight className="h-5 w-5" />
        </Link>

        <p className="text-gray-500 text-sm mt-6">
          Click the button above to continue
        </p>
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

      {/* Test Credentials - Clickable */}
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