"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setResendSuccess(false);

    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      setCountdown(60); // 60 second cooldown
    }, 1500);
  };

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="h-10 w-10 text-blue-600" />
      </div>

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
      <p className="text-gray-500 mb-2">
        We've sent a verification link to
      </p>
      <p className="font-semibold text-gray-900 mb-6">{email}</p>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-xl p-6 text-left mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Next steps:</h3>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-semibold text-sm">1</span>
            <span className="text-gray-600">Check your email inbox (and spam folder)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-semibold text-sm">2</span>
            <span className="text-gray-600">Click the verification link in the email</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-semibold text-sm">3</span>
            <span className="text-gray-600">Start your learning journey!</span>
          </li>
        </ol>
      </div>

      {/* Resend Success */}
      {resendSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <p className="text-emerald-700 text-sm">Verification email sent successfully!</p>
        </div>
      )}

      {/* Resend Button */}
      <div className="space-y-4">
        <p className="text-gray-500 text-sm">Didn't receive the email?</p>
        <button
          onClick={handleResend}
          disabled={isResending || countdown > 0}
          className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isResending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : countdown > 0 ? (
            <>
              <RefreshCw className="h-5 w-5" />
              Resend in {countdown}s
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5" />
              Resend Verification Email
            </>
          )}
        </button>

        <Link
          href="/login"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          Go to Sign In
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Help */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Still having trouble?</strong><br />
          Contact our support team at{" "}
          <a href="mailto:support@clinaid.com" className="text-amber-700 underline">
            support@clinaid.com
          </a>
        </p>
      </div>
    </div>
  );
}