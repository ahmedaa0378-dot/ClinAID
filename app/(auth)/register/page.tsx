"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  GraduationCap,
  BookOpen,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
  X,
  Building,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    role: "",
    college_id: "",
    first_name: "",
    last_name: "",
    email: "",
    department_id: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Fetch colleges on mount
  useEffect(() => {
    const fetchColleges = async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select("id, name")
        .order("name");
      
      if (data) setColleges(data);
    };
    fetchColleges();
  }, []);

  // Fetch departments when college is selected
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!formData.college_id) {
        setDepartments([]);
        return;
      }
      
      const { data, error } = await supabase
        .from("departments")
        .select("id, name")
        .eq("college_id", formData.college_id)
        .order("name");
      
      if (data) setDepartments(data);
    };
    fetchDepartments();
  }, [formData.college_id]);

  const passwordChecks = {
    length: formData.password.length >= 12,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
  };
  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        // 2. Create user profile in users table
const { error: profileError } = await supabase.from("users").insert({
  id: authData.user.id,
  auth_id: authData.user.id,
  email: formData.email,
  full_name: `${formData.first_name} ${formData.last_name}`,
  role: formData.role,
  college_id: formData.college_id || null,
  department_id: formData.department_id || null,
  status: formData.role === "professor" ? "pending" : "active",
});

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // User was created in auth, but profile failed - handle gracefully
          setError("Account created but profile setup failed. Please contact support.");
          setIsLoading(false);
          return;
        }

        // 3. Redirect based on role
        if (formData.role === "professor") {
          router.push("/register/pending-approval");
        } else {
          router.push("/verify-email?email=" + encodeURIComponent(formData.email));
        }
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
        <p className="text-gray-400">Join ClinAid and start learning</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <X className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                  : "bg-gray-800 text-gray-500"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 mx-1 rounded ${
                  step > s ? "bg-emerald-500" : "bg-gray-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Role */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-gray-400 text-center mb-6">I am a...</p>
          {[
            {
              role: "student",
              icon: GraduationCap,
              title: "Student",
              desc: "Access courses, quizzes, and AI tutoring",
            },
            {
              role: "professor",
              icon: BookOpen,
              title: "Professor",
              desc: "Create courses and manage students",
            },
          ].map((r) => (
            <button
              key={r.role}
              onClick={() => {
                setFormData({ ...formData, role: r.role });
                setStep(2);
              }}
              className={`w-full p-6 rounded-xl border text-left transition-all flex items-start gap-4 ${
                formData.role === r.role
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-gray-800 bg-gray-900 hover:border-gray-700"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                <r.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">{r.title}</div>
                <div className="text-gray-500 text-sm">{r.desc}</div>
              </div>
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
            <select
              value={formData.college_id}
              onChange={(e) =>
                setFormData({ ...formData, college_id: e.target.value, department_id: "" })
              }
              className="w-full pl-12 pr-4 py-3.5 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 appearance-none"
            >
              <option value="">Select institution...</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {formData.role === "professor" && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-amber-400 text-sm">
                Professor accounts require admin approval
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 border border-gray-700 text-white rounded-xl font-medium hover:bg-gray-900 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!formData.college_id}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                placeholder="John"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                placeholder="Doe"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@institution.edu"
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Department
            </label>
            <select
              value={formData.department_id}
              onChange={(e) =>
                setFormData({ ...formData, department_id: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">Select department...</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Create password"
                className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${
                        i <= passwordScore ? "bg-emerald-500" : "bg-gray-800"
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {Object.entries(passwordChecks).map(([key, valid]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-1 ${
                        valid ? "text-emerald-500" : "text-gray-500"
                      }`}
                    >
                      {valid ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      {key === "length" ? "12+ chars" : key}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Confirm password"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
            {formData.confirmPassword && (
              <div
                className={`mt-1 text-xs flex items-center gap-1 ${
                  passwordsMatch ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {passwordsMatch ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
                {passwordsMatch ? "Passwords match" : "Passwords don't match"}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 border border-gray-700 text-white rounded-xl font-medium hover:bg-gray-900 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || passwordScore < 4 || !passwordsMatch || !formData.first_name || !formData.last_name || !formData.email}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <p className="text-center mt-8 text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-emerald-400 hover:text-emerald-300 font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}