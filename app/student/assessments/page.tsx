"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Clock,
  CheckCircle2,
  TrendingUp,
  Trophy,
  FileText,
  Calendar,
  Play,
  Loader2,
  ClipboardList,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AssessmentAssignment {
  id: string;
  assessment_id: string;
  status: string;
  score: number | null;
  percentage: number | null;
  started_at: string | null;
  completed_at: string | null;
  assessment: {
    id: string;
    title: string;
    description: string;
    type: string;
    duration_minutes: number;
    total_points: number;
    passing_score: number;
    due_date: string | null;
    status: string;
    course: {
      title: string;
      code: string;
    } | null;
  };
  question_count?: number;
  answered_count?: number;
}

export default function StudentAssessmentsPage() {
  const router = useRouter();

  const [assignments, setAssignments] = useState<AssessmentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      let sId = user?.id;

      if (!sId) {
        const { data: anyStudent } = await supabase
          .from("users")
          .select("id")
          .eq("role", "student")
          .limit(1)
          .single();
        sId = anyStudent?.id;
      }

      setStudentId(sId || null);

      if (sId) {
        // Fetch assessment assignments with assessment and course details
        const { data: assignmentsData, error } = await supabase
          .from("assessment_assignments")
          .select(`
            *,
            assessment:assessments(
              id,
              title,
              description,
              type,
              duration_minutes,
              total_points,
              passing_score,
              due_date,
              status,
              course:courses(title, code)
            )
          `)
          .eq("student_id", sId)
          .order("assigned_at", { ascending: false });

        if (error) throw error;

        // Get question counts for each assessment
        const assignmentsWithCounts = await Promise.all(
          (assignmentsData || []).map(async (assignment) => {
            // Count total questions
            const { count: questionCount } = await supabase
              .from("assessment_questions")
              .select("id", { count: "exact", head: true })
              .eq("assessment_id", assignment.assessment_id);

            // Count answered questions
            const { count: answeredCount } = await supabase
              .from("assessment_responses")
              .select("id", { count: "exact", head: true })
              .eq("assignment_id", assignment.id);

            return {
              ...assignment,
              question_count: questionCount || 0,
              answered_count: answeredCount || 0,
            };
          })
        );

        setAssignments(assignmentsWithCounts);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter assignments by tab
  const filteredAssignments = assignments.filter((a) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return a.status === "assigned" || a.status === "in_progress";
    if (activeTab === "completed") return a.status === "completed" || a.status === "graded";
    return true;
  });

  // Stats
  const upcomingCount = assignments.filter(
    (a) => a.status === "assigned" || a.status === "in_progress"
  ).length;
  const completedCount = assignments.filter(
    (a) => a.status === "completed" || a.status === "graded"
  ).length;
  const completedWithScores = assignments.filter(
    (a) => (a.status === "completed" || a.status === "graded") && a.percentage !== null
  );
  const avgScore =
    completedWithScores.length > 0
      ? Math.round(
          completedWithScores.reduce((acc, a) => acc + (a.percentage || 0), 0) /
            completedWithScores.length
        )
      : 0;
  const bestScore =
    completedWithScores.length > 0
      ? Math.max(...completedWithScores.map((a) => a.percentage || 0))
      : 0;

  const handleStartAssessment = (assignment: AssessmentAssignment) => {
    router.push(`/student/assessments/${assignment.id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return <Badge className="bg-blue-100 text-blue-700">Upcoming</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-700">In Progress</Badge>;
      case "completed":
      case "graded":
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "exam":
        return <Badge className="bg-red-100 text-red-700">Exam</Badge>;
      case "quiz":
        return <Badge className="bg-blue-100 text-blue-700">Quiz</Badge>;
      case "assignment":
        return <Badge className="bg-purple-100 text-purple-700">Assignment</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
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
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{upcomingCount}</p>
            <p className="text-gray-500 text-sm">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            <p className="text-gray-500 text-sm">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
            <p className="text-gray-500 text-sm">Average Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mb-3">
              <Trophy className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{bestScore}%</p>
            <p className="text-gray-500 text-sm">Best Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          {[
            { id: "all", label: "All" },
            { id: "upcoming", label: "Upcoming" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Assessments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-500">
              {activeTab === "all"
                ? "You don't have any assessments assigned yet."
                : activeTab === "upcoming"
                ? "No upcoming assessments."
                : "No completed assessments yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const assessment = assignment.assessment;
            if (!assessment) return null;

            const progress =
              assignment.question_count && assignment.question_count > 0
                ? Math.round(((assignment.answered_count || 0) / assignment.question_count) * 100)
                : 0;

            const isCompleted = assignment.status === "completed" || assignment.status === "graded";
            const isInProgress = assignment.status === "in_progress";

            return (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          assessment.type === "exam"
                            ? "bg-red-100"
                            : assessment.type === "quiz"
                            ? "bg-blue-100"
                            : "bg-purple-100"
                        }`}
                      >
                        <FileText
                          className={`h-6 w-6 ${
                            assessment.type === "exam"
                              ? "text-red-600"
                              : assessment.type === "quiz"
                              ? "text-blue-600"
                              : "text-purple-600"
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{assessment.title}</h3>
                          {getTypeBadge(assessment.type)}
                        </div>

                        <p className="text-gray-500 text-sm mb-2">
                          {assessment.course?.title || "No course"}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {assignment.question_count} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(assessment.duration_minutes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {formatDate(assessment.due_date)}
                          </span>
                        </div>

                        {/* Progress bar for in-progress */}
                        {isInProgress && progress > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-medium">{progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-500 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Score for completed */}
                        {isCompleted && assignment.percentage !== null && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-gray-500 text-sm">Score:</span>
                            <span
                              className={`font-bold ${
                                assignment.percentage >= assessment.passing_score
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {assignment.percentage}%
                            </span>
                            {assignment.percentage >= assessment.passing_score ? (
                              <Badge className="bg-green-100 text-green-700">Passed</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700">Failed</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {getStatusBadge(assignment.status)}
                      {!isCompleted && (
                        <Button onClick={() => handleStartAssessment(assignment)}>
                          <Play className="h-4 w-4 mr-2" />
                          {isInProgress ? "Continue" : "Start"}
                        </Button>
                      )}
                      {isCompleted && (
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/student/assessments/${assignment.id}/review`)}
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}