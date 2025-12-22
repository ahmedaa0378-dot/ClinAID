"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Loader2,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { name: "Institutions", href: "/super-admin/institutions", icon: Building2 },
  { name: "Subscriptions", href: "/super-admin/subscriptions", icon: CreditCard },
  { name: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/super-admin/settings", icon: Settings },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const getInitials = () => {
    if (profile?.full_name) {
      const names = profile.full_name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    return "SA";
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  // Check if user is super admin
  if (profile && profile.role !== "super_admin") {
    router.push("/login");
    return null;
  }

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/super-admin" className="flex items-center gap-3">
          <img src="/logo.png" alt="ClinAid" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-white">ClinAid</h1>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-rose-400" />
              <p className="text-rose-400 text-xs">Super Admin</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/super-admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-gradient-to-r from-rose-500/20 to-orange-500/20 text-white border border-rose-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-rose-400" : "text-gray-500 group-hover:text-gray-300"}`} />
              <span className="font-medium">{item.name}</span>
              {isActive && <ChevronRight className="h-4 w-4 ml-auto text-rose-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center text-white font-semibold">
            {getInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{profile?.full_name || "Super Admin"}</p>
            <p className="text-gray-500 text-sm truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          {loggingOut ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5" />
          )}
          <span className="font-medium">{loggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-gray-950 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="relative z-10 flex flex-col h-full">
          <NavContent />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-950 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/super-admin" className="flex items-center gap-3">
          <img src="/logo.png" alt="ClinAid" className="h-8 w-8 object-contain" />
          <span className="font-bold">ClinAid</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-800 rounded-lg">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-gray-950 overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-60 h-60 bg-rose-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-orange-500/20 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="relative z-10 flex flex-col h-full">
              <NavContent />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}