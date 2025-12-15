"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  BookOpen,
  BarChart3,
  Calendar,
  Palette,
  Building2,
  Shield,
  Zap,
  Users,
  GraduationCap,
  ClipboardCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Play,
  Menu,
  X,
  ChevronRight,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Send,
  Loader2,
} from "lucide-react";

// ==================== NAVBAR ====================
const Navbar = ({ onOpenDemo }: { onOpenDemo: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/80 backdrop-blur-xl border-b border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ClinAid" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-white">ClinAid</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              Testimonials
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Sign In
            </Link>
            <button
              onClick={onOpenDemo}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Request Demo
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-gray-300 hover:text-white py-2">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white py-2">How It Works</a>
              <a href="#pricing" className="text-gray-300 hover:text-white py-2">Pricing</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white py-2">Testimonials</a>
              <hr className="border-gray-800" />
              <Link href="/login" className="text-gray-300 hover:text-white py-2">Sign In</Link>
              <button
                onClick={onOpenDemo}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-medium"
              >
                Request Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// ==================== HERO SECTION ====================
const HeroSection = ({ onOpenDemo }: { onOpenDemo: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 mb-8">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">Trusted by 50+ Medical Institutions</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Transform Medical Education
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            At Your Institution
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
          ClinAid is the AI-powered learning platform that helps medical colleges deliver better outcomes, 
          reduce administrative burden, and prepare students for modern healthcare.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onOpenDemo}
            className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
          >
            Request a Demo
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-gray-800/50 text-white rounded-full font-semibold text-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Play className="h-5 w-5" />
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: "50+", label: "Institutions" },
            { value: "15,000+", label: "Students" },
            { value: "94%", label: "Completion Rate" },
            { value: "+35%", label: "Pass Rate Increase" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-gray-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== TRUSTED BY ====================
const TrustedBy = () => {
  const institutions = [
    "Harvard Medical",
    "Stanford Medicine",
    "Johns Hopkins",
    "Mayo Clinic",
    "UCLA Health",
    "Duke Medicine",
  ];

  return (
    <section className="py-16 bg-gray-900 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 mb-8 text-sm uppercase tracking-wider">
          Trusted by Leading Medical Institutions
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {institutions.map((name) => (
            <div
              key={name}
              className="text-gray-500 font-semibold text-lg hover:text-gray-300 transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== PROBLEM STATEMENT ====================
const ProblemSection = () => {
  const problems = [
    {
      icon: Clock,
      title: "Faculty Burnout",
      description: "Professors spend 20+ hours/week on repetitive tasks instead of teaching",
    },
    {
      icon: Users,
      title: "Student Struggles",
      description: "Limited 1-on-1 support leads to knowledge gaps and poor outcomes",
    },
    {
      icon: BarChart3,
      title: "No Visibility",
      description: "Administrators can't identify at-risk students until it's too late",
    },
  ];

  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Medical Education Faces Real Challenges
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Traditional methods can't keep up with modern healthcare demands
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-red-500/50 transition-colors group"
            >
              <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                <problem.icon className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{problem.title}</h3>
              <p className="text-gray-400">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== FEATURES SECTION ====================
const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Tutoring",
      description: "24/7 intelligent tutoring that adapts to each student's learning pace and style. Reduce faculty workload while improving student outcomes.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: BookOpen,
      title: "Centralized Content",
      description: "One platform for all course materials, videos, and resources. Professors upload once, students access from anywhere.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time dashboards to track student performance, engagement, and identify at-risk students before they fall behind.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Streamline professor-student consultations with automated booking, reminders, and video conferencing integration.",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      icon: Palette,
      title: "White-Label Ready",
      description: "Full custom branding with your institution's logo, colors, and domain. Your platform, your identity.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Building2,
      title: "Multi-Department",
      description: "Manage Cardiology, Pediatrics, Neurology, and more—all from one centralized admin panel.",
      gradient: "from-indigo-500 to-violet-500",
    },
  ];

  return (
    <section id="features" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Zap className="h-4 w-4 text-emerald-500" />
            <span className="text-sm text-emerald-400">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything Your Institution Needs
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A comprehensive platform designed specifically for medical education
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-gray-950 border border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden"
            >
              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} p-[1px] mb-6`}>
                <div className="w-full h-full rounded-xl bg-gray-950 flex items-center justify-center">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>

              {/* Arrow */}
              <div className="mt-6 flex items-center gap-2 text-gray-500 group-hover:text-white transition-colors">
                <span className="text-sm font-medium">Learn more</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== HOW IT WORKS ====================
const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Quick Onboarding",
      description: "We set up your branded platform in 48 hours. Import your courses, add professors, and configure departments.",
      icon: Building2,
    },
    {
      step: "02",
      title: "Empower Your Team",
      description: "Professors upload content, create assessments, and set up consultation slots. Students get instant access.",
      icon: Users,
    },
    {
      step: "03",
      title: "Track & Optimize",
      description: "Monitor real-time analytics, identify improvements, and watch your outcomes transform.",
      icon: TrendingUp,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From signup to transformation in less than a week
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-full w-full h-[2px] bg-gradient-to-r from-emerald-500 to-transparent -translate-x-1/2" />
              )}
              
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-[2px]">
                    <div className="w-full h-full rounded-2xl bg-gray-950 flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-emerald-400" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== ROLE BENEFITS ====================
const RoleBenefits = () => {
  const roles = [
    {
      icon: GraduationCap,
      title: "For Students",
      benefits: [
        "24/7 AI tutoring support",
        "Interactive quizzes & assessments",
        "Progress tracking dashboard",
        "Easy consultation booking",
      ],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: BookOpen,
      title: "For Professors",
      benefits: [
        "Centralized content management",
        "Automated grading & feedback",
        "Student performance insights",
        "Flexible consultation slots",
      ],
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Building2,
      title: "For Administrators",
      benefits: [
        "Institution-wide analytics",
        "Department management",
        "Custom branding controls",
        "User & access management",
      ],
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Built for Everyone in Your Institution
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tailored experiences for students, professors, and administrators
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div
              key={role.title}
              className="relative p-8 rounded-2xl bg-gray-950 border border-gray-800 overflow-hidden group hover:border-gray-700 transition-colors"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-5`} />
              
              <div className="relative">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${role.gradient} flex items-center justify-center mb-6`}>
                  <role.icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-6">{role.title}</h3>

                <ul className="space-y-4">
                  {role.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== WHY CLINAID ====================
const WhyClinAid = () => {
  const differentiators = [
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security for all medical data",
    },
    {
      icon: Building2,
      title: "Multi-Tenant",
      description: "Isolated, secure environment for each institution",
    },
    {
      icon: Palette,
      title: "White-Label",
      description: "Your branding, your domain, your platform",
    },
    {
      icon: Brain,
      title: "AI-First",
      description: "Built with intelligent tutoring at its core",
    },
    {
      icon: TrendingUp,
      title: "Scalable",
      description: "Grows with your institution seamlessly",
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Personal account manager for Enterprise",
    },
  ];

  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Leading Institutions Choose ClinAid
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Purpose-built for medical education with enterprise-grade capabilities
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-emerald-500/50 transition-colors group"
            >
              <item.icon className="h-8 w-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== PRICING SECTION ====================
const PricingSection = ({ onOpenDemo }: { onOpenDemo: () => void }) => {
  const plans = [
    {
      name: "Starter",
      price: "$399",
      period: "/month",
      description: "Perfect for small programs & pilot departments",
      features: [
        "Up to 500 students",
        "10 professor accounts",
        "5 GB storage",
        "Basic analytics",
        "Email support",
        "Standard branding",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      price: "$1,999",
      period: "/month",
      description: "For growing medical schools",
      features: [
        "Up to 2,000 students",
        "50 professor accounts",
        "50 GB storage",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "API access",
        "SSO integration",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large universities & multi-campus",
      features: [
        "Unlimited students",
        "Unlimited professors",
        "Unlimited storage",
        "Full analytics suite",
        "24/7 dedicated support",
        "White-label solution",
        "Full API access",
        "Custom integrations",
        "Dedicated account manager",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="text-sm text-emerald-400">Simple Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Plans That Scale With You
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            All plans include a 30-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-b from-emerald-500/10 to-gray-950 border-emerald-500/50 scale-105"
                  : "bg-gray-950 border-gray-800 hover:border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full text-sm font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onOpenDemo}
                className={`w-full py-3 rounded-xl font-medium transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== RESULTS/ROI ====================
const ResultsSection = () => {
  const stats = [
    { value: "+35%", label: "Student Pass Rate", description: "Average improvement in board exam pass rates" },
    { value: "20+", label: "Hours Saved/Week", description: "Faculty time reclaimed from admin tasks" },
    { value: "+60%", label: "Engagement", description: "Increase in student platform engagement" },
    { value: "40%", label: "Cost Reduction", description: "Administrative overhead savings" },
  ];

  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Real Results, Real Impact
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See what institutions achieve with ClinAid
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
              <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-white font-semibold mb-2">{stat.label}</div>
              <div className="text-gray-500 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== TESTIMONIALS ====================
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "ClinAid has transformed how we deliver medical education. Our pass rates are up 35% and faculty finally have time to focus on teaching.",
      author: "Dr. Sarah Mitchell",
      role: "Dean of Medical Education",
      institution: "Stanford Medicine",
      avatar: "SM",
    },
    {
      quote: "The analytics dashboard helped us identify struggling students 6 weeks earlier than before. That early intervention is game-changing.",
      author: "Dr. James Chen",
      role: "Associate Dean",
      institution: "Johns Hopkins",
      avatar: "JC",
    },
    {
      quote: "Implementation was seamless. Within 48 hours, our entire department was up and running with our own branded platform.",
      author: "Dr. Emily Rodriguez",
      role: "Department Head, Cardiology",
      institution: "Mayo Clinic",
      avatar: "ER",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by Medical Leaders
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See what deans and administrators say about ClinAid
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="p-8 rounded-2xl bg-gray-950 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <Quote className="h-10 w-10 text-emerald-500/30 mb-6" />
              <p className="text-gray-300 mb-8 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.author}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  <div className="text-emerald-500 text-sm">{testimonial.institution}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== CTA SECTION ====================
const CTASection = ({ onOpenDemo }: { onOpenDemo: () => void }) => {
  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Transform Your
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Medical Program?
          </span>
        </h2>
        <p className="text-xl text-gray-400 mb-10">
          Join 50+ institutions already using ClinAid to deliver better outcomes
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenDemo}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
          >
            Request a Demo
            <ArrowRight className="h-5 w-5" />
          </button>
          <a
            href="mailto:sales@clinaid.com"
            className="px-8 py-4 bg-gray-800/50 text-white rounded-full font-semibold text-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Mail className="h-5 w-5" />
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
};

// ==================== FOOTER ====================
const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="ClinAid" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-white">ClinAid</span>
            </div>
            <p className="text-gray-500 mb-6">
              Learn | Collaborate | Excel
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-500 hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-gray-500 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-500 hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="text-gray-500 hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-500 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-500 hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-500">
                <Mail className="h-4 w-4" />
                sales@clinaid.com
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 ClinAid. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">HIPAA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ==================== DEMO MODAL ====================
const DemoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    role: "",
    students: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gray-900 rounded-2xl border border-gray-800 p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
            <p className="text-gray-400 mb-6">
              We've received your request. Our team will contact you within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-white mb-2">Request a Demo</h3>
            <p className="text-gray-400 mb-6">
              See how ClinAid can transform your medical program
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    placeholder="john@university.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Institution Name *</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="Harvard Medical School"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Role *</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select role</option>
                    <option value="dean">Dean</option>
                    <option value="administrator">Administrator</option>
                    <option value="department_head">Department Head</option>
                    <option value="professor">Professor</option>
                    <option value="it">IT Director</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Student Count</label>
                  <select
                    value={formData.students}
                    onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select range</option>
                    <option value="<500">Less than 500</option>
                    <option value="500-1000">500 - 1,000</option>
                    <option value="1000-2000">1,000 - 2,000</option>
                    <option value="2000+">2,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message (Optional)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Tell us about your needs..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// ==================== MAIN PAGE ====================
export default function LandingPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar onOpenDemo={() => setDemoModalOpen(true)} />
      <HeroSection onOpenDemo={() => setDemoModalOpen(true)} />
      <TrustedBy />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <RoleBenefits />
      <WhyClinAid />
      <PricingSection onOpenDemo={() => setDemoModalOpen(true)} />
      <ResultsSection />
      <TestimonialsSection />
      <CTASection onOpenDemo={() => setDemoModalOpen(true)} />
      <Footer />
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
}