"use client";

import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/landing" className="flex items-center gap-3">
            <img src="/logo.png" alt="ClinAid" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-white">ClinAid</h1>
              <p className="text-emerald-400 text-sm">Learn | Collaborate | Excel</p>
            </div>
          </Link>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Transform Medical Education at Your Institution</h2>
            <p className="text-gray-400 text-lg mb-8">Join 50+ medical institutions already using ClinAid to deliver better outcomes.</p>
            <div className="space-y-4">
              {["AI-Powered Tutoring", "Advanced Analytics", "Custom Branding"].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-gray-500 text-sm">© 2024 ClinAid. All rights reserved.</div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src="/logo.png" alt="ClinAid" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-white">ClinAid</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
