"use client";

import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";

const statsData = [
  { label: "Total Students", value: "1,247", change: "+48", trend: "up", icon: Users, color: "purple" },
  { label: "Professors", value: "52", change: "+3", trend: "up", icon: GraduationCap, color: "blue" },
  { label: "Departments", value: "8", change: "0", trend: "neutral", icon: Building2, color: "emerald" },
  { label: "Active Courses", value: "34", change: "+5", trend: "up", icon: BookOpen, color: "orange" },
];

const recentActivity = [
  { type: "enrollment", message: "15 new students enrolled in Cardiology", time: "2 hours ago", icon: UserPlus },
  { type: "approval", message: "Dr. James Wilson approved as professor", time: "5 hours ago", icon: CheckCircle2 },
  { type: "alert", message: "3 students flagged as at-risk in Pediatrics", time: "Yesterday", icon: AlertCircle },
  { type: "update", message: "Neurology department updated course structure", time: "Yesterday", icon: Building2 },
  { type: "enrollment", message: "New batch of 28 students started", time: "2 days ago", icon: UserPlus },
];

const pendingApprovals = [
  { id: 1, name: "Dr. Emily Carter", type: "Professor", department: "Cardiology", date: "Today" },
  { id: 2, name: "Dr. Robert Lee", type: "Professor", department: "Neurology", date: "Yesterday" },
  { id: 3, name: "John Smith + 12 others", type: "Students", department: "Various", date: "Today" },
];

const departmentStats = [
  { name: "Cardiology", professors: 12, students: 245, courses: 8, avgProgress: 72 },
  { name: "Neurology", professors: 8, students: 189, courses: 6, avgProgress: 68 },
  { name: "Pediatrics", professors: 10, students: 203, courses: 7, avgProgress: 75 },
  { name: "Orthopedics", professors: 7, students: 156, courses: 5, avgProgress: 70 },
  { name: "Oncology", professors: 6, students: 134, courses: 4, avgProgress: 65 },
];

const topCourses = [
  { name: "Clinical Cardiology", professor: "Dr. Sarah Smith", students: 156, rating: 4.8 },
  { name: "Pediatric Care Fundamentals", professor: "Dr. Michael Johnson", students: 142, rating: 4.7 },
  { name: "Advanced Neurology", professor: "Dr. Emily Davis", students: 128, rating: 4.6 },
  { name: "Orthopedic Surgery Basics", professor: "Dr. Robert Wilson", students: 118, rating: 4.5 },
];

export default function AdminDashboard() {
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      purple: { bg: "bg-purple-100", text: "text-purple-600" },
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-600" },
    };
    return colors[color] || colors.purple;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <UserPlus className="h-5 w-5 text-purple-600" />;
      case "approval":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Building2 className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">College Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here's what's happening at your institution.</p>
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
                {stat.trend !== "neutral" && (
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                    {stat.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {stat.change}
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
              {pendingApprovals.length} pending
            </span>
          </div>
          <div className="space-y-4">
            {pendingApprovals.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === "Professor" ? "bg-blue-100" : "bg-purple-100"
                  }`}>
                    {item.type === "Professor" ? (
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Users className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.type} • {item.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <AlertCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
            View All Approvals
          </button>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === "enrollment" ? "bg-purple-100" :
                  activity.type === "approval" ? "bg-emerald-100" :
                  activity.type === "alert" ? "bg-red-100" : "bg-blue-100"
                }`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Stats & Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Department Overview</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{dept.name}</h3>
                  <span className="text-sm text-gray-500">{dept.avgProgress}% avg progress</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${dept.avgProgress}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{dept.professors} professors</span>
                  <span>{dept.students} students</span>
                  <span>{dept.courses} courses</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Courses</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={course.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-500">{course.professor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium text-gray-900">{course.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">{course.students} students</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}