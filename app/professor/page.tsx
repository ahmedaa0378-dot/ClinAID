"use client";

import {
  Users,
  BookOpen,
  ClipboardList,
  Calendar,
  TrendingUp,
  Clock,
  FileText,
  MessageSquare,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const statsData = [
  { label: "Total Students", value: "234", change: "+12 this month", icon: Users, color: "blue" },
  { label: "Active Courses", value: "3", change: "", icon: BookOpen, color: "emerald" },
  { label: "Pending Quizzes", value: "5", change: "2 need grading", icon: ClipboardList, color: "purple" },
  { label: "Upcoming Sessions", value: "8", change: "Next: Today 2PM", icon: Calendar, color: "orange" },
];

const recentSubmissions = [
  { student: "John Doe", quiz: "Cardiac Anatomy Quiz", score: 85, submitted: "10 mins ago", needsGrading: false },
  { student: "Jane Smith", quiz: "ECG Interpretation", score: null, submitted: "1 hour ago", needsGrading: true },
  { student: "Mike Johnson", quiz: "Cardiac Anatomy Quiz", score: 72, submitted: "2 hours ago", needsGrading: false },
  { student: "Emily Brown", quiz: "Physiology Assessment", score: null, submitted: "3 hours ago", needsGrading: true },
  { student: "David Wilson", quiz: "Cardiac Anatomy Quiz", score: 91, submitted: "5 hours ago", needsGrading: false },
];

const upcomingSessions = [
  { student: "John Doe", topic: "ECG Doubts", time: "Today, 2:00 PM", type: "consultation" },
  { student: "Class Session", topic: "Cardiac Physiology Review", time: "Today, 4:00 PM", type: "class" },
  { student: "Jane Smith", topic: "Case Discussion", time: "Tomorrow, 10:00 AM", type: "consultation" },
];

const courseStats = [
  { name: "Clinical Cardiology", students: 156, avgProgress: 68, avgScore: 78 },
  { name: "ECG Interpretation", students: 45, avgProgress: 52, avgScore: 74 },
  { name: "Advanced Cardiac Care", students: 33, avgProgress: 35, avgScore: 81 },
];

const pendingTasks = [
  { task: "Grade ECG Interpretation Quiz", count: 12, urgent: true },
  { task: "Review Assignment Submissions", count: 8, urgent: false },
  { task: "Approve Student Enrollments", count: 3, urgent: false },
  { task: "Update Course Materials", count: 1, urgent: false },
];

export default function ProfessorDashboard() {
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-600" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. Smith!</h1>
        <p className="text-gray-500 text-sm">Here's what's happening with your courses today.</p>
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
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
              {stat.change && <p className="text-xs text-gray-400 mt-1">{stat.change}</p>}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Submissions</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentSubmissions.map((submission, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-medium">
                      {submission.student.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{submission.student}</p>
                    <p className="text-sm text-gray-500">{submission.quiz}</p>
                  </div>
                </div>
                <div className="text-right">
                  {submission.needsGrading ? (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                      Needs Grading
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">{submission.score}%</span>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{submission.submitted}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Tasks</h2>
          <div className="space-y-3">
            {pendingTasks.map((task, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  task.urgent ? "bg-red-50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {task.urgent && <AlertCircle className="h-5 w-5 text-red-500" />}
                  <span className={`text-sm ${task.urgent ? "text-red-700 font-medium" : "text-gray-700"}`}>
                    {task.task}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.urgent ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-600"
                }`}>
                  {task.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {upcomingSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    session.type === "class" ? "bg-blue-100" : "bg-emerald-100"
                  }`}>
                    {session.type === "class" ? (
                      <Users className="h-5 w-5 text-blue-600" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{session.student}</p>
                    <p className="text-sm text-gray-500">{session.topic}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session.time}</p>
                  <button className="text-xs text-blue-600 hover:text-blue-700 mt-1">Start</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Course Performance</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Details</button>
          </div>
          <div className="space-y-4">
            {courseStats.map((course) => (
              <div key={course.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{course.name}</p>
                  <span className="text-sm text-gray-500">{course.students} students</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-gray-500">Avg Progress</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${course.avgProgress}%` }} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{course.avgProgress}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Avg Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${course.avgScore}%` }} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{course.avgScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}