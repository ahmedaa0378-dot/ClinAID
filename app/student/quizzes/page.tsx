"use client";

import { useState } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  ChevronRight,
  Search,
  Filter,
  Award,
  Target,
  Calendar,
} from "lucide-react";

const quizzesData = [
  {
    id: 1,
    title: "Cardiac Anatomy Quiz",
    course: "Clinical Cardiology",
    professor: "Dr. Sarah Smith",
    questions: 20,
    duration: "30 mins",
    dueDate: "Tomorrow",
    status: "pending",
    attempts: 0,
    maxAttempts: 2,
    passingScore: 70,
  },
  {
    id: 2,
    title: "Cardiac Physiology Assessment",
    course: "Clinical Cardiology",
    professor: "Dr. Sarah Smith",
    questions: 25,
    duration: "45 mins",
    dueDate: "In 3 days",
    status: "pending",
    attempts: 0,
    maxAttempts: 1,
    passingScore: 75,
  },
  {
    id: 3,
    title: "Child Development Basics",
    course: "Pediatrics Fundamentals",
    professor: "Dr. Michael Johnson",
    questions: 15,
    duration: "20 mins",
    dueDate: "In 5 days",
    status: "pending",
    attempts: 0,
    maxAttempts: 3,
    passingScore: 60,
  },
  {
    id: 4,
    title: "Introduction to Cardiology",
    course: "Clinical Cardiology",
    professor: "Dr. Sarah Smith",
    questions: 15,
    duration: "25 mins",
    completedDate: "2 days ago",
    status: "completed",
    attempts: 1,
    maxAttempts: 2,
    passingScore: 70,
    score: 85,
    passed: true,
  },
  {
    id: 5,
    title: "Anatomy Basics",
    course: "Human Anatomy",
    professor: "Dr. Emily Davis",
    questions: 30,
    duration: "40 mins",
    completedDate: "1 week ago",
    status: "completed",
    attempts: 2,
    maxAttempts: 2,
    passingScore: 70,
    score: 72,
    passed: true,
  },
  {
    id: 6,
    title: "Neurological Assessment",
    course: "Neurology Basics",
    professor: "Dr. Robert Wilson",
    questions: 20,
    duration: "30 mins",
    dueDate: "Locked",
    status: "locked",
    attempts: 0,
    maxAttempts: 2,
    passingScore: 70,
    lockReason: "Complete previous lessons first",
  },
];

export default function QuizzesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuizzes = quizzesData.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && quiz.status === "pending") ||
      (activeTab === "completed" && quiz.status === "completed");
    return matchesSearch && matchesTab;
  });

  const pendingCount = quizzesData.filter((q) => q.status === "pending").length;
  const completedCount = quizzesData.filter((q) => q.status === "completed").length;
  const averageScore = Math.round(
    quizzesData
      .filter((q) => q.status === "completed" && q.score)
      .reduce((acc, q) => acc + (q.score || 0), 0) /
      quizzesData.filter((q) => q.status === "completed").length
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "locked":
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return <ClipboardList className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (quiz: typeof quizzesData[0]) => {
    switch (quiz.status) {
      case "completed":
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            quiz.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          }`}>
            {quiz.passed ? `Passed: ${quiz.score}%` : `Failed: ${quiz.score}%`}
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
            Due: {quiz.dueDate}
          </span>
        );
      case "locked":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
            Locked
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-500 text-sm">Test your knowledge and track your progress</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Quizzes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{averageScore}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {[
            { id: "all", label: "All Quizzes" },
            { id: "pending", label: "Pending" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz List */}
      <div className="space-y-4">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all ${
              quiz.status === "locked" ? "opacity-60" : "hover:shadow-md hover:border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  quiz.status === "completed" 
                    ? "bg-emerald-100" 
                    : quiz.status === "locked"
                    ? "bg-gray-100"
                    : "bg-orange-100"
                }`}>
                  {getStatusIcon(quiz.status)}
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                  <p className="text-sm text-gray-500">{quiz.course} • {quiz.professor}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <ClipboardList className="h-3.5 w-3.5" />
                      <span>{quiz.questions} questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{quiz.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3.5 w-3.5" />
                      <span>Pass: {quiz.passingScore}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Attempts: {quiz.attempts}/{quiz.maxAttempts}</span>
                    </div>
                  </div>
                  {quiz.status === "locked" && quiz.lockReason && (
                    <p className="text-xs text-gray-400 mt-2 italic">{quiz.lockReason}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {getStatusBadge(quiz)}
                {quiz.status === "pending" && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                    Start Quiz
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
                {quiz.status === "completed" && quiz.attempts < quiz.maxAttempts && (
                  <button className="flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-colors">
                    Retry Quiz
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
                {quiz.status === "completed" && (
                  <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    View Results
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-500 font-medium">No quizzes found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}