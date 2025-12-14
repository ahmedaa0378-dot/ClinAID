"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Building,
  AlertCircle,
  Loader2,
  User,
  GraduationCap,
  BookOpen,
  Check,
  X,
  Info,
} from "lucide-react";

const colleges = [
  { id: "harvard-medical", name: "Harvard Medical School" },
  { id: "stanford-med", name: "Stanford Medicine" },
  { id: "jhu-medicine", name: "Johns Hopkins Medicine" },
  { id: "mayo-college", name: "Mayo Clinic College" },
  { id: "ucla-med", name: "UCLA Medical School" },
  { id: "duke-med", name: "Duke Medicine" },
  { id: "nyu-med", name: "NYU Grossman" },
  { id: "ucsf-med", name: "UCSF Medical" },
];

const departments = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Oncology",
  "Psychiatry",
  "Dermatology",
  "Radiology",
];

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const checkPasswordStrength = (password: string): PasswordStrength => {
  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let label = "Very Weak";
  let color = "bg-red-500";

  if (score === 5) {
    label = "Strong";
    color = "bg-emerald-500";
  } else if (score === 4) {
    label = "Good";
    color = "bg-blue-500";
  } else if (score === 3) {
    label = "Fair";
    color = "bg-yellow-500";
  } else if (score === 2) {
    label = "Weak";
    color = "bg-orange-500";
  }

  return { score, label, color, checks };
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [role, setRole] = useState<"student" | "professor" | "">("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Student-specific
  const [studentType, setStudentType] = useState<"UG" | "PG" | "">("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [department, setDepartment] = useState("");

  // Professor-specific
  const [designation, setDesignation] = useState("");
  const [specialization, setSpecialization] = useState("");

  const passwordStrength = checkPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const canProceedStep1 = role !== "";
  const canProceedStep2 = selectedCollege !== "";
  const canProceedStep3 = 
    firstName !== "" && 
    lastName !== "" && 
    email !== "" && 
    password !== "" && 
    confirmPassword !== "" &&
    passwordsMatch &&
    passwordStrength.score >= 4 &&
    agreeTerms &&
    (role === "student" ? (studentType !== "" && yearOfStudy !== "" && department !== "") : (designation !== "" && department !== ""));

  const handleNext = () => {
    setError("");
    if (step === 1 && canProceedStep1) {
      setStep(2);
    } else if (step === 2 && canProceedStep2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setError("");
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!canProceedStep3) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (role === "professor") {
        // Professors need approval
        router.push("/register/pending-approval");
      } else {
        // Students go to email verification
        router.push("/verify-email?email=" + encodeURIComponent(email));
      }
    }, 2000);
  };

  return (
    <div>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 rounded transition-colors ${
                    step > s ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span className={step >= 1 ? "text-blue-600 font-medium" : ""}>Role</span>
          <span className={step >= 2 ? "text-blue-600 font-medium" : ""}>Institution</span>
          <span className={step >= 3 ? "text-blue-600 font-medium" : ""}>Details</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {step === 1 && "Create your account"}
          {step === 2 && "Select your institution"}
          {step === 3 && "Complete your profile"}
        </h1>
        <p className="text-gray-500 mt-2">
          {step === 1 && "Choose how you'll use ClinAid"}
          {step === 2 && "Find your medical school"}
          {step === 3 && "Just a few more details"}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div
              onClick={() => setRole("student")}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                role === "student"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  role === "student" ? "bg-blue-100" : "bg-gray-100"
                }`}>
                  <GraduationCap className={`h-7 w-7 ${
                    role === "student" ? "text-blue-600" : "text-gray-500"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">I'm a Student</h3>
                    {role === "student" && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 mt-1">
                    Access courses, take quizzes, get AI tutoring, and track your progress
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setRole("professor")}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                role === "professor"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  role === "professor" ? "bg-blue-100" : "bg-gray-100"
                }`}>
                  <BookOpen className={`h-7 w-7 ${
                    role === "professor" ? "text-blue-600" : "text-gray-500"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">I'm a Professor</h3>
                    {role === "professor" && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 mt-1">
                    Create courses, manage students, offer consultations, and view analytics
                  </p>
                </div>
              </div>
            </div>

            {role === "professor" && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm">
                  Professor accounts require approval from your institution's admin before activation. You'll be notified via email once approved.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceedStep1}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              Continue
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Step 2: College Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search for your institution
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer ${
                    selectedCollege ? "text-gray-900 border-gray-300" : "text-gray-400 border-gray-200"
                  }`}
                >
                  <option value="" disabled>Select your institution</option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {selectedCollege && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">
                  {colleges.find(c => c.id === selectedCollege)?.name}
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Your account will be associated with this institution
                </p>
              </div>
            )}

            <p className="text-center text-sm text-gray-500">
              Can't find your institution?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact us
              </a>
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceedStep2}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Details */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@institution.edu"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Use your institutional email if possible</p>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Student-specific fields */}
            {role === "student" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Type *
                  </label>
                  <select
                    value={studentType}
                    onChange={(e) => setStudentType(e.target.value as "UG" | "PG")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select type</option>
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Study *
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select year</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                    <option value="5">Year 5</option>
                  </select>
                </div>
              </div>
            )}

            {/* Professor-specific fields */}
            {role === "professor" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation *
                  </label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select designation</option>
                    <option value="professor">Professor</option>
                    <option value="associate">Associate Professor</option>
                    <option value="assistant">Assistant Professor</option>
                    <option value="lecturer">Lecturer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g., Interventional Cardiology"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score >= 4 ? "text-emerald-600" :
                      passwordStrength.score >= 3 ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? "text-emerald-600" : "text-gray-400"}`}>
                      {passwordStrength.checks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      12+ characters
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? "text-emerald-600" : "text-gray-400"}`}>
                      {passwordStrength.checks.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Uppercase
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? "text-emerald-600" : "text-gray-400"}`}>
                      {passwordStrength.checks.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Lowercase
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.number ? "text-emerald-600" : "text-gray-400"}`}>
                      {passwordStrength.checks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Number
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.special ? "text-emerald-600" : "text-gray-400"}`}>
                      {passwordStrength.checks.special ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    confirmPassword && !passwordsMatch ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <X className="h-3 w-3" /> Passwords do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* Professor approval reminder */}
            {role === "professor" && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm">
                  Your account will be reviewed by your institution's admin. You'll receive an email once approved.
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
              <button
                type="submit"
                disabled={!canProceedStep3 || isLoading}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Account...
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
      </form>

      {/* Already have account */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
