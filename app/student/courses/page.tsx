"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  BookOpen,
  Search,
  Clock,
  FileText,
  Loader2,
  Play,
  CheckCircle2,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  image: string;
  duration_weeks: number;
  total_lessons: number;
  status: string;
  modules: any[];
  objectives: string[];
}

interface Enrollment {
  id: string;
  course_id: string;
  progress_percent: number;
  enrolled_at: string;
  completed_at: string | null;
  course: Course;
}

export default function StudentCoursesPage() {
  const router = useRouter();
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentAndEnrollments();
  }, []);

  const fetchStudentAndEnrollments = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      let sId = user?.id;
      
      // Fallback for development - get first student
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
        await fetchEnrollments(sId);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async (sId: string) => {
    try {
      const { data, error } = await supabase
        .from("course_enrollments")
        .select(`
          id,
          course_id,
          progress_percent,
          enrolled_at,
          completed_at,
          course:courses (
            id,
            title,
            code,
            description,
            image,
            duration_weeks,
            total_lessons,
            status,
            modules,
            objectives
          )
        `)
        .eq("student_id", sId)
        .order("enrolled_at", { ascending: false });

      if (error) throw error;

      // Filter out enrollments where course is null and transform data
      const validEnrollments = (data || [])
        .filter((e: any) => e.course !== null)
        .map((e: any) => ({
          ...e,
          course: e.course as Course,
        }));

      setEnrollments(validEnrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) =>
    enrollment.course?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.completed_at).length;
  const inProgressCourses = enrollments.filter((e) => !e.completed_at && e.progress_percent > 0).length;
  const averageProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress_percent || 0), 0) / enrollments.length)
    : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-500">View and continue your enrolled courses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
            <p className="text-gray-500 text-sm">Enrolled Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mb-3">
              <Play className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{inProgressCourses}</p>
            <p className="text-gray-500 text-sm">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
            <p className="text-gray-500 text-sm">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{averageProgress}%</p>
            <p className="text-gray-500 text-sm">Avg Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-500">
              {enrollments.length === 0
                ? "You haven't been enrolled in any courses yet. Please contact your professor."
                : "No courses match your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <Card
              key={enrollment.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/student/courses/${enrollment.course.id}`)}
            >
              <CardContent className="p-0">
                {/* Course Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                      {enrollment.course.image || "📚"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{enrollment.course.title}</h3>
                      <p className="text-blue-100 text-sm">{enrollment.course.code}</p>
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {enrollment.course.description || "No description available"}
                  </p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-900">
                        {enrollment.progress_percent || 0}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress_percent || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {enrollment.course.total_lessons || 0} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {enrollment.course.duration_weeks}w
                    </span>
                  </div>

                  {/* Enrolled Date & Status */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-xs text-gray-400">
                      Enrolled {formatDate(enrollment.enrolled_at)}
                    </span>
                    {enrollment.completed_at ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Completed
                      </Badge>
                    ) : enrollment.progress_percent > 0 ? (
                      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                        In Progress
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Started</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}