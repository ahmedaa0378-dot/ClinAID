"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart3,
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  Brain,
  BookOpen,
  Calendar,
  Loader2,
} from "lucide-react";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalColleges: 0,
    activeColleges: 0,
    totalStudents: 0,
    totalProfessors: 0,
    totalAdmins: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    try {
      const { data: colleges } = await supabase
        .from("colleges")
        .select("id, is_active");

      const { data: users } = await supabase
        .from("users")
        .select("id, role, status");

      setStats({
        totalColleges: colleges?.length || 0,
        activeColleges: colleges?.filter((c) => c.is_active).length || 0,
        totalStudents: users?.filter((u) => u.role === "student").length || 0,
        totalProfessors: users?.filter((u) => u.role === "professor").length || 0,
        totalAdmins: users?.filter((u) => u.role === "college_admin").length || 0,
        pendingApprovals: users?.filter((u) => u.status === "pending").length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }

    setLoading(false);
  };

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500">Platform-wide statistics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Institutions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalColleges}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Active: {stats.activeColleges}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Registered</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Professors</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProfessors}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Registered</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">College Admins</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAdmins}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-sm text-gray-500">Across institutions</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-cyan-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-sm ${stats.pendingApprovals > 0 ? "text-yellow-600" : "text-green-600"}`}>
                  {stats.pendingApprovals > 0 ? "Requires attention" : "All clear"}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">AI Sessions</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-sm text-gray-500">Coming soon</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
              <Brain className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Students</span>
                <span className="text-sm font-medium text-gray-900">{stats.totalStudents}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${stats.totalStudents > 0 ? 70 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Professors</span>
                <span className="text-sm font-medium text-gray-900">{stats.totalProfessors}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.totalProfessors > 0 ? 20 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">College Admins</span>
                <span className="text-sm font-medium text-gray-900">{stats.totalAdmins}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats.totalAdmins > 0 ? 10 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/super-admin/institutions" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-gray-700">Review Pending Approvals</span>
              <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">{stats.pendingApprovals}</span>
            </a>
            <a href="/super-admin/institutions" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-gray-700">Add New Institution</span>
            </a>
            <a href="/super-admin/subscriptions" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-gray-700">Manage Subscriptions</span>
              <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">{stats.totalColleges}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}