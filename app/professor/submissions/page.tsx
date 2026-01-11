"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  MessageSquare,
  Loader2,
  Search,
  Filter,
  ChevronRight,
  User,
  Calendar,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Submission {
  id: string;
  report_id: string;
  student_id: string;
  professor_id: string;
  status: "pending" | "reviewed" | "needs_revision";
  student_notes: string | null;
  submitted_at: string;
  viewed_at: string | null;
  reviewed_at: string | null;
  clinical_report: {
    id: string;
    report_title: string;
    executive_summary: string;
    assessment: any;
    subjective: any;
    content_markdown: string;
    created_at: string;
  };
  student: {
    id: string;
    full_name: string;
    email: string;
  };
}

export default function ProfessorSubmissionsPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch submissions
  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      setError("");

      try {
        // Get current professor ID
        const professorId = profile?.id || user?.id;

        // Fetch submissions with related data
        const { data, error: fetchError } = await supabase
          .from("submissions")
          .select(`
            *,
            clinical_report:clinical_reports (
              id,
              report_title,
              executive_summary,
              assessment,
              subjective,
              content_markdown,
              created_at
            ),
            student:users!submissions_student_id_fkey (
              id,
              full_name,
              email
            )
          `)
          .order("submitted_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching submissions:", fetchError);
          // Try simpler query without joins
          const { data: simpleData, error: simpleError } = await supabase
            .from("submissions")
            .select("*")
            .order("submitted_at", { ascending: false });

          if (simpleError) {
            throw simpleError;
          }

          // Fetch related data separately
          if (simpleData && simpleData.length > 0) {
            const enrichedSubmissions = await Promise.all(
              simpleData.map(async (sub) => {
                // Fetch clinical report
                const { data: report } = await supabase
                  .from("clinical_reports")
                  .select("*")
                  .eq("id", sub.report_id)
                  .single();

                // Fetch student
                const { data: student } = await supabase
                  .from("users")
                  .select("id, full_name, email")
                  .eq("id", sub.student_id)
                  .single();

                return {
                  ...sub,
                  clinical_report: report || {
                    id: sub.report_id,
                    report_title: "Clinical Report",
                    executive_summary: "",
                    assessment: {},
                    subjective: {},
                    content_markdown: "",
                    created_at: sub.submitted_at,
                  },
                  student: student || {
                    id: sub.student_id,
                    full_name: "Unknown Student",
                    email: "",
                  },
                };
              })
            );
            setSubmissions(enrichedSubmissions);
          } else {
            setSubmissions([]);
          }
        } else {
          setSubmissions(data || []);
        }
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [profile, user]);

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      searchTerm === "" ||
      sub.clinical_report?.report_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" /> Pending Review
          </Badge>
        );
      case "reviewed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Reviewed
          </Badge>
        );
      case "needs_revision":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-300">
            <AlertTriangle className="h-3 w-3 mr-1" /> Needs Revision
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get diagnosis from assessment
  const getDiagnosis = (assessment: any) => {
    return assessment?.primary_diagnosis || "Unknown Diagnosis";
  };

  // Get confidence from assessment
  const getConfidence = (assessment: any) => {
    return assessment?.confidence || 0;
  };

  // Stats
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const reviewedCount = submissions.filter((s) => s.status === "reviewed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Submissions</h1>
        <p className="text-gray-600 mt-1">Review and provide feedback on student clinical reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-800 font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-900">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium">Reviewed</p>
                <p className="text-3xl font-bold text-green-900">{reviewedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 font-medium">Total</p>
                <p className="text-3xl font-bold text-blue-900">{submissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student name or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Submissions</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="needs_revision">Needs Revision</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-500">
              {submissions.length === 0
                ? "You don't have any student submissions yet."
                : "No submissions match your search criteria."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card
              key={submission.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/professor/submissions/${submission.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header Row */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                        {submission.student?.full_name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {submission.student?.full_name || "Unknown Student"}
                        </h3>
                        <p className="text-sm text-gray-500">{submission.student?.email}</p>
                      </div>
                      <div className="ml-auto">{getStatusBadge(submission.status)}</div>
                    </div>

                    {/* Report Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium text-gray-900">
                          {getDiagnosis(submission.clinical_report?.assessment)}
                        </span>
                        <Badge variant="outline" className="ml-2">
                          {getConfidence(submission.clinical_report?.assessment)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {submission.clinical_report?.executive_summary ||
                          submission.clinical_report?.report_title ||
                          "Clinical analysis report"}
                      </p>
                    </div>

                    {/* Student Notes */}
                    {submission.student_notes && (
                      <div className="flex items-start gap-2 mb-3 text-sm">
                        <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5" />
                        <p className="text-gray-600 italic">"{submission.student_notes}"</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted {formatDate(submission.submitted_at)}</span>
                      </div>
                      {submission.reviewed_at && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Reviewed {formatDate(submission.reviewed_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button variant="ghost" size="sm" className="ml-4">
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}