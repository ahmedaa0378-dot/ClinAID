"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  Search,
  Loader2,
  ClipboardList,
  Clock,
  Users,
  CheckCircle2,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Calendar,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: string;
  duration_minutes: number;
  total_points: number;
  passing_score: number;
  due_date: string;
  status: string;
  created_at: string;
  course_id: string;
  course?: {
    title: string;
    code: string;
  };
  assignment_count?: number;
  completed_count?: number;
  avg_score?: number;
}

export default function ProfessorAssessmentsPage() {
  const router = useRouter();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [professorId, setProfessorId] = useState<string | null>(null);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAssessment, setDeletingAssessment] = useState<Assessment | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      let profId = null;
      if (user) {
        const { data: professor } = await supabase
          .from("professors")
          .select("id")
          .eq("user_id", user.id)
          .single();
        profId = professor?.id;
      }

      if (!profId) {
        const { data: anyProf } = await supabase
          .from("professors")
          .select("id")
          .limit(1)
          .single();
        profId = anyProf?.id;
      }

      setProfessorId(profId);

      if (profId) {
        // Fetch assessments with course info
        const { data: assessmentsData, error } = await supabase
          .from("assessments")
          .select(`
            *,
            course:courses(title, code)
          `)
          .eq("professor_id", profId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Get assignment stats for each assessment
        const assessmentsWithStats = await Promise.all(
          (assessmentsData || []).map(async (assessment) => {
            const { data: assignments } = await supabase
              .from("assessment_assignments")
              .select("status, percentage")
              .eq("assessment_id", assessment.id);

            const assignmentCount = assignments?.length || 0;
            const completedCount = assignments?.filter(a => a.status === "completed" || a.status === "graded").length || 0;
            const scores = assignments?.filter(a => a.percentage !== null).map(a => a.percentage) || [];
            const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

            return {
              ...assessment,
              assignment_count: assignmentCount,
              completed_count: completedCount,
              avg_score: avgScore,
            };
          })
        );

        setAssessments(assessmentsWithStats);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter assessments
  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || assessment.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Stats
  const totalAssessments = assessments.length;
  const activeAssessments = assessments.filter(a => a.status === "active").length;
  const pendingReviews = assessments.reduce((acc, a) => {
    const pending = (a.assignment_count || 0) - (a.completed_count || 0);
    return acc + Math.max(0, pending);
  }, 0);
  const totalCompleted = assessments.reduce((acc, a) => acc + (a.completed_count || 0), 0);
  const overallAvgScore = (() => {
    const scores = assessments.filter(a => a.avg_score !== null).map(a => a.avg_score!);
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  })();

  const handleDelete = async () => {
    if (!deletingAssessment) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("assessments")
        .delete()
        .eq("id", deletingAssessment.id);

      if (error) throw error;

      await fetchData();
      setShowDeleteModal(false);
      setDeletingAssessment(null);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "draft": return "bg-yellow-100 text-yellow-700";
      case "closed": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "exam": return "bg-red-100 text-red-700";
      case "quiz": return "bg-blue-100 text-blue-700";
      case "assignment": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
          <p className="text-gray-500">Create and manage quizzes, exams, and assignments</p>
        </div>
        <Button onClick={() => router.push("/professor/assessments/create")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Assessment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalAssessments}</p>
            <p className="text-gray-500 text-sm">Total Assessments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{pendingReviews}</p>
            <p className="text-gray-500 text-sm">Pending Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalCompleted}</p>
            <p className="text-gray-500 text-sm">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{overallAvgScore}%</p>
            <p className="text-gray-500 text-sm">Avg. Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="exam">Exam</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="assignment">Assignment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assessments Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredAssessments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-500 mb-4">
              {assessments.length === 0
                ? "Create your first assessment to get started"
                : "Try adjusting your search or filter"}
            </p>
            {assessments.length === 0 && (
              <Button onClick={() => router.push("/professor/assessments/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Assessment
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-700">Assessment</th>
                    <th className="text-left p-4 font-medium text-gray-700">Type</th>
                    <th className="text-left p-4 font-medium text-gray-700">Submissions</th>
                    <th className="text-left p-4 font-medium text-gray-700">Avg. Score</th>
                    <th className="text-left p-4 font-medium text-gray-700">Due Date</th>
                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessments.map((assessment) => (
                    <tr key={assessment.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{assessment.title}</p>
                          <p className="text-sm text-gray-500">{assessment.course?.title || "No course"}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getTypeColor(assessment.type)}>
                          {assessment.type}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{assessment.completed_count || 0}</span>
                          {(assessment.assignment_count || 0) - (assessment.completed_count || 0) > 0 && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                              {(assessment.assignment_count || 0) - (assessment.completed_count || 0)} pending
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">
                          {assessment.avg_score !== null ? `${assessment.avg_score}%` : "-"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {formatDate(assessment.due_date)}
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(assessment.status)}>
                          {assessment.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/professor/assessments/${assessment.id}`)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/professor/assessments/${assessment.id}/edit`)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeletingAssessment(assessment);
                              setShowDeleteModal(true);
                            }}
                            title="Delete"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Assessment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingAssessment?.title}"? This will also delete all student submissions. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}