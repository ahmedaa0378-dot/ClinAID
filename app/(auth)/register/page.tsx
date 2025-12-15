"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, Check, X, Building, Briefcase } from "lucide-react";

const colleges = ["Harvard Medical School", "Stanford Medicine", "Johns Hopkins", "Mayo Clinic", "UCLA Health", "Duke Medicine", "NYU Langone", "UCSF Medical"];
const departments = ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Oncology", "Psychiatry", "Dermatology", "Radiology"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ role: "", college: "", firstName: "", lastName: "", email: "", department: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);

  const passwordChecks = {
    length: formData.password.length >= 12,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
  };
  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (formData.role === "professor") router.push("/register/pending-approval");
      else router.push("/verify-email?email=" + formData.email);
    }, 1500);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
        <p className="text-gray-400">Join ClinAid and start learning</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white" : "bg-gray-800 text-gray-500"}`}>{s}</div>
            {s < 3 && <div className={`w-12 h-1 mx-1 rounded ${step > s ? "bg-emerald-500" : "bg-gray-800"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Role */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-gray-400 text-center mb-6">I am a...</p>
          {[{ role: "student", icon: GraduationCap, title: "Student", desc: "Access courses, quizzes, and AI tutoring" }, { role: "professor", icon: BookOpen, title: "Professor", desc: "Create courses and manage students" }].map((r) => (
            <button key={r.role} onClick={() => { setFormData({ ...formData, role: r.role }); setStep(2); }} className={`w-full p-6 rounded-xl border text-left transition-all flex items-start gap-4 ${formData.role === r.role ? "border-emerald-500 bg-emerald-500/10" : "border-gray-800 bg-gray-900 hover:border-gray-700"}`}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center"><r.icon className="h-6 w-6 text-white" /></div>
              <div><div className="text-white font-semibold">{r.title}</div><div className="text-gray-500 text-sm">{r.desc}</div></div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: College */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-gray-400 text-center mb-6">Select your institution</p>
          <div className="relative">
            <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <select value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} className="w-full pl-12 pr-4 py-3.5 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 appearance-none">
              <option value="">Select institution...</option>
              {colleges.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {formData.role === "professor" && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-amber-400 text-sm">Professor accounts require admin approval</p>
            </div>
          )}
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-700 text-white rounded-xl font-medium hover:bg-gray-900 flex items-center justify-center gap-2"><ArrowLeft className="h-5 w-5" />Back</button>
            <button onClick={() => setStep(3)} disabled={!formData.college} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">Continue<ArrowRight className="h-5 w-5" /></button>
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
              <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="John" className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
              <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Doe" className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@institution.edu" className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
            <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500">
              <option value="">Select department...</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Create password" className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
            </div>
            {formData.password && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-1">{[1,2,3,4,5].map((i) => <div key={i} className={`h-1 flex-1 rounded ${i <= passwordScore ? "bg-emerald-500" : "bg-gray-800"}`} />)}</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {Object.entries(passwordChecks).map(([key, valid]) => (
                    <div key={key} className={`flex items-center gap-1 ${valid ? "text-emerald-500" : "text-gray-500"}`}>{valid ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}{key === "length" ? "12+ chars" : key}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Confirm password" className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
            {formData.confirmPassword && (
              <div className={`mt-1 text-xs flex items-center gap-1 ${passwordsMatch ? "text-emerald-500" : "text-red-500"}`}>{passwordsMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}{passwordsMatch ? "Passwords match" : "Passwords don't match"}</div>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-700 text-white rounded-xl font-medium hover:bg-gray-900 flex items-center justify-center gap-2"><ArrowLeft className="h-5 w-5" />Back</button>
            <button onClick={handleSubmit} disabled={isLoading || passwordScore < 4 || !passwordsMatch} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Creating...</> : <>Create Account<ArrowRight className="h-5 w-5" /></>}
            </button>
          </div>
        </div>
      )}

      <p className="text-center mt-8 text-gray-400">Already have an account? <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Sign in</Link></p>
    </div>
  );
}
