"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  BookOpen,
  Plus,
  Search,
  Users,
  Clock,
  Edit,
  Trash2,
  Eye,
  FileText,
  Loader2,
  Upload,
  Sparkles,
  X,
  Check,
  UserPlus,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  image: string;
  duration_weeks: number;
  total_lessons: number;
  status: string;
  created_at: string;
  updated_at: string;
  objectives: string[];
  modules: any[];
  professor_id: string;
  enrollment_count?: number;
}

interface Student {
  id: string;
  email: string;
  full_name: string;
  roll_number?: string;
}

const EMOJI_OPTIONS = ["📚", "🫀", "🧠", "💊", "🩺", "🔬", "🧬", "🩻", "💉", "🏥", "👶", "🚑"];

export default function ProfessorCoursesPage() {
  const router = useRouter();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [professorId, setProfessorId] = useState<string | null>(null);

  // Create Course Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<"upload" | "generating" | "preview">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [courseName, setCourseName] = useState("");
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit Course Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    code: "",
    description: "",
    image: "📚",
    duration_weeks: 8,
    status: "draft",
  });
  const [saving, setSaving] = useState(false);

  // Delete Confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Assign Students Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningCourse, setAssigningCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [enrolledStudentIds, setEnrolledStudentIds] = useState<string[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingEnrollments, setSavingEnrollments] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");

  // Fetch professor ID and courses
  useEffect(() => {
    fetchProfessorAndCourses();
  }, []);

  const fetchProfessorAndCourses = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      let profId = null;
      
      if (user) {
        // Get professor record
        const { data: professorData } = await supabase
          .from("professors")
          .select("id")
          .eq("user_id", user.id)
          .single();
        
        profId = professorData?.id;
      }
      
      // Fallback for development
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
        await fetchCourses(profId);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (profId: string) => {
    try {
      const { data: coursesData, error } = await supabase
        .from("courses")
        .select("*")
        .eq("professor_id", profId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get enrollment counts
      const coursesWithCounts = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { count } = await supabase
            .from("course_enrollments")
            .select("*", { count: "exact", head: true })
            .eq("course_id", course.id);
          return { ...course, enrollment_count: count || 0 };
        })
      );

      setCourses(coursesWithCounts);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalCourses = courses.length;
  const activeCourses = courses.filter((c) => c.status === "active").length;
  const totalEnrollments = courses.reduce((acc, c) => acc + (c.enrollment_count || 0), 0);
  const totalLessons = courses.reduce((acc, c) => acc + (c.total_lessons || 0), 0);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setCreateError("");
    } else {
      setCreateError("Please upload a PDF file");
    }
  };

  // Generate course with AI
  const handleGenerateCourse = async () => {
    if (!uploadedFile) {
      setCreateError("Please upload a PDF file");
      return;
    }

    setGenerating(true);
    setCreateError("");
    setCreateStep("generating");

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      if (courseName) {
        formData.append("courseName", courseName);
      }

      const response = await fetch("/api/courses/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate course");
      }

      setGeneratedCourse(data.course);
      setCreateStep("preview");
    } catch (error: any) {
      console.error("Generation error:", error);
      setCreateError(error.message || "Failed to generate course");
      setCreateStep("upload");
    } finally {
      setGenerating(false);
    }
  };

  // Save generated course
  const handleSaveCourse = async () => {
    if (!generatedCourse || !professorId) return;

    setSaving(true);
    try {
      // Calculate total lessons
      let totalLessons = 0;
      generatedCourse.modules?.forEach((module: any) => {
        totalLessons += module.lessons?.length || 0;
      });

      // Insert course
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .insert({
          professor_id: professorId,
          title: generatedCourse.title,
          code: generatedCourse.code,
          description: generatedCourse.description,
          image: generatedCourse.image || "📚",
          objectives: generatedCourse.objectives || [],
          modules: generatedCourse.modules || [],
          duration_weeks: generatedCourse.duration_weeks || 10,
          total_lessons: totalLessons,
          status: "draft",
          source_pdf_name: uploadedFile?.name,
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Insert lessons
      let lessonIndex = 0;
      for (const module of generatedCourse.modules || []) {
        for (const lesson of module.lessons || []) {
          await supabase.from("lessons").insert({
            course_id: courseData.id,
            title: lesson.title,
            description: lesson.description,
            content_markdown: lesson.content_markdown,
            duration_minutes: lesson.duration_minutes || 30,
            key_points: lesson.key_points || [],
            quiz_questions: lesson.quiz_questions || [],
            order_index: lessonIndex++,
          });
        }
      }

      // Refresh courses
      await fetchCourses(professorId);

      // Close modal and reset
      setShowCreateModal(false);
      setCreateStep("upload");
      setUploadedFile(null);
      setCourseName("");
      setGeneratedCourse(null);
    } catch (error: any) {
      console.error("Save error:", error);
      setCreateError(error.message || "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  // Edit course
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setEditForm({
      title: course.title,
      code: course.code || "",
      description: course.description || "",
      image: course.image || "📚",
      duration_weeks: course.duration_weeks || 8,
      status: course.status || "draft",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCourse) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("courses")
        .update({
          title: editForm.title,
          code: editForm.code,
          description: editForm.description,
          image: editForm.image,
          duration_weeks: editForm.duration_weeks,
          status: editForm.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingCourse.id);

      if (error) throw error;

      if (professorId) {
        await fetchCourses(professorId);
      }
      setShowEditModal(false);
      setEditingCourse(null);
    } catch (error: any) {
      console.error("Update error:", error);
    } finally {
      setSaving(false);
    }
  };

  // Delete course
  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", deletingCourse.id);

      if (error) throw error;

      if (professorId) {
        await fetchCourses(professorId);
      }
      setShowDeleteModal(false);
      setDeletingCourse(null);
    } catch (error: any) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (course: Course) => {
    const newStatus = course.status === "active" ? "draft" : "active";
    try {
      const { error } = await supabase
        .from("courses")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", course.id);

      if (error) throw error;

      if (professorId) {
        await fetchCourses(professorId);
      }
    } catch (error) {
      console.error("Status toggle error:", error);
    }
  };

  // Assign students
  const handleOpenAssignModal = async (course: Course) => {
    setAssigningCourse(course);
    setShowAssignModal(true);
    setLoadingStudents(true);
    setStudentSearch("");

    try {
      // Fetch all students
      const { data: studentsData, error: studentsError } = await supabase
        .from("users")
        .select("id, email, full_name, roll_number")
        .eq("role", "student")
        .order("full_name");

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Fetch current enrollments
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from("course_enrollments")
        .select("student_id")
        .eq("course_id", course.id);

      if (enrollmentsError) throw enrollmentsError;

      const enrolledIds = (enrollmentsData || []).map((e) => e.student_id);
      setEnrolledStudentIds(enrolledIds);
      setSelectedStudentIds(enrolledIds);
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSaveEnrollments = async () => {
    if (!assigningCourse) return;

    setSavingEnrollments(true);
    try {
      // Find students to remove
      const toRemove = enrolledStudentIds.filter((id) => !selectedStudentIds.includes(id));
      // Find students to add
      const toAdd = selectedStudentIds.filter((id) => !enrolledStudentIds.includes(id));

      // Remove enrollments
      if (toRemove.length > 0) {
        await supabase
          .from("course_enrollments")
          .delete()
          .eq("course_id", assigningCourse.id)
          .in("student_id", toRemove);
      }

      // Add enrollments
      if (toAdd.length > 0) {
        const newEnrollments = toAdd.map((studentId) => ({
          course_id: assigningCourse.id,
          student_id: studentId,
          progress_percent: 0,
        }));
        await supabase.from("course_enrollments").insert(newEnrollments);
      }

      if (professorId) {
        await fetchCourses(professorId);
      }
      setShowAssignModal(false);
      setAssigningCourse(null);
    } catch (error) {
      console.error("Error saving enrollments:", error);
    } finally {
      setSavingEnrollments(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Filter students by search
  const filteredStudents = students.filter(
    (student) =>
      student.full_name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.email?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.roll_number?.toLowerCase().includes(studentSearch.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500">Create and manage your courses</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
            <p className="text-gray-500 text-sm">Total Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeCourses}</p>
            <p className="text-gray-500 text-sm">Active Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalEnrollments}</p>
            <p className="text-gray-500 text-sm">Total Enrollments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalLessons}</p>
            <p className="text-gray-500 text-sm">Total Lessons</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              {courses.length === 0
                ? "Create your first course to get started"
                : "Try adjusting your search or filter"}
            </p>
            {courses.length === 0 && (
              <Button onClick={() => setShowCreateModal(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Course Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                      {course.image || "📚"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{course.title}</h3>
                      <p className="text-blue-100 text-sm">{course.code}</p>
                    </div>
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description || "No description"}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrollment_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {course.total_lessons || 0} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration_weeks}w
                    </span>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={course.status === "active" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(course)}
                    >
                      {course.status === "active" ? "Active" : "Draft"}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/professor/courses/${course.id}`)}
                        title="View Course"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCourse(course)}
                        title="Edit Course"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenAssignModal(course)}
                        title="Assign Students"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingCourse(course);
                          setShowDeleteModal(true);
                        }}
                        title="Delete Course"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      <Dialog open={showCreateModal} onOpenChange={(open) => {
        if (!open && !generating) {
          setShowCreateModal(false);
          setCreateStep("upload");
          setUploadedFile(null);
          setCourseName("");
          setGeneratedCourse(null);
          setCreateError("");
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Create Course with AI
            </DialogTitle>
            <DialogDescription>
              Upload a PDF with your course content and AI will generate a complete course structure.
            </DialogDescription>
          </DialogHeader>

          {createStep === "upload" && (
            <div className="space-y-4">
              <div>
                <Label>Course Name (Optional)</Label>
                <Input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Clinical Cardiology Course"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to let AI suggest a name based on the content.
                </p>
              </div>

              <div>
                <Label>Upload Course Content (PDF)</Label>
                <div
                  className={`mt-1 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    uploadedFile ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-blue-500"
                  }`}
                >
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-green-700">{uploadedFile.name}</p>
                        <p className="text-sm text-green-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedFile(null)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400">PDF files only</p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {createError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {createError}
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateCourse} disabled={!uploadedFile || generating}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Course
                </Button>
              </DialogFooter>
            </div>
          )}

          {createStep === "generating" && (
            <div className="py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Course...</h3>
              <p className="text-gray-500">
                AI is analyzing your content and creating a structured course.
                This may take 1-2 minutes.
              </p>
            </div>
          )}

          {createStep === "preview" && generatedCourse && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{generatedCourse.image || "📚"}</span>
                  <div>
                    <h3 className="font-bold text-lg">{generatedCourse.title}</h3>
                    <p className="text-sm text-gray-600">{generatedCourse.code}</p>
                  </div>
                </div>
                <p className="text-gray-700">{generatedCourse.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Learning Objectives</h4>
                <ul className="space-y-1">
                  {generatedCourse.objectives?.map((obj: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">
                  Course Structure ({generatedCourse.modules?.length || 0} Modules)
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {generatedCourse.modules?.map((module: any, i: number) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{module.title}</p>
                      <p className="text-sm text-gray-500">
                        {module.lessons?.length || 0} lessons
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {createError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {createError}
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCreateStep("upload");
                    setGeneratedCourse(null);
                  }}
                >
                  Start Over
                </Button>
                <Button onClick={handleSaveCourse} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Course
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Course Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Code</Label>
              <Input
                value={editForm.code}
                onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setEditForm({ ...editForm, image: emoji })}
                    className={`w-10 h-10 text-xl rounded-lg border-2 transition-colors ${
                      editForm.image === emoji
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration (weeks)</Label>
                <Input
                  type="number"
                  value={editForm.duration_weeks}
                  onChange={(e) =>
                    setEditForm({ ...editForm, duration_weeks: parseInt(e.target.value) || 8 })
                  }
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingCourse?.title}"? This action cannot be undone.
              All lessons and enrollments will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Students Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Assign Students</DialogTitle>
            <DialogDescription>
              Select students to enroll in "{assigningCourse?.title}"
            </DialogDescription>
          </DialogHeader>

          {loadingStudents ? (
            <div className="py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {filteredStudents.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No students found</p>
                ) : (
                  filteredStudents.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.id);
                    const wasEnrolled = enrolledStudentIds.includes(student.id);
                    const isNew = isSelected && !wasEnrolled;
                    const willRemove = !isSelected && wasEnrolled;

                    return (
                      <div
                        key={student.id}
                        onClick={() => toggleStudentSelection(student.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{student.full_name}</p>
                            <p className="text-sm text-gray-500 truncate">{student.email}</p>
                          </div>
                          {isNew && (
                            <Badge className="bg-green-100 text-green-700">New</Badge>
                          )}
                          {willRemove && (
                            <Badge className="bg-red-100 text-red-700">Will Remove</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="text-sm text-gray-500">
                {selectedStudentIds.length} student(s) selected
              </div>
            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEnrollments} disabled={savingEnrollments}>
              {savingEnrollments ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Enrollments"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}