"use client";

import {
  Building,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Globe,
  Server,
} from "lucide-react";

const statsData = [
  { label: "Total Colleges", value: "48", change: "+3", trend: "up", icon: Building, color: "rose" },
  { label: "Total Users", value: "12,847", change: "+524", trend: "up", icon: Users, color: "blue" },
  { label: "Active Subscriptions", value: "45", change: "+2", trend: "up", icon: CreditCard, color: "emerald" },
  { label: "Monthly Revenue", value: "$128.5K", change: "+12%", trend: "up", icon: DollarSign, color: "purple" },
];

const collegesList = [
  { id: 1, name: "Harvard Medical School", subdomain: "harvard-medical", students: 1247, professors: 52, plan: "Enterprise", status: "active", mrr: "$4,999" },
  { id: 2, name: "Stanford Medicine", subdomain: "stanford-med", students: 986, professors: 41, plan: "Enterprise", status: "active", mrr: "$4,999" },
  { id: 3, name: "Johns Hopkins Medicine", subdomain: "jhu-medicine", students: 1102, professors: 48, plan: "Enterprise", status: "active", mrr: "$4,999" },
  { id: 4, name: "Mayo Clinic College", subdomain: "mayo-college", students: 654, professors: 28, plan: "Professional", status: "active", mrr: "$1,999" },
  { id: 5, name: "UCLA Medical School", subdomain: "ucla-med", students: 823, professors: 35, plan: "Professional", status: "active", mrr: "$1,999" },
];

const recentActivity = [
  { type: "signup", message: "New college registered: Duke Medicine", time: "2 hours ago", icon: Building },
  { type: "upgrade", message: "Stanford Medicine upgraded to Enterprise", time: "5 hours ago", icon: TrendingUp },
  { type: "payment", message: "Payment received from Harvard: $4,999", time: "8 hours ago", icon: DollarSign },
  { type: "alert", message: "High server load detected (resolved)", time: "Yesterday", icon: AlertCircle },
  { type: "user", message: "1,000+ new student registrations this week", time: "Yesterday", icon: Users },
];

const systemHealth = [
  { name: "API Server", status: "operational", uptime: "99.99%", latency: "45ms" },
  { name: "Database", status: "operational", uptime: "99.98%", latency: "12ms" },
  { name: "CDN", status: "operational", uptime: "100%", latency: "8ms" },
  { name: "Video Service", status: "degraded", uptime: "98.5%", latency: "120ms" },
];

const subscriptionBreakdown = [
  { plan: "Enterprise", count: 18, revenue: "$89,982", color: "bg-rose-500" },
  { plan: "Professional", count: 22, revenue: "$43,978", color: "bg-blue-500" },
  { plan: "Starter", count: 8, revenue: "$3,192", color: "bg-emerald-500" },
];

export default function SuperAdminDashboard() {
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      rose: { bg: "bg-rose-100", text: "text-rose-600" },
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600" },
    };
    return colors[color] || colors.rose;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "signup": return <Building className="h-5 w-5 text-rose-600" />;
      case "upgrade": return <TrendingUp className="h-5 w-5 text-emerald-600" />;
      case "payment": return <DollarSign className="h-5 w-5 text-purple-600" />;
      case "alert": return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case "user": return <Users className="h-5 w-5 text-blue-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "text-emerald-600 bg-emerald-100";
      case "degraded": return "text-orange-600 bg-orange-100";
      case "down": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Platform-wide overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}>
                  {stat.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
            <span className="flex items-center gap-1 text-emerald-600 text-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <div className="space-y-3">
            {systemHealth.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-500">Latency: {service.latency}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{service.uptime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Breakdown</h2>
          <div className="space-y-4">
            {subscriptionBreakdown.map((plan) => (
              <div key={plan.plan}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{plan.plan}</span>
                  <span className="text-sm text-gray-500">{plan.count} colleges</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${plan.color} rounded-full`}
                      style={{ width: `${(plan.count / 48) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">{plan.revenue}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total MRR</span>
              <span className="text-xl font-bold text-gray-900">$137,152</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === "signup" ? "bg-rose-100" :
                  activity.type === "upgrade" ? "bg-emerald-100" :
                  activity.type === "payment" ? "bg-purple-100" :
                  activity.type === "alert" ? "bg-orange-100" : "bg-blue-100"
                }`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Colleges */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Top Colleges by Size</h2>
          <button className="text-sm text-rose-600 hover:text-rose-700 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left pb-3 text-sm font-medium text-gray-500">College</th>
                <th className="text-center pb-3 text-sm font-medium text-gray-500">Students</th>
                <th className="text-center pb-3 text-sm font-medium text-gray-500">Professors</th>
                <th className="text-center pb-3 text-sm font-medium text-gray-500">Plan</th>
                <th className="text-center pb-3 text-sm font-medium text-gray-500">MRR</th>
                <th className="text-center pb-3 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {collegesList.map((college) => (
                <tr key={college.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                        <Building className="h-5 w-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{college.name}</p>
                        <p className="text-xs text-gray-500">{college.subdomain}.clinaid.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className="font-medium text-gray-900">{college.students.toLocaleString()}</span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-gray-700">{college.professors}</span>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      college.plan === "Enterprise" ? "bg-purple-100 text-purple-700" :
                      college.plan === "Professional" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {college.plan}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="font-medium text-gray-900">{college.mrr}</span>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      college.status === "active" ? "bg-emerald-100 text-emerald-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {college.status.charAt(0).toUpperCase() + college.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Globe className="h-8 w-8 text-white/80" />
            <span className="text-rose-200 text-sm">This Month</span>
          </div>
          <p className="text-3xl font-bold mb-1">3</p>
          <p className="text-rose-100">New Colleges Onboarded</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-white/80" />
            <span className="text-blue-200 text-sm">This Month</span>
          </div>
          <p className="text-3xl font-bold mb-1">2,847</p>
          <p className="text-blue-100">New User Registrations</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="h-8 w-8 text-white/80" />
            <span className="text-emerald-200 text-sm">Platform</span>
          </div>
          <p className="text-3xl font-bold mb-1">99.97%</p>
          <p className="text-emerald-100">Overall Uptime</p>
        </div>
      </div>
    </div>
  );
}