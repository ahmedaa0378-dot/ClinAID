"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, Check, X, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordChecks = { length: password.length >= 12, uppercase: /[A-Z]/.test(password), lowercase: /[a-z]/.test(password), number: /[0-9]/.test(password), special: /[!@#$%^&*]/.test(password) };
  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setIsSuccess(true); }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="h-10 w-10 text-emerald-500" /></div>
        <h1 className="text-2xl font-bold text-white mb-2">Password reset successful!</h1>
        <p className="text-gray-400 mb-8">Your password has been updated.</p>
        <Link href="/login" className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold">Sign In<ArrowRight className="h-5 w-5" /></Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldCheck className="h-8 w-8 text-emerald-500" /></div>
        <h1 className="text-2xl font-bold text-white mb-2">Create new password</h1>
        <p className="text-gray-400">Your new password must be different from previous passwords.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" className="w-full pl-12 pr-12 py-3.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
          </div>
          {password && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-1">{[1,2,3,4,5].map((i) => <div key={i} className={`h-1 flex-1 rounded ${i <= passwordScore ? "bg-emerald-500" : "bg-gray-800"}`} />)}</div>
              <div className="grid grid-cols-2 gap-1 text-xs">{Object.entries(passwordChecks).map(([key, valid]) => (<div key={key} className={`flex items-center gap-1 ${valid ? "text-emerald-500" : "text-gray-500"}`}>{valid ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}{key === "length" ? "12+ chars" : key}</div>))}</div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full px-4 py-3.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
          {confirmPassword && <div className={`mt-1 text-xs flex items-center gap-1 ${passwordsMatch ? "text-emerald-500" : "text-red-500"}`}>{passwordsMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}{passwordsMatch ? "Passwords match" : "Passwords don't match"}</div>}
        </div>
        <button type="submit" disabled={isLoading || passwordScore < 4 || !passwordsMatch} className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
          {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Resetting...</> : <>Reset Password<ArrowRight className="h-5 w-5" /></>}
        </button>
      </form>
    </div>
  );
}
