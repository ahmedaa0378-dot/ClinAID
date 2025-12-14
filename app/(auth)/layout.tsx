"use client";

import { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";

// Simulated college branding data (would come from API)
const collegesBranding: Record<string, {
  name: string;
  logo?: string;
  primaryColor: string;
  tagline: string;
}> = {
  "harvard-medical": {
    name: "Harvard Medical School",
    primaryColor: "#A51C30",
    tagline: "Excellence in Medical Education",
  },
  "stanford-med": {
    name: "Stanford Medicine",
    primaryColor: "#8C1515",
    tagline: "Leading the Future of Medicine",
  },
  "jhu-medicine": {
    name: "Johns Hopkins Medicine",
    primaryColor: "#002D72",
    tagline: "Pioneering Medical Discovery",
  },
  default: {
    name: "ClinAid",
    primaryColor: "#1E40AF",
    tagline: "The Future of Medical Education",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCollege, setSelectedCollege] = useState("default");
  const branding = collegesBranding[selectedCollege] || collegesBranding.default;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.primaryColor}dd 100%)`,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ClinAid" className="h-16 w-16 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-white">ClinAid</h1>
              <p className="text-white/70 text-sm">Learn | Collaborate | Excel</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Transform Your<br />Medical Education
            </h2>
            <p className="text-white/80 mt-4 text-lg">
              Access world-class medical courses, AI-powered tutoring, and connect with expert professors.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              "AI-Powered Personalized Learning",
              "Virtual Patient Simulations",
              "Expert Faculty Consultations",
              "Comprehensive Progress Tracking",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-sm">
            Trusted by 48+ medical institutions worldwide
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{branding.name}</h1>
              <p className="text-white/70 text-xs">{branding.tagline}</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-gray-500 border-t border-gray-200 bg-white">
          <p>© 2024 ClinAid. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <a href="#" className="hover:text-gray-700">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}