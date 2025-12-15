"use client";

import { useState } from "react";
import Link from "next/link";
import { Building, Mail, User, Users, MessageSquare, Send, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function RequestDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", institution: "", role: "", students: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setIsLoading(true); setTimeout(() => { setIsLoading(false); setIsSuccess(true); }, 1500); };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="h-10 w-10 text-emerald-500" /></div>
        <h1 className="text-2xl font-bold text-white mb-2">Thank you!</h1>
        <p className="text-gray-400 mb-8">We've received your request. Our team will contact you within 24 hours.</p>
        <Link href="/landing" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300"><ArrowLeft className="h-4 w-4" />Back to home</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Request a Demo</h1>
        <p className="text-gray-400">See how ClinAid can transform your medical program</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label><div className="relative"><User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" /><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Dr. John Smith" className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" /></div></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Work Email *</label><div className="relative"><Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" /><input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@university.edu" className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" /></div></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-300 mb-2">Institution Name *</label><div className="relative"><Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" /><input type="text" required value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} placeholder="Harvard Medical School" className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" /></div></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Your Role *</label><select required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"><option value="">Select role</option><option value="dean">Dean</option><option value="administrator">Administrator</option><option value="department_head">Department Head</option><option value="professor">Professor</option><option value="it">IT Director</option><option value="other">Other</option></select></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Student Count</label><select value={formData.students} onChange={(e) => setFormData({...formData, students: e.target.value})} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"><option value="">Select range</option><option value="<500">Less than 500</option><option value="500-1000">500 - 1,000</option><option value="1000-2000">1,000 - 2,000</option><option value="2000+">2,000+</option></select></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-300 mb-2">Message (Optional)</label><div className="relative"><MessageSquare className="absolute left-4 top-4 h-5 w-5 text-gray-500" /><textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={3} placeholder="Tell us about your needs..." className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none" /></div></div>
        <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
          {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Submitting...</> : <><Send className="h-5 w-5" />Submit Request</>}
        </button>
      </form>
      <p className="text-center mt-8"><Link href="/landing" className="text-gray-400 hover:text-white flex items-center justify-center gap-2"><ArrowLeft className="h-4 w-4" />Back to home</Link></p>
    </div>
  );
}
