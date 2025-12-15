"use client";

import Link from "next/link";
import { Clock, Mail, ArrowRight, Building } from "lucide-react";

export default function PendingApprovalPage() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock className="h-10 w-10 text-amber-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h1>
      <p className="text-gray-500 mb-6">Your professor account is awaiting approval from your institution administrator.</p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Building className="h-5 w-5 text-amber-600" />
          <span className="font-semibold text-amber-800">Your Institution</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-amber-700 font-medium">Pending Review</span>
        </div>
      </div>
      <div className="space-y-3">
        <Link href="/login" className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
          Go to Sign In
          <ArrowRight className="h-5 w-5" />
        </Link>
        <a href="mailto:support@clinaid.com" className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
          <Mail className="h-5 w-5" />
          Contact Support
        </a>
      </div>
    </div>
  );
}
