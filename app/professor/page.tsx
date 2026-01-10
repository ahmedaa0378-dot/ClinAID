"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
  BookOpen,
  Bell,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useQuizzes } from "@/hooks/useQuizzes";

export default function ProfessorDashboard() {
  const router = useRouter();
  const { profile } = useAuth();
  const { getProfessorSubmissions, loading: submissionsLoading } = useSubmissions();
  const { getProfessorQuizzes, loading: quizzesLoading } = useQuizzes();

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    reviewed: 0,
    totalStudents: 0,
    avgReviewTime: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [subs, quizData] = await Promise.all([
      getProfessorSubmissions(),
      getProfessorQuizzes(),
    ]);

    setSubmissions(subs);
    setQuizzes(quizData);

    // Calculate stats
    const pending = subs.filter((s: any) => s.status === "pending").length;
    const reviewed = subs.filter((s: any) => ["approved", "revision_requested"].includes(s.status)).length;
    const uniqueStudents = new Set(subs.map((s: any) => s.student_id)).size;

    setStats({
      pending,
      reviewed,
      totalStudents: uniqueStudents,
      avgReviewTime: 24, // Placeholder
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "in_review":
        return <Badge className="bg-blue-100 text-blue-800">In Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "revision_requested":
        return <Badge className="bg-orange-100 text-orange-800">Revision Requested</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Professor"}!
          </h1>
          <p className="text-gray-500">Here's an overview of your students' progress</p>
        </div>
        <Button onClick={() => router.push("/professor/quizzes/create")}>
          <BookOpen className="h-4 w-4 mr-2" />
          Create AI Quiz
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700 font-medium">Pending Reviews</p>
                  <p className="text-3xl font-bold text-yellow-800">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-200 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Reviewed</p>
                  <p className="text-3xl font-bold text-green-800">{stats.reviewed}</p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-blue-800">{stats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Active Quizzes</p>
                  <p className="text-3xl font-bold text-purple-800">
                    {quizzes.filter((q: any) => q.is_published).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Submissions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-emerald-500" />
                Pending Submissions
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push("/professor/submissions")}>
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {submissionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : submissions.filter((s) => s.status === "pending").length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No pending submissions</p>
                  <p className="text-sm text-gray-400">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions
                    .filter((s) => s.status === "pending")
                    .slice(0, 5)
                    .map((submission) => (
                      <motion.div
                        key={submission.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => router.push(`/professor/submissions/${submission.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-emerald-700 font-semibold">
                              {submission.student?.full_name?.charAt(0) || "S"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {submission.student?.full_name || "Student"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {submission.clinical_reports?.primary_diagnosis || "Clinical Analysis"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(submission.status)}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(submission.submitted_at)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/professor/submissions?status=pending")}
              >
                <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                Review Pending ({stats.pending})
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/professor/quizzes/create")}
              >
                <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                Create AI Quiz
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/professor/quizzes")}
              >
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                View Quiz Results
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/professor/students")}
              >
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                Manage Students
              </Button>
            </CardContent>
          </Card>

          {/* Recent Quizzes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Your Quizzes</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/professor/quizzes")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {quizzesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : quizzes.length === 0 ? (
                <div className="text-center py-4">
                  <BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No quizzes created yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {quizzes.slice(0, 3).map((quiz: any) => (
                    <div
                      key={quiz.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => router.push(`/professor/quizzes/${quiz.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-gray-800">{quiz.title}</p>
                        <Badge variant={quiz.is_published ? "default" : "secondary"}>
                          {quiz.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {quiz.total_questions} questions • {quiz.difficulty_level}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}