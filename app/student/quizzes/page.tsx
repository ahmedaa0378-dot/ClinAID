"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  ChevronRight,
  Search,
  Award,
  Target,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useQuizzes } from "@/hooks/useQuizzes";

export default function QuizzesPage() {
  const router = useRouter();
  const { getStudentAssignments, getStudentResults, loading } = useQuizzes();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [assignmentsData, resultsData] = await Promise.all([
      getStudentAssignments(),
      getStudentResults(),
    ]);
    setAssignments(assignmentsData);
    setResults(resultsData);
  };

  // Transform assignments to quiz format for display
  const quizzesData = assignments.map((assignment) => {
    const result = results.find((r) => r.assignment_id === assignment.id);
    const quiz = assignment.quiz;

    return {
      id: assignment.id,
      quizId: assignment.quiz_id,
      title: quiz?.title || "Quiz",
      topic: quiz?.topic || "Medical Quiz",
      professor: "Professor", // Could fetch professor name if needed
      questions: quiz?.total_questions || 0,
      duration: quiz?.time_limit_minutes ? `${quiz.time_limit_minutes} mins` : "No limit",
      dueDate: assignment.due_date
        ? formatDueDate(assignment.due_date)
        : "No deadline",
      status: assignment.status,
      attempts: 1, // Could track attempts if schema supports it
      maxAttempts: 1,
      passingScore: quiz?.passing_score || 70,
      score: result?.score_percentage,
      passed: result?.passed,
      completedDate: assignment.completed_at
        ? formatCompletedDate(assignment.completed_at)
        : null,
      difficulty: quiz?.difficulty_level || "medium",
    };
  });

  const filteredQuizzes = quizzesData.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" &&
        (quiz.status === "assigned" || quiz.status === "in_progress")) ||
      (activeTab === "completed" && quiz.status === "completed");
    return matchesSearch && matchesTab;
  });

  const pendingCount = quizzesData.filter(
    (q) => q.status === "assigned" || q.status === "in_progress"
  ).length;
  const completedCount = quizzesData.filter((q) => q.status === "completed").length;
  const completedWithScores = quizzesData.filter(
    (q) => q.status === "completed" && q.score !== undefined
  );
  const averageScore =
    completedWithScores.length > 0
      ? Math.round(
          completedWithScores.reduce((acc, q) => acc + (q.score || 0), 0) /
            completedWithScores.length
        )
      : 0;

  function formatDueDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  }

  function formatCompletedDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "assigned":
      case "in_progress":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "expired":
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return <ClipboardList className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (quiz: (typeof quizzesData)[0]) => {
    switch (quiz.status) {
      case "completed":
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              quiz.passed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {quiz.passed
              ? `Passed: ${quiz.score?.toFixed(0)}%`
              : `Failed: ${quiz.score?.toFixed(0)}%`}
          </span>
        );
      case "assigned":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            New
          </span>
        );
      case "in_progress":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
            In Progress
          </span>
        );
      case "expired":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      hard: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
          colors[difficulty] || colors.medium
        }`}
      >
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  const handleStartQuiz = (quiz: (typeof quizzesData)[0]) => {
    router.push(`/student/quizzes/${quiz.quizId}/take?assignment=${quiz.id}`);
  };

  const handleViewResults = (quiz: (typeof quizzesData)[0]) => {
    router.push(`/student/quizzes/${quiz.quizId}/results?assignment=${quiz.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-500 text-sm">
            Test your knowledge and track your progress
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
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
            { id: "pending", label: `Pending (${pendingCount})` },
            { id: "completed", label: `Completed (${completedCount})` },
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

      {/* Loading State */}
      {loading && assignments.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          {/* Quiz List */}
          <div className="space-y-4">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all ${
                  quiz.status === "expired"
                    ? "opacity-60"
                    : "hover:shadow-md hover:border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        quiz.status === "completed"
                          ? "bg-emerald-100"
                          : quiz.status === "expired"
                          ? "bg-gray-100"
                          : "bg-orange-100"
                      }`}
                    >
                      {getStatusIcon(quiz.status)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                        {getDifficultyBadge(quiz.difficulty)}
                      </div>
                      <p className="text-sm text-gray-500">{quiz.topic}</p>
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
                        {quiz.status !== "completed" && quiz.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Due: {quiz.dueDate}</span>
                          </div>
                        )}
                        {quiz.completedDate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Completed: {quiz.completedDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(quiz)}
                    {(quiz.status === "assigned" || quiz.status === "in_progress") && (
                      <button
                        onClick={() => handleStartQuiz(quiz)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        {quiz.status === "in_progress" ? "Continue" : "Start Quiz"}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                    {quiz.status === "completed" && (
                      <button
                        onClick={() => handleViewResults(quiz)}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                      >
                        View Results →
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
              <p className="text-gray-400 text-sm">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Check back later for new assignments"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}