"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSubmissions } from "@/hooks/useSubmissions";

export default function ProfessorSubmissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getProfessorSubmissions, loading } = useSubmissions();

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, statusFilter]);

  const loadSubmissions = async () => {
    const data = await getProfessorSubmissions();
    setSubmissions(data);
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.student?.full_name?.toLowerCase().includes(term) ||
          s.clinical_reports?.primary_diagnosis?.toLowerCase().includes(term)
      );
    }

    setFilteredSubmissions(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "in_review":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "revision_requested":
        return <RefreshCw className="h-4 w-4 text-orange-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      in_review: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      revision_requested: "bg-orange-100 text-orange-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={styles[status] || "bg-gray-100 text-gray-800"}>
        {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    in_review: submissions.filter((s) => s.status === "in_review").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    revision_requested: submissions.filter((s) => s.status === "revision_requested").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Submissions</h1>
          <p className="text-gray-500">Review and provide feedback on student analyses</p>
        </div>
        <Button variant="outline" onClick={loadSubmissions} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student name or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "all", label: "All" },
                { key: "pending", label: "Pending" },
                { key: "approved", label: "Approved" },
                { key: "revision_requested", label: "Revision" },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={statusFilter === tab.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(tab.key)}
                  className={statusFilter === tab.key ? "bg-emerald-600" : ""}
                >
                  {tab.label}
                  <span className="ml-1 text-xs opacity-70">
                    ({statusCounts[tab.key as keyof typeof statusCounts]})
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-500" />
            Submissions ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No submissions found</p>
              <p className="text-sm text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Students haven't submitted any analyses yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubmissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                  onClick={() => router.push(`/professor/submissions/${submission.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 font-bold text-lg">
                        {submission.student?.full_name?.charAt(0) || "S"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {submission.student?.full_name || "Unknown Student"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {submission.clinical_reports?.primary_diagnosis || "Clinical Analysis"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted: {formatDate(submission.submitted_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {getStatusBadge(submission.status)}
                      {submission.reviewed_at && (
                        <p className="text-xs text-gray-400 mt-1">
                          Reviewed: {formatDate(submission.reviewed_at)}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}