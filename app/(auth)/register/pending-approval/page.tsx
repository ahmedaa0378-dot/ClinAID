"use client";

import Link from "next/link";
import { Clock, Mail, ArrowRight, Building } from "lucide-react";

export default function PendingApprovalPage() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Clock className="h-10 w-10 text-amber-500" /></div>
      <h1 className="text-2xl font-bold text-white mb-2">Account Pending Approval</h1>
      <p className="text-gray-400 mb-8">Your professor account is awaiting approval from your institution administrator.</p>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-2 mb-4"><Building className="h-5 w-5 text-amber-500" /><span className="font-semibold text-amber-400">Your Institution</span></div>
        <div className="flex items-center justify-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" /><span className="text-amber-300">Pending Review</span></div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left mb-6">
        <h3 className="font-semibold text-white mb-4">What happens next?</h3>
        <div className="space-y-4">
          {[{t:"Admin Review",d:"Your institution admin will review your registration"},{t:"Email Notification",d:"You'll receive an email once approved"},{t:"Start Teaching",d:"Create courses and manage students"}].map((s, i) => (
            <div key={i} className="flex items-start gap-4"><div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-medium text-sm">{i+1}</div><div><p className="font-medium text-white">{s.t}</p><p className="text-sm text-gray-500">{s.d}</p></div></div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6 text-gray-500"><Clock className="h-4 w-4" /><span className="text-sm">Typical approval time: 1-2 business days</span></div>

      <div className="space-y-3">
        <Link href="/login" className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2">Go to Sign In<ArrowRight className="h-5 w-5" /></Link>
        <a href="mailto:support@clinaid.com" className="w-full py-3 border border-gray-700 text-white rounded-xl font-medium hover:bg-gray-900 flex items-center justify-center gap-2"><Mail className="h-5 w-5" />Contact Support</a>
      </div>
    </div>
  );
}
