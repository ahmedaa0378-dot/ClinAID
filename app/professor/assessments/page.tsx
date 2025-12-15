"use client";

import { useState } from "react";
import { ClipboardList, Plus, Search, Filter, Clock, Users, CheckCircle, AlertCircle, MoreVertical, Edit, Trash2, Eye, BarChart3 } from "lucide-react";

const assessments = [
  { id: 1, title: "Cardiology Midterm Exam", course: "Clinical Cardiology", type: "exam", questions: 50, duration: "90 min", submissions: 42, pending: 3, avgScore: 78, status: "active", dueDate: "Dec 20, 2024" },
  { id: 2, title: "Pediatrics Case Study", course: "Advanced Pediatrics", type: "assignment", questions: 5, duration: "7 days", submissions: 35, pending: 3, avgScore: 82, status: "active", dueDate: "Dec 18, 2024" },
  { id: 3, title: "Neurology Quiz 3", course: "Neurology Fundamentals", type: "quiz", questions: 20, duration: "30 min", submissions: 50, pending: 2, avgScore: 75, status: "completed", dueDate: "Dec 10, 2024" },
  { id: 4, title: "Emergency Response Practical", course: "Emergency Medicine", type: "practical", questions: 10, duration: "60 min", submissions: 0, pending: 60, avgScore: 0, status: "draft", dueDate: "Dec 25, 2024" },
];

export default function ProfessorAssessmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredAssessments = assessments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || a.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "exam": return "bg-red-100 text-red-700";
      case "quiz": return "bg-blue-100 text-blue-700";
      case "assignment": return "bg-purple-100 text-purple-700";
      case "practical": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "completed": return "bg-gray-100 text-gray-700";
      case "draft": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
          <p className="text-gray-500">Create and manage quizzes, exams, and assignments</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-5 w-5" />
          Create Assessment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Assessments", value: "4", icon: ClipboardList, color: "blue" },
          { label: "Pending Reviews", value: "8", icon: Clock, color: "yellow" },
          { label: "Completed", value: "127", icon: CheckCircle, color: "green" },
          { label: "Avg. Score", value: "78%", icon: BarChart3, color: "purple" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center mb-3`}>
              <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="exam">Exams</option>
          <option value="quiz">Quizzes</option>
          <option value="assignment">Assignments</option>
          <option value="practical">Practicals</option>
        </select>
      </div>

      {/* Assessments Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Assessment</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Submissions</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Avg. Score</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Due Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssessments.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{assessment.title}</p>
                      <p className="text-sm text-gray-500">{assessment.course}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(assessment.type)}`}>
                      {assessment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{assessment.submissions}</span>
                      {assessment.pending > 0 && (
                        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">{assessment.pending} pending</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{assessment.avgScore > 0 ? `${assessment.avgScore}%` : "-"}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{assessment.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(assessment.status)}`}>
                      {assessment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg"><Eye className="h-4 w-4 text-gray-500" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="h-4 w-4 text-gray-500" /></button>
                      <button className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
