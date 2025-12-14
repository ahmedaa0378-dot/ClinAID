"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building,
  AlertCircle,
  Loader2,
} from "lucide-react";

const colleges = [
  { id: "harvard-medical", name: "Harvard Medical School", subdomain: "harvard-medical" },
  { id: "stanford-med", name: "Stanford Medicine", subdomain: "stanford-med" },
  { id: "jhu-medicine", name: "Johns Hopkins Medicine", subdomain: "jhu-medicine" },
  { id: "mayo-college", name: "Mayo Clinic College", subdomain: "mayo-college" },
  { id: "ucla-med", name: "UCLA Medical School", subdomain: "ucla-med" },
  { id: "duke-med", name: "Duke Medicine", subdomain: "duke-med" },
  { id: "nyu-med", name: "NYU Grossman", subdomain: "nyu-med" },
  { id: "ucsf-med", name: "UCSF Medical", subdomain: "ucsf-med" },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedCollege, setSelectedCollege] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedCollege) {
      setError("Please select your institution");
      return;
    }

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Demo: Route based on email pattern
      if (email.includes("admin")) {
        router.push("/admin");
      } else if (email.includes("professor") || email.includes("prof")) {
        router.push("/professor");
      } else if (email.includes("super")) {
        router.push("/super-admin");
      } else {
        router.push("/");
      }
    }, 1500);
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 mt-2">Sign in to continue your learning journey</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* College Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Institution
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer ${
                selectedCollege ? "text-gray-900 border-gray-300" : "text-gray-400 border-gray-200"
              }`}
            >
              <option value="" disabled>Select your institution</option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@institution.edu"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-gray-200" />
        <span className="px-4 text-sm text-gray-500">New to MedLearn?</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Register Link */}
      <Link
        href="/register"
        className="w-full py-3 border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
      >
        Create an Account
        <ArrowRight className="h-4 w-4" />
      </Link>

      {/* Demo Credentials */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</p>
        <div className="text-xs text-blue-700 space-y-1">
          <p>• <strong>student@test.edu</strong> → Student Dashboard</p>
          <p>• <strong>professor@test.edu</strong> → Professor Dashboard</p>
          <p>• <strong>admin@test.edu</strong> → College Admin Dashboard</p>
          <p>• <strong>super@test.edu</strong> → Super Admin Dashboard</p>
          <p className="mt-2 text-blue-600">Password: any (demo mode)</p>
        </div>
      </div>
    </div>
  );
}
