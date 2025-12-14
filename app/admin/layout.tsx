"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  Palette,
  BarChart3,
  Settings,
  Menu,
  X,
  HelpCircle,
  Bell,
  Search,
  Shield,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Building2, label: "Departments", href: "/admin/departments" },
  { icon: GraduationCap, label: "Professors", href: "/admin/professors" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: Palette, label: "Branding", href: "/admin/branding" },
  { icon: BarChart3, label: "Reports", href: "/admin/reports" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#5B21B6] text-white"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#5B21B6] to-[#4C1D95] transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="ClinAid" className="h-14 w-14 object-contain" />
            <div>
              <span className="text-white font-bold text-xl">ClinAid</span>
              <p className="text-purple-200 text-xs">College Admin</p>
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
                    active ? "bg-[#7C3AED]" : "hover:bg-[#6D28D9]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Switch Views */}
          <div className="mt-auto">
            <div className="space-y-1 mb-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-purple-200 hover:text-white transition-colors text-sm"
              >
                ← Student View
              </Link>
              <Link
                href="/professor"
                className="flex items-center gap-2 px-4 py-2 text-purple-200 hover:text-white transition-colors text-sm"
              >
                ← Professor View
              </Link>
            </div>
            <div className="bg-[#6D28D9] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Need Help?</span>
              </div>
              <p className="text-white/90 text-sm">Admin support center</p>
              <button className="w-full bg-white text-[#5B21B6] hover:bg-white/90 font-medium py-2 rounded-lg transition-colors">
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
                  placeholder="Search users, departments..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-700 font-medium">CA</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">College Admin</p>
                  <p className="text-xs text-gray-500">Harvard Medical School</p>
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