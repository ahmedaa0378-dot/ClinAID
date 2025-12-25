"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart3,
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Brain,
  Calendar,
  Loader2,
} from "lucide-react";

interface Stats {
  totalColleges: number;
  activeColleges: number;
  totalStudents: number;
  totalProfessors: number;
  totalAdmins: number;
  pendingApprovals: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    totalColleges: 0,
    activeColleges: 0,
    totalStudents: 0,
    totalProfessors: 0,
    totalAdmins: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    try {
      // Fetch colleges count
      const { data: colleges } = await supabase
        .from("colleges")
        .select("id, is_active");

      // Fetch users by role
      const { data: users } = await supabase
        .from("users")
        .select("id, role, status");

      if (colleges) {
        setStats((prev) => ({
          ...prev,
          totalColleges: colleges.length,
          activeColleges: colleges.filter((c) => c.is_active).length,
        }));
      }

      if (users) {
        setStats((prev) => ({
          ...prev,
          totalStudents: users.filter((u) => u.role === "student").length,
          totalProfessors: users.filter((u) => u.role === "professor").length,
          totalAdmins: users.filter((u) => u.role === "college_admin").length,
          pendingApprovals: users.filter((u) => u.status === "pending").length,
        }));
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }

    setLoading(false);
  };

  const statCards = [
    {
      title: "Total Institutions",
      value: stats.totalColleges,
      icon: Building2,
      color: "blue",
      change: "+2 this month",
      changeType: "positive",
    },
    {
      title: "Active Institutions",
      value: stats.activeColleges,
      icon: Building2,
      color: "green",
      change: `${stats.totalColleges > 0 ? Math.round((stats.activeColleges / stats.totalColleges) * 100) : 0}% active`,
      changeType: "positive",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: GraduationCap,
      color: "purple",
      change: "+12% growth",
      changeType: "positive",
    },
    {
      title: "Total Professors",
      value: stats.totalProfessors,
      icon: Users,
      color: "orange",
      change: "+5% growth",
      changeType: "positive",
    },
    {
      title: "College Admins",
      value: stats.totalAdmins,
      icon: Users,
      color: "cyan",
      change: "Across institutions",
      changeType: "neutral",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Calendar,
      color: "yellow",
      change: "Requires attention",
      changeType: stats.pendingApprovals > 0 ? "negative" : "positive",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-600 mx-auto" />
          <p className="mt-2 text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500">Platform-wide statistics and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.changeType === "positive" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : stat.changeType === "negative" ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : null}
                  <span
                    className={`text-sm ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : stat.changeType === "negative"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}
              >
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="space-y-4">
            {[
              { label: "Students", value: stats.totalStudents, color: "bg-purple-500" },
              { label: "Professors", value: stats.totalProfessors, color: "bg-blue-500" },
              { label: "College Admins", value: stats.totalAdmins, color: "bg-green-500" },
            ].map((item) => {
              const total = stats.totalStudents + stats.totalProfessors + stats.totalAdmins;
              const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {item.value} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: "Review Pending Approvals", count: stats.pendingApprovals, href: "/super-admin/institutions" },
              { label: "Add New Institution", count: null, href: "/super-admin/institutions" },
              { label: "View All Users", count: stats.totalStudents + stats.totalProfessors + stats.totalAdmins, href: "/super-admin/institutions" },
              { label: "Manage Subscriptions", count: stats.totalColleges, href: "/super-admin/subscriptions" },
            ].map((action) => (
              
                key={action.label}
                href={action.href}
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-gray-700">{action.label}</span>
                {action.count !== null && (
                  <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">
                    {action.count}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Summary</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500">AI Sessions</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500">Courses Created</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500">Quizzes Completed</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500">Consultations</p>
          </div>
        </div>
      </div>
    </div>
  );
}