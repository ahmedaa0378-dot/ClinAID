"use client";

import { useState } from "react";
import { ClipboardList, Clock, CheckCircle, AlertCircle, Play, Eye, Award, TrendingUp, Calendar } from "lucide-react";

const assessments = [
  { id: 1, title: "Cardiology Midterm Exam", course: "Clinical Cardiology", type: "exam", questions: 50, duration: "90 min", status: "upcoming", dueDate: "Dec 20, 2024", score: null },
  { id: 2, title: "Pediatrics Case Study", course: "Advanced Pediatrics", type: "assignment", questions: 5, duration: "7 days", status: "in-progress", dueDate: "Dec 18, 2024", score: null, progress: 60 },
  { id: 3, title: "Neurology Quiz 2", course: "Neurology Fundamentals", type: "quiz", questions: 20, duration: "30 min", status: "completed", dueDate: "Dec 10, 2024", score: 85 },
  { id: 4, title: "Anatomy Practical", course: "Human Anatomy", type: "practical", questions: 10, duration: "60 min", status: "completed", dueDate: "Dec 5, 2024", score: 92 },
  { id: 5, title: "Pharmacology Quiz 3", course: "Clinical Pharmacology", type: "quiz", questions: 15, duration: "20 min", status: "missed", dueDate: "Dec 8, 2024", score: 0 },
];

export default function StudentAssessmentsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "completed">("all");

  const filteredAssessments = assessments.filter(a => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return ["upcoming", "in-progress"].includes(a.status);
    if (activeTab === "completed") return ["completed", "missed"].includes(a.status);
    return true;
  });

  const getStatusBadge = (status: string, score?: number | null) => {
    switch (status) {
      case "upcoming": return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Upcoming</span>;
      case "in-progress": return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">In Progress</span>;
      case "completed": return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Score: {score}%</span>;
      case "missed": return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Missed</span>;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "exam": return "bg-red-100 text-red-700";
      case "quiz": return "bg-blue-100 text-blue-700";
      case "assignment": return "bg-purple-100 text-purple-700";
      case "practical": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Assessments</h1>
        <p className="text-gray-500">Track your quizzes, exams, and assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Upcoming", value: "2", icon: Clock, color: "blue" },
          { label: "Completed", value: "2", icon: CheckCircle, color: "green" },
          { label: "Average Score", value: "88%", icon: TrendingUp, color: "purple" },
          { label: "Best Score", value: "92%", icon: Award, color: "yellow" },
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {[
            { id: "all", label: "All" },
            { id: "upcoming", label: "Upcoming" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === tab.id ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assessments List */}
      <div className="space-y-4">
        {filteredAssessments.map((assessment) => (
          <div key={assessment.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  assessment.type === "exam" ? "bg-red-100" :
                  assessment.type === "quiz" ? "bg-blue-100" :
                  assessment.type === "assignment" ? "bg-purple-100" : "bg-orange-100"
                }`}>
                  <ClipboardList className={`h-6 w-6 ${
                    assessment.type === "exam" ? "text-red-600" :
                    assessment.type === "quiz" ? "text-blue-600" :
                    assessment.type === "assignment" ? "text-purple-600" : "text-orange-600"
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{assessment.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getTypeColor(assessment.type)}`}>
                      {assessment.type}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{assessment.course}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><ClipboardList className="h-4 w-4" />{assessment.questions} questions</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{assessment.duration}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Due: {assessment.dueDate}</span>
                  </div>
                  {assessment.status === "in-progress" && assessment.progress && (
                    <div className="mt-3 w-48">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium">{assessment.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${assessment.progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(assessment.status, assessment.score)}
                {assessment.status === "upcoming" && (
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start
                  </button>
                )}
                {assessment.status === "in-progress" && (
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Continue
                  </button>
                )}
                {assessment.status === "completed" && (
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
