"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Loader2, CheckCircle2, RefreshCw } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => { if (countdown > 0) { const t = setTimeout(() => setCountdown(countdown - 1), 1000); return () => clearTimeout(t); } }, [countdown]);

  const handleResend = () => { setIsResending(true); setTimeout(() => { setIsResending(false); setResendSuccess(true); setCountdown(60); }, 1500); };

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Mail className="h-10 w-10 text-emerald-500" /></div>
      <h1 className="text-2xl font-bold text-white mb-2">Verify your email</h1>
      <p className="text-gray-400 mb-1">We sent a verification link to</p>
      <p className="text-white font-medium mb-8">{email}</p>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left mb-6">
        <h3 className="font-semibold text-white mb-4">Next steps:</h3>
        <div className="space-y-3">
          {["Check your email inbox", "Click the verification link", "Start learning!"].map((step, i) => (
            <div key={i} className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-sm font-medium">{i + 1}</div><span className="text-gray-400">{step}</span></div>
          ))}
        </div>
      </div>

      {resendSuccess && <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /><span className="text-emerald-400">Email sent!</span></div>}

      <div className="space-y-3">
        <button onClick={handleResend} disabled={isResending || countdown > 0} className="w-full py-3 border border-gray-700 text-white rounded-xl font-medium hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-2">
          {isResending ? <><Loader2 className="h-5 w-5 animate-spin" />Sending...</> : countdown > 0 ? <><RefreshCw className="h-5 w-5" />Resend in {countdown}s</> : <><RefreshCw className="h-5 w-5" />Resend Email</>}
        </button>
        <Link href="/login" className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2">Go to Sign In<ArrowRight className="h-5 w-5" /></Link>
      </div>
    </div>
  );
}
