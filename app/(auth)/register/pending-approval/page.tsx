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
      <p className="text-gray-500 mb-6">
        Your professor account has been created and is awaiting approval from your institution administrator.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Building className="h-5 w-5 text-amber-600" />
          <span className="font-semibold text-amber-800">Your Institution</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-amber-700 font-medium">Pending Review</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 text-left mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold text-sm">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Admin Review</p>
              <p className="text-sm text-gray-500">Your institution admin will review your registration</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold text-sm">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Email Notification</p>
              <p className="text-sm text-gray-500">You will receive an email once approved</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold text-sm">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Start Teaching</p>
              <p className="text-sm text-gray-500">Create courses and manage students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <Clock className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-500">Typical approval time: 1-2 business days</span>
      </div>

      <div className="space-y-3">
        <Link
          href="/login"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          Go to Sign In
          <ArrowRight className="h-5 w-5" />
        </Link>

        
          href="mailto:support@clinaid.com"
          className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Mail className="h-5 w-5" />
          Contact Support
        </a>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          Need faster approval? Contact your institution admin or email{" "}
          <a href="mailto:support@clinaid.com" className="text-blue-700 underline">
            support@clinaid.com
          </a>
        </p>
      </div>
    </div>
  );
}