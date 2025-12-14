"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  FileText,
  Clock,
  Users,
  BarChart3,
  Edit,
  Trash2,
  Copy,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Target,
  TrendingUp,
} from "lucide-react";

const quizzesData = [
  {
    id: 1,
    title: "Cardiac Anatomy Basics",
    course: "Clinical Cardiology",
    questions: 20,
    duration: 30,
    attempts: 145,
    avgScore: 78,
    passingScore: 70,
    status: "published",
    dueDate: "Dec 20, 2024",
    createdAt: "Nov 15, 2024",
  },
  {
    id: 2,
    title: "ECG Interpretation Quiz",
    course: "Clinical Cardiology",
    questions: 15,
    duration: 25,
    attempts: 132,
    avgScore: 72,
    passingScore: 70,
    status: "published",
    dueDate: "Dec 22, 2024",
    createdAt: "Nov 20, 2024",
  },
  {
    id: 3,
    title: "Heart Failure Management",
    course: "Advanced Cardiac Care",
    questions: 25,
    duration: 40,
    attempts: 0,
    avgScore: 0,
    passingScore: 75,
    status: "draft",
    dueDate: null,
    createdAt: "Dec 10, 2024",
  },
  {
    id: 4,
    title: "Arrhythmia Recognition",
    course: "Clinical Cardiology",
    questions: 18,
    duration: 30,
    attempts: 98,
    avgScore: 81,
    passingScore: 70,
    status: "published",
    dueDate: "Dec 18, 2024",
    createdAt: "Nov 25, 2024",
  },
  {
    id: 5,
    title: "Cardiac Pharmacology",
    course: "Advanced Cardiac Care",
    questions: 30,
    duration: 45,
    attempts: 0,
    avgScore: 0,
    passingScore: 75,
    status: "scheduled",
    dueDate: "Jan 5, 2025",
    createdAt: "Dec 5, 2024",
  },
];

const questionTypes = [
  { type: "multiple_choice", label: "Multiple Choice", count: 45 },
  { type: "true_false", label: "True/False", count: 22 },
  { type: "fill_blank", label: "Fill in the Blank", count: 15 },
  { type: "matching", label: "Matching", count: 8 },
];

export default function ProfessorQuizzesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<typeof quizzesData[0] | null>(null);

  const filteredQuizzes = quizzesData.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" ||
      (activeTab === "published" && quiz.status === "published") ||
      (activeTab === "draft" && quiz.status === "draft") ||
      (activeTab === "scheduled" && quiz.status === "scheduled");
    return matchesSearch && matchesTab;
  });

  const totalQuizzes = quizzesData.length;
  const publishedCount = quizzesData.filter(q => q.status === "published").length;
  const totalAttempts = quizzesData.reduce((acc, q) => acc + q.attempts, 0);
  const avgScore = Math.round(quizzesData.filter(q => q.attempts > 0).reduce((acc, q) => acc + q.avgScore, 0) / quizzesData.filter(q => q.attempts > 0).length);

  const handleViewQuiz = (quiz: typeof quizzesData[0]) => {
    setSelectedQuiz(quiz);
    setShowViewModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-emerald-100 text-emerald-700";
      case "draft": return "bg-gray-100 text-gray-600";
      case "scheduled": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-500 text-sm">Create and manage assessments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Quiz</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalQuizzes}</p>
              <p className="text-sm text-gray-500">Total Quizzes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
              <p className="text-sm text-gray-500">Published</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalAttempts}</p>
              <p className="text-sm text-gray-500">Total Attempts</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
              <p className="text-sm text-gray-500">Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {[
            { id: "all", label: "All Quizzes" },
            { id: "published", label: "Published" },
            { id: "draft", label: "Drafts" },
            { id: "scheduled", label: "Scheduled" },
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
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                <p className="text-sm text-gray-500">{quiz.course}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quiz.status)}`}>
                {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{quiz.questions}</p>
                <p className="text-xs text-gray-500">Questions</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{quiz.duration}</p>
                <p className="text-xs text-gray-500">Minutes</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{quiz.attempts}</p>
                <p className="text-xs text-gray-500">Attempts</p>
              </div>
            </div>

            {quiz.status === "published" && quiz.attempts > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Avg Score</span>
                  <span className="text-xs font-medium text-gray-700">{quiz.avgScore}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${quiz.avgScore >= quiz.passingScore ? "bg-emerald-500" : "bg-orange-500"}`}
                    style={{ width: `${quiz.avgScore}%` }}
                  />
                </div>
              </div>
            )}

            {quiz.dueDate && (
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Due: {quiz.dueDate}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleViewQuiz(quiz)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="h-4 w-4" />
                View
              </button>
              <button className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-500 font-medium">No quizzes found</h3>
          <p className="text-gray-400 text-sm">Create your first quiz to get started</p>
        </div>
      )}

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Quiz</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
                <input
                  type="text"
                  placeholder="Enter quiz title"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select course</option>
                  <option value="cardiology">Clinical Cardiology</option>
                  <option value="cardiac-care">Advanced Cardiac Care</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                  <input
                    type="number"
                    placeholder="30"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%) *</label>
                  <input
                    type="number"
                    placeholder="70"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Quiz description..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Next step:</strong> After creating the quiz, you'll be able to add questions.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Create Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Quiz Modal */}
      {showViewModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Quiz Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">{selectedQuiz.title}</h4>
              <p className="text-gray-500">{selectedQuiz.course}</p>
              <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedQuiz.status)}`}>
                {selectedQuiz.status.charAt(0).toUpperCase() + selectedQuiz.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Questions</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{selectedQuiz.questions}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Duration</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{selectedQuiz.duration} min</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Attempts</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{selectedQuiz.attempts}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Avg Score</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{selectedQuiz.avgScore}%</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Passing Score</span>
                <span className="font-medium text-gray-900">{selectedQuiz.passingScore}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Created</span>
                <span className="font-medium text-gray-900">{selectedQuiz.createdAt}</span>
              </div>
              {selectedQuiz.dueDate && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Due Date</span>
                  <span className="font-medium text-gray-900">{selectedQuiz.dueDate}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}