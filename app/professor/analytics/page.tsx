"use client";

import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Clock,
  Award,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const overviewStats = [
  { label: "Total Students", value: "234", change: "+12%", trend: "up", icon: Users, color: "blue" },
  { label: "Course Completion", value: "68%", change: "+5%", trend: "up", icon: Target, color: "emerald" },
  { label: "Avg Quiz Score", value: "76%", change: "-2%", trend: "down", icon: ClipboardList, color: "purple" },
  { label: "Engagement Rate", value: "82%", change: "+8%", trend: "up", icon: TrendingUp, color: "orange" },
];

const coursePerformance = [
  { name: "Clinical Cardiology", students: 156, completion: 72, avgScore: 78, engagement: 85 },
  { name: "ECG Interpretation", students: 45, completion: 58, avgScore: 74, engagement: 79 },
  { name: "Advanced Cardiac Care", students: 33, completion: 45, avgScore: 81, engagement: 72 },
];

const quizPerformance = [
  { name: "Cardiac Anatomy Quiz", attempts: 145, avgScore: 78, passRate: 82, difficulty: "Medium" },
  { name: "ECG Interpretation", attempts: 89, avgScore: 72, passRate: 75, difficulty: "Hard" },
  { name: "Cardiac Physiology", attempts: 156, avgScore: 85, passRate: 91, difficulty: "Easy" },
  { name: "Clinical Assessment", attempts: 67, avgScore: 68, passRate: 71, difficulty: "Hard" },
  { name: "Case Study Analysis", attempts: 45, avgScore: 74, passRate: 78, difficulty: "Medium" },
];

const weeklyActivity = [
  { day: "Mon", views: 245, quizzes: 32, sessions: 4 },
  { day: "Tue", views: 312, quizzes: 45, sessions: 6 },
  { day: "Wed", views: 287, quizzes: 38, sessions: 5 },
  { day: "Thu", views: 356, quizzes: 52, sessions: 8 },
  { day: "Fri", views: 298, quizzes: 41, sessions: 3 },
  { day: "Sat", views: 124, quizzes: 18, sessions: 1 },
  { day: "Sun", views: 98, quizzes: 12, sessions: 0 },
];

const topStudents = [
  { name: "Emily Brown", avatar: "EB", progress: 92, avgScore: 94, rank: 1 },
  { name: "Jane Smith", avatar: "JS", progress: 88, avgScore: 91, rank: 2 },
  { name: "John Doe", avatar: "JD", progress: 85, avgScore: 87, rank: 3 },
  { name: "Sarah Davis", avatar: "SD", progress: 82, avgScore: 85, rank: 4 },
  { name: "Chris Miller", avatar: "CM", progress: 78, avgScore: 82, rank: 5 },
];

const atRiskStudents = [
  { name: "David Wilson", avatar: "DW", progress: 28, lastActive: "1 week ago", issue: "Low progress" },
  { name: "Lisa Anderson", avatar: "LA", progress: 38, lastActive: "4 days ago", issue: "Failing quizzes" },
  { name: "Mike Johnson", avatar: "MJ", progress: 45, lastActive: "3 days ago", issue: "Inactive" },
];

const contentEngagement = [
  { type: "Videos", views: 2456, avgTime: "18 min", completion: 72 },
  { type: "PDFs", views: 1823, avgTime: "12 min", completion: 65 },
  { type: "Documents", views: 987, avgTime: "8 min", completion: 58 },
  { type: "Quizzes", views: 1245, avgTime: "25 min", completion: 89 },
];

export default function AnalyticsPage() {
  const maxViews = Math.max(...weeklyActivity.map((d) => d.views));

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-600" },
    };
    return colors[color] || colors.blue;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm">Track student performance and engagement metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">Export</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h2>
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyActivity.map((data) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-36">
                  <span className="text-xs text-gray-600 mb-1">{data.views}</span>
                  <div
                    className="w-full bg-blue-500 rounded-t-md"
                    style={{ height: `${(data.views / maxViews) * 100}%`, minHeight: "8px" }}
                  />
                </div>
                <span className="text-xs text-gray-500">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900">1,720</p>
              <p className="text-xs text-gray-500">Total Views</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">238</p>
              <p className="text-xs text-gray-500">Quiz Attempts</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">27</p>
              <p className="text-xs text-gray-500">Sessions</p>
            </div>
          </div>
        </div>

        {/* Content Engagement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Engagement</h2>
          <div className="space-y-4">
            {contentEngagement.map((content) => (
              <div key={content.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{content.type}</span>
                  <span className="text-sm text-gray-500">{content.views} views</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${content.completion}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Avg time: {content.avgTime}</span>
                  <span>{content.completion}% completion</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course & Quiz Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h2>
          <div className="space-y-4">
            {coursePerformance.map((course) => (
              <div key={course.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{course.name}</h3>
                  <span className="text-sm text-gray-500">{course.students} students</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Completion</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${course.completion}%` }} />
                      </div>
                      <span className="text-sm font-medium">{course.completion}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Avg Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${course.avgScore}%` }} />
                      </div>
                      <span className="text-sm font-medium">{course.avgScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Engagement</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${course.engagement}%` }} />
                      </div>
                      <span className="text-sm font-medium">{course.engagement}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quiz Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-3 text-sm font-medium text-gray-500">Quiz</th>
                  <th className="text-center pb-3 text-sm font-medium text-gray-500">Attempts</th>
                  <th className="text-center pb-3 text-sm font-medium text-gray-500">Avg Score</th>
                  <th className="text-center pb-3 text-sm font-medium text-gray-500">Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {quizPerformance.map((quiz) => (
                  <tr key={quiz.name} className="border-b border-gray-100 last:border-0">
                    <td className="py-3">
                      <p className="text-sm font-medium text-gray-900">{quiz.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        quiz.difficulty === "Easy" ? "bg-emerald-100 text-emerald-700" :
                        quiz.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td className="py-3 text-center text-sm text-gray-700">{quiz.attempts}</td>
                    <td className="py-3 text-center text-sm font-medium text-gray-900">{quiz.avgScore}%</td>
                    <td className="py-3 text-center">
                      <span className={`text-sm font-medium ${
                        quiz.passRate >= 80 ? "text-emerald-600" :
                        quiz.passRate >= 60 ? "text-yellow-600" :
                        "text-red-600"
                      }`}>
                        {quiz.passRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Students Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h2>
          <div className="space-y-3">
            {topStudents.map((student) => (
              <div key={student.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getRankBadge(student.rank)}</span>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-700 font-medium text-sm">{student.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.progress}% progress</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{student.avgScore}%</p>
                  <p className="text-xs text-gray-500">Avg Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* At-Risk Students */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">At-Risk Students</h2>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              {atRiskStudents.length} students
            </span>
          </div>
          <div className="space-y-3">
            {atRiskStudents.map((student) => (
              <div key={student.name} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-700 font-medium text-sm">{student.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-red-600">{student.issue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{student.progress}%</p>
                  <p className="text-xs text-gray-500">{student.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All At-Risk Students
          </button>
        </div>
      </div>
    </div>
  );
}