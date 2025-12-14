"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Mail,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Download,
  UserPlus,
} from "lucide-react";

const studentsData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@medical.edu",
    avatar: "JD",
    course: "Clinical Cardiology",
    progress: 75,
    quizAvg: 85,
    lastActive: "2 hours ago",
    status: "active",
    trend: "up",
    enrolled: "Sep 15, 2024",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@medical.edu",
    avatar: "JS",
    course: "Clinical Cardiology",
    progress: 82,
    quizAvg: 91,
    lastActive: "1 hour ago",
    status: "active",
    trend: "up",
    enrolled: "Sep 10, 2024",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@medical.edu",
    avatar: "MJ",
    course: "ECG Interpretation",
    progress: 45,
    quizAvg: 68,
    lastActive: "3 days ago",
    status: "inactive",
    trend: "down",
    enrolled: "Sep 20, 2024",
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily.b@medical.edu",
    avatar: "EB",
    course: "Clinical Cardiology",
    progress: 92,
    quizAvg: 94,
    lastActive: "30 mins ago",
    status: "active",
    trend: "up",
    enrolled: "Sep 5, 2024",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@medical.edu",
    avatar: "DW",
    course: "Advanced Cardiac Care",
    progress: 28,
    quizAvg: 72,
    lastActive: "1 week ago",
    status: "inactive",
    trend: "down",
    enrolled: "Oct 1, 2024",
  },
  {
    id: 6,
    name: "Sarah Davis",
    email: "sarah.d@medical.edu",
    avatar: "SD",
    course: "Clinical Cardiology",
    progress: 60,
    quizAvg: 78,
    lastActive: "5 hours ago",
    status: "active",
    trend: "up",
    enrolled: "Sep 12, 2024",
  },
  {
    id: 7,
    name: "Chris Miller",
    email: "chris.m@medical.edu",
    avatar: "CM",
    course: "ECG Interpretation",
    progress: 55,
    quizAvg: 75,
    lastActive: "Yesterday",
    status: "active",
    trend: "up",
    enrolled: "Sep 25, 2024",
  },
  {
    id: 8,
    name: "Lisa Anderson",
    email: "lisa.a@medical.edu",
    avatar: "LA",
    course: "Clinical Cardiology",
    progress: 38,
    quizAvg: 65,
    lastActive: "4 days ago",
    status: "at-risk",
    trend: "down",
    enrolled: "Sep 18, 2024",
  },
];

const pendingApprovals = [
  { id: 101, name: "Alex Turner", email: "alex.t@medical.edu", course: "Clinical Cardiology", requestDate: "Today" },
  { id: 102, name: "Maria Garcia", email: "maria.g@medical.edu", course: "ECG Interpretation", requestDate: "Yesterday" },
  { id: 103, name: "Tom Harris", email: "tom.h@medical.edu", course: "Advanced Cardiac Care", requestDate: "2 days ago" },
];

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === "all" || student.course === selectedCourse;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && student.status === "active") ||
      (activeTab === "inactive" && student.status === "inactive") ||
      (activeTab === "at-risk" && student.status === "at-risk");
    return matchesSearch && matchesCourse && matchesTab;
  });

  const activeCount = studentsData.filter((s) => s.status === "active").length;
  const inactiveCount = studentsData.filter((s) => s.status === "inactive").length;
  const atRiskCount = studentsData.filter((s) => s.status === "at-risk").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
          <p className="text-gray-500 text-sm">Manage and monitor your enrolled students</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingApprovals.length > 0 && (
            <button
              onClick={() => setShowApprovalModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span className="font-medium">{pendingApprovals.length} Pending</span>
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-gray-900">{studentsData.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Inactive</p>
          <p className="text-2xl font-bold text-gray-600">{inactiveCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">At Risk</p>
          <p className="text-2xl font-bold text-red-600">{atRiskCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Courses</option>
            <option value="Clinical Cardiology">Clinical Cardiology</option>
            <option value="ECG Interpretation">ECG Interpretation</option>
            <option value="Advanced Cardiac Care">Advanced Cardiac Care</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {[
            { id: "all", label: "All Students" },
            { id: "active", label: "Active" },
            { id: "inactive", label: "Inactive" },
            { id: "at-risk", label: "At Risk" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Course</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Progress</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Quiz Avg</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Last Active</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-medium text-sm">{student.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{student.course}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900">{student.quizAvg}%</span>
                      {student.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{student.lastActive}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : student.status === "at-risk"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {student.status === "at-risk" ? "At Risk" : student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Mail className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-500 font-medium">No students found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Pending Approvals</h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              {pendingApprovals.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-700 font-medium text-sm">
                        {request.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request.name}</p>
                      <p className="text-sm text-gray-500">{request.course}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowApprovalModal(false)}
              className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}