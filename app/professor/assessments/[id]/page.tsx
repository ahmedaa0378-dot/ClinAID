"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  BarChart3,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  Eye,
  Download,
  Mail,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: string;
  duration_minutes: number;
  total_points: number;
  passing_score: number;
  due_date: string | null;
  status: string;
  created_at: string;
  course: {
    title: string;
    code: string;
  } | null;
}

interface StudentAssignment {
  id: string;
  student_id: string;
  status: string;
  score: number | null;
  percentage: number | null;
  assigned_at: string;
  started_at: string | null;
  completed_at: string | null;
  time_spent_minutes: number | null;
  student: {
    id: string;
    full_name: string;
    email: string;
  } | null;
}

interface Question {
  id: string;
  question_text: string;
  points: number;
}

export default function ProfessorAssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscription for assignment updates
    const subscription = supabase
      .channel('assessment-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assessment_assignments',
          filter: `assessment_id=eq.${assessmentId}`,
        },
        () => {
          fetchData(); // Refresh data when assignments change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [assessmentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch assessment with course
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("assessments")
        .select(`
          *,
          course:courses(title, code)
        `)
        .eq("id", assessmentId)
        .single();

      if (assessmentError) throw assessmentError;
      setAssessment(assessmentData);

      // Fetch questions
      const { data: questionsData } = await supabase
        .from("assessment_questions")
        .select("id, question_text, points")
        .eq("assessment_id", assessmentId)
        .order("order_index");

      setQuestions(questionsData || []);

      // Fetch student assignments with user details
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from("assessment_assignments")
        .select(`
          *,
          student:users(id, full_name, email)
        `)
        .eq("assessment_id", assessmentId)
        .order("completed_at", { ascending: false, nullsFirst: false });

      if (assignmentsError) throw assignmentsError;
      setAssignments(assignmentsData || []);
    } catch (error) {
      console.error("Error fetching assessment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter((a) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "completed") return a.status === "completed" || a.status === "graded";
    if (statusFilter === "pending") return a.status === "assigned";
    if (statusFilter === "in_progress") return a.status === "in_progress";
    return true;
  });

  // Calculate stats
  const totalAssigned = assignments.length;
  const completedAssignments = assignments.filter(
    (a) => a.status === "completed" || a.status === "graded"
  );
  const completedCount = completedAssignments.length;
  const pendingCount = assignments.filter((a) => a.status === "assigned").length;
  const inProgressCount = assignments.filter((a) => a.status === "in_progress").length;

  const scores = completedAssignments
    .filter((a) => a.percentage !== null)
    .map((a) => a.percentage!);
  
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
  
  const passedCount = completedAssignments.filter(
    (a) => a.percentage !== null && a.percentage >= (assessment?.passing_score || 70)
  ).length;
  
  const passRate = completedCount > 0 ? Math.round((passedCount / completedCount) * 100) : 0;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (startedAt: string | null, completedAt: string | null) => {
    if (!startedAt || !completedAt) return "-";
    const start = new Date(startedAt).getTime();
    const end = new Date(completedAt).getTime();
    const minutes = Math.round((end - start) / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return <Badge className="bg-blue-100 text-blue-700">Not Started</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-700">In Progress</Badge>;
      case "completed":
      case "graded":
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreBadge = (percentage: number | null, passingScore: number) => {
    if (percentage === null) return null;
    const passed = percentage >= passingScore;
    return (
      <span className={`font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
        {percentage}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Assessment not found</h2>
        <Button onClick={() => router.push("/professor/assessments")}>
          Back to Assessments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/professor/assessments")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
              <Badge
                className={
                  assessment.type === "exam"
                    ? "bg-red-100 text-red-700"
                    : assessment.type === "quiz"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }
              >
                {assessment.type}
              </Badge>
              <Badge
                className={
                  assessment.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }
              >
                {assessment.status}
              </Badge>
            </div>
            <p className="text-gray-500">{assessment.course?.title || "No course"}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {questions.length} questions
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {assessment.duration_minutes} min
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                Pass: {assessment.passing_score}%
              </span>
              {assessment.due_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due: {formatDate(assessment.due_date)}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/professor/assessments/${assessmentId}/edit`)}
            >
              Edit Assessment
            </Button>
            <Button onClick={fetchData}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalAssigned}</p>
            <p className="text-xs text-gray-500">Assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{pendingCount + inProgressCount}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
            <p className="text-xs text-gray-500">Avg Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{highestScore}%</p>
            <p className="text-xs text-gray-500">Highest</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{passRate}%</p>
            <p className="text-xs text-gray-500">Pass Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution */}
      {scores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {[
                { range: "0-20", min: 0, max: 20 },
                { range: "21-40", min: 21, max: 40 },
                { range: "41-60", min: 41, max: 60 },
                { range: "61-80", min: 61, max: 80 },
                { range: "81-100", min: 81, max: 100 },
              ].map((bucket) => {
                const count = scores.filter(
                  (s) => s >= bucket.min && s <= bucket.max
                ).length;
                const percentage = scores.length > 0 ? (count / scores.length) * 100 : 0;
                const isPassing = bucket.min >= assessment.passing_score;

                return (
                  <div key={bucket.range} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t transition-all ${
                        isPassing ? "bg-green-500" : "bg-red-400"
                      }`}
                      style={{ height: `${Math.max(percentage, 5)}%` }}
                    />
                    <span className="text-xs text-gray-500">{bucket.range}</span>
                    <span className="text-xs font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Submissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Student Submissions</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({totalAssigned})</SelectItem>
                <SelectItem value="completed">Completed ({completedCount})</SelectItem>
                <SelectItem value="in_progress">In Progress ({inProgressCount})</SelectItem>
                <SelectItem value="pending">Not Started ({pendingCount})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-700">Student</th>
                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 font-medium text-gray-700">Score</th>
                    <th className="text-left p-4 font-medium text-gray-700">Result</th>
                    <th className="text-left p-4 font-medium text-gray-700">Time Taken</th>
                    <th className="text-left p-4 font-medium text-gray-700">Submitted</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((assignment) => {
                    const isCompleted =
                      assignment.status === "completed" || assignment.status === "graded";
                    const passed =
                      assignment.percentage !== null &&
                      assignment.percentage >= assessment.passing_score;

                    return (
                      <tr key={assignment.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {assignment.student?.full_name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {assignment.student?.email}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(assignment.status)}</td>
                        <td className="p-4">
                          {isCompleted ? (
                            <div>
                              <span className="font-bold text-lg">
                                {getScoreBadge(assignment.percentage, assessment.passing_score)}
                              </span>
                              <p className="text-xs text-gray-500">
                                {assignment.score} / {assessment.total_points} pts
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          {isCompleted ? (
                            passed ? (
                              <Badge className="bg-green-100 text-green-700">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Passed
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700">
                                <XCircle className="h-3 w-3 mr-1" />
                                Failed
                              </Badge>
                            )
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatDuration(assignment.started_at, assignment.completed_at)}
                        </td>
                        <td className="p-4 text-gray-600 text-sm">
                          {assignment.completed_at
                            ? formatDate(assignment.completed_at)
                            : "-"}
                        </td>
                        <td className="p-4">
                          {isCompleted && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/professor/assessments/${assessmentId}/submissions/${assignment.id}`
                                )
                              }
                              title="View Submission"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}