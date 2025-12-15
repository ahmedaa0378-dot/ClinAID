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
      <p className="text-gray-500 mb-6">Your professor account is awaiting approval.</p>
      <Link href="/login" className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
        Go to Sign In
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
