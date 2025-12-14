"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  ClipboardList,
  Calendar,
  BarChart3,
  Bell,
  Search,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/student", icon: LayoutDashboard },
  { name: "My Courses", href: "/student/courses", icon: BookOpen },
  { name: "AI Tutor", href: "/student/ai-tutor", icon: Brain },
  { name: "Quizzes", href: "/student/quizzes", icon: ClipboardList },
  { name: "Book Session", href: "/student/sessions", icon: Calendar },
  { name: "My Progress", href: "/student/progress", icon: BarChart3 },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-emerald-600 to-emerald-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-emerald-500">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="ClinAid" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-white">ClinAid</h1>
                <p className="text-emerald-200 text-xs">Student Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-white text-emerald-700 shadow-md"
                      : "text-emerald-100 hover:bg-emerald-500/50"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : ""}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Switch View */}
          <div className="p-4 border-t border-emerald-500">
            <p className="text-emerald-200 text-xs mb-2">Switch View</p>
            <div className="space-y-1">
              <Link
                href="/professor"
                className="block px-4 py-2 text-emerald-100 hover:bg-emerald-500/50 rounded-lg text-sm"
              >
                Professor View
              </Link>
              <Link
                href="/admin"
                className="block px-4 py-2 text-emerald-100 hover:bg-emerald-500/50 rounded-lg text-sm"
              >
                Admin View
              </Link>
            </div>
          </div>

          {/* Help */}
          <div className="p-4 border-t border-emerald-500">
            <div className="bg-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-5 w-5 text-white" />
                <span className="font-medium text-white">Need Help?</span>
              </div>
              <p className="text-emerald-100 text-sm mb-3">Get support from our team</p>
              <button className="w-full py-2 bg-white text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">
                Get Support
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses, topics..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-xl">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold">JD</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Medical Student</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}