"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  ClipboardList,
  Calendar,
  BarChart3,
  Menu,
  X,
  HelpCircle,
  Bell,
  Search,
  GraduationCap,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/professor" },
  { icon: Users, label: "My Students", href: "/professor/students" },
  { icon: FolderOpen, label: "Content", href: "/professor/content" },
  { icon: ClipboardList, label: "Quizzes", href: "/professor/quizzes" },
  { icon: Calendar, label: "Consultation Slots", href: "/professor/slots" },
  { icon: BarChart3, label: "Analytics", href: "/professor/analytics" },
];

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/professor") {
      return pathname === "/professor";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1E40AF] text-white"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#1E40AF] to-[#1E3A8A] transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-[#1E40AF]" />
            </div>
            <div>
              <span className="text-white font-bold text-xl">MedLearn</span>
              <p className="text-blue-200 text-xs">Professor Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-colors duration-200 ${
                    active ? "bg-[#3B82F6]" : "hover:bg-[#2563EB]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Switch to Student View */}
          <div className="mt-auto">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-3 text-blue-200 hover:text-white transition-colors"
            >
              <span className="text-sm">← Switch to Student View</span>
            </Link>
            <div className="bg-[#2563EB] rounded-xl p-4 space-y-3 mt-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Need Help?</span>
              </div>
              <p className="text-white/90 text-sm">Faculty support center</p>
              <button className="w-full bg-white text-[#1E40AF] hover:bg-white/90 font-medium py-2 rounded-lg transition-colors">
                Get Support
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students, content..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-medium">SS</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Dr. Sarah Smith</p>
                  <p className="text-xs text-gray-500">Cardiology</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}