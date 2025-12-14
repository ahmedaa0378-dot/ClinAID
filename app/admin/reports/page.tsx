"use client";

import { useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  FileText,
  Filter,
  RefreshCw,
  Clock,
  Target,
  Award,
  AlertCircle,
} from "lucide-react";

const overviewStats = [
  { label: "Total Enrollment", value: "1,247", change: "+12%", trend: "up", icon: Users },
  { label: "Course Completion", value: "68%", change: "+5%", trend: "up", icon: Target },
  { label: "Avg Quiz Score", value: "76%", change: "-2%", trend: "down", icon: Award },
  { label: "Active Users (30d)", value: "892", change: "+18%", trend: "up", icon: TrendingUp },
];

const departmentPerformance = [
  { name: "Cardiology", students: 245, completion: 72, avgScore: 78, atRisk: 12 },
  { name: "Neurology", students: 189, completion: 68, avgScore: 74, atRisk: 18 },
  { name: "Pediatrics", students: 203, completion: 75, avgScore: 82, atRisk: 8 },
  { name: "Orthopedics", students: 156, completion: 70, avgScore: 76, atRisk: 14 },
  { name: "Oncology", students: 134, completion: 65, avgScore: 71, atRisk: 16 },
  { name: "Psychiatry", students: 112, completion: 71, avgScore: 79, atRisk: 6 },
];

const monthlyEnrollment = [
  { month: "Jul", value: 45 },
  { month: "Aug", value: 128 },
  { month: "Sep", value: 312 },
  { month: "Oct", value: 89 },
  { month: "Nov", value: 156 },
  { month: "Dec", value: 78 },
];

const coursePopularity = [
  { name: "Clinical Cardiology", enrolled: 156, completion: 72, rating: 4.8 },
  { name: "Pediatric Care", enrolled: 142, completion: 75, rating: 4.7 },
  { name: "Advanced Neurology", enrolled: 128, completion: 68, rating: 4.6 },
  { name: "ECG Interpretation", enrolled: 118, completion: 82, rating: 4.9 },
  { name: "Orthopedic Basics", enrolled: 98, completion: 70, rating: 4.5 },
];

const savedReports = [
  { id: 1, name: "Monthly Enrollment Summary", type: "Enrollment", lastRun: "Dec 10, 2024", schedule: "Monthly" },
  { id: 2, name: "Department Performance Q4", type: "Performance", lastRun: "Dec 8, 2024", schedule: "Quarterly" },
  { id: 3, name: "At-Risk Students Alert", type: "Students", lastRun: "Dec 12, 2024", schedule: "Weekly" },
  { id: 4, name: "Course Completion Rates", type: "Courses", lastRun: "Dec 5, 2024", schedule: "Monthly" },
];

const reportTypes = [
  { id: "enrollment", name: "Enrollment Report", description: "Student enrollment trends and demographics", icon: Users },
  { id: "performance", name: "Performance Report", description: "Quiz scores, completion rates, progress", icon: Target },
  { id: "engagement", name: "Engagement Report", description: "Login frequency, time spent, activity", icon: TrendingUp },
  { id: "course", name: "Course Analytics", description: "Course popularity, ratings, completion", icon: BookOpen },
  { id: "faculty", name: "Faculty Report", description: "Professor performance and ratings", icon: GraduationCap },
  { id: "atrisk", name: "At-Risk Students", description: "Students needing intervention", icon: AlertCircle },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");

  const maxEnrollment = Math.max(...monthlyEnrollment.map((m) => m.value));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm">Comprehensive insights into your institution's performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Icon className="h-6 w-6 text-purple-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
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
        {/* Enrollment Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Enrollment Trend</h2>
            <button className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
          <div className="flex items-end justify-between gap-4 h-48">
            {monthlyEnrollment.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-36">
                  <span className="text-xs text-gray-600 mb-1">{data.value}</span>
                  <div
                    className="w-full bg-purple-500 rounded-t-md hover:bg-purple-600 transition-colors"
                    style={{ height: `${(data.value / maxEnrollment) * 100}%`, minHeight: "8px" }}
                  />
                </div>
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">808</p>
              <p className="text-xs text-gray-500">Total This Period</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">+24%</p>
              <p className="text-xs text-gray-500">vs Previous Period</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">135</p>
              <p className="text-xs text-gray-500">Avg Monthly</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h2>
          <div className="space-y-3">
            {reportTypes.slice(0, 4).map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => {
                    setSelectedReportType(report.id);
                    setShowGenerateModal(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Department Performance</h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="all">All Departments</option>
              {departmentPerformance.map((dept) => (
                <option key={dept.name} value={dept.name}>{dept.name}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left pb-3 text-sm font-medium text-gray-500">Department</th>
                <th className="text-center pb-3 text-sm font-medium text-gray-500">Students</th>
                <th className="text-center pb-3 text-sm font-medium text-gray-500">Completion Rate</th>
                <th className="text-center pb-3 text-sm font-medium text-gray-500">Avg Score</th>
                <th className="text-center pb-3 text-sm font-medium text-gray-500">At-Risk</th>
              </tr>
            </thead>
            <tbody>
              {departmentPerformance.map((dept) => (
                <tr key={dept.name} className="border-b border-gray-100 last:border-0">
                  <td className="py-4">
                    <span className="font-medium text-gray-900">{dept.name}</span>
                  </td>
                  <td className="py-4 text-center text-gray-700">{dept.students}</td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dept.completion >= 70 ? "bg-emerald-500" : "bg-yellow-500"
                          }`}
                          style={{ width: `${dept.completion}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{dept.completion}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dept.avgScore >= 75 ? "bg-blue-500" : "bg-orange-500"
                          }`}
                          style={{ width: `${dept.avgScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{dept.avgScore}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      dept.atRisk > 15 ? "bg-red-100 text-red-700" :
                      dept.atRisk > 10 ? "bg-orange-100 text-orange-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>
                      {dept.atRisk} students
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Popularity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Courses</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700">View All</button>
          </div>
          <div className="space-y-4">
            {coursePopularity.map((course, index) => (
              <div key={course.name} className="flex items-center gap-4">
                <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-xs">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{course.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-700">{course.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{course.enrolled} enrolled</span>
                    <span>{course.completion}% completion</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Saved Reports</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700">Manage</button>
          </div>
          <div className="space-y-3">
            {savedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.schedule}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <RefreshCw className="h-4 w-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <Download className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Generate Report</h3>
              <button
                onClick={() => {
                  setShowGenerateModal(false);
                  setSelectedReportType("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-gray-500">✕</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
                <select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="">Select report type</option>
                  {reportTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range *</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                  <option value="all">All Departments</option>
                  {departmentPerformance.map((dept) => (
                    <option key={dept.name} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <div className="flex gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="format" value="pdf" defaultChecked className="text-purple-600" />
                    <span className="text-sm text-gray-700">PDF</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="format" value="excel" className="text-purple-600" />
                    <span className="text-sm text-gray-700">Excel</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="format" value="csv" className="text-purple-600" />
                    <span className="text-sm text-gray-700">CSV</span>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-2 mb-3">
                  <input type="checkbox" className="rounded border-gray-300 text-purple-600" />
                  <span className="text-sm text-gray-700">Schedule this report</span>
                </label>
                <select
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white disabled:opacity-50"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600" />
                <span className="text-sm text-gray-700">Send copy to my email</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowGenerateModal(false);
                  setSelectedReportType("");
                }}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                <Download className="h-4 w-4" />
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}