"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Star,
  Loader2,
  Plus,
  Sparkles,
  GraduationCap,
  ChevronDown,
  Check,
  X,
  Eye,
  BookmarkPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  specialty: string;
  difficulty: string;
  target_year: string;
  tags: string[];
  thumbnail_emoji: string;
  estimated_duration_weeks: number;
  is_featured: boolean;
  download_count: number;
}

interface PublicCourse {
  id: string;
  title: string;
  code: string;
  description: string;
  image: string;
  duration_weeks: number;
  total_lessons: number;
  difficulty: string;
  specialty: string;
  target_year: string;
  objectives: string[];
  modules: any[];
}

const SPECIALTIES = [
  "All Specialties",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Emergency Medicine",
  "Internal Medicine",
  "Pharmacology",
  "Surgery",
  "Infectious Disease",
  "Oncology",
  "Psychiatry",
];

const DIFFICULTIES = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const YEARS = [
  { value: "all", label: "All Years" },
  { value: "1st Year", label: "1st Year" },
  { value: "2nd Year", label: "2nd Year" },
  { value: "3rd Year", label: "3rd Year" },
  { value: "4th Year", label: "4th Year" },
];

export default function StudentLibraryPage() {
  const router = useRouter();

  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [publicCourses, setPublicCourses] = useState<PublicCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All Specialties");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Preview Modal
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

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

      // Fetch library items
      const { data: libData, error: libError } = await supabase
        .from("course_library")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("download_count", { ascending: false });

      if (!libError && libData) {
        setLibraryItems(libData);
      }

      // Fetch public courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .eq("is_public", true)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!coursesError && coursesData) {
        setPublicCourses(coursesData);
      }

      // Fetch enrolled course IDs
      if (sId) {
        const { data: enrollments } = await supabase
          .from("course_enrollments")
          .select("course_id")
          .eq("student_id", sId);

        if (enrollments) {
          setEnrolledCourseIds(enrollments.map((e) => e.course_id));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter library items
  const filteredLibraryItems = libraryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty =
      specialtyFilter === "All Specialties" || item.specialty === specialtyFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || item.difficulty === difficultyFilter;
    const matchesYear =
      yearFilter === "all" || item.target_year === yearFilter;

    return matchesSearch && matchesSpecialty && matchesDifficulty && matchesYear;
  });

  // Filter public courses
  const filteredPublicCourses = publicCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      specialtyFilter === "All Specialties" || course.specialty === specialtyFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || course.difficulty === difficultyFilter;
    const matchesYear =
      yearFilter === "all" || course.target_year === yearFilter;

    return matchesSearch && matchesSpecialty && matchesDifficulty && matchesYear;
  });

  const featuredItems = filteredLibraryItems.filter((item) => item.is_featured);
  const regularItems = filteredLibraryItems.filter((item) => !item.is_featured);

  // Generate course from library item
  const handleGenerateFromLibrary = async (item: LibraryItem) => {
    if (!studentId) {
      alert("Please log in to generate courses");
      return;
    }

    setGenerating(true);
    try {
      // Call AI to generate course based on library item
      const response = await fetch("/api/courses/generate-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: item.title,
          specialty: item.specialty,
          difficulty: item.difficulty,
          targetYear: item.target_year,
          tags: item.tags,
          durationWeeks: item.estimated_duration_weeks,
          studentId: studentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate course");
      }

      // Update download count
      await supabase
        .from("course_library")
        .update({ download_count: (item.download_count || 0) + 1 })
        .eq("id", item.id);

      // Redirect to the new course
      router.push(`/student/courses/${data.courseId}`);
    } catch (error: any) {
      console.error("Generation error:", error);
      alert(error.message || "Failed to generate course");
    } finally {
      setGenerating(false);
      setShowPreview(false);
    }
  };

  // Enroll in public course
  const handleEnrollInCourse = async (courseId: string) => {
    if (!studentId) {
      alert("Please log in to enroll");
      return;
    }

    if (enrolledCourseIds.includes(courseId)) {
      router.push(`/student/courses/${courseId}`);
      return;
    }

    setEnrolling(true);
    try {
      const { error } = await supabase.from("course_enrollments").insert({
        course_id: courseId,
        student_id: studentId,
        progress_percent: 0,
      });

      if (error) throw error;

      setEnrolledCourseIds([...enrolledCourseIds, courseId]);
      router.push(`/student/courses/${courseId}`);
    } catch (error: any) {
      console.error("Enrollment error:", error);
      alert(error.message || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Library</h1>
          <p className="text-gray-500">Browse and enroll in courses from our repository</p>
        </div>
        <Button onClick={() => router.push("/student/generate")} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Custom Course
        </Button>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses, topics, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y.value} value={y.value}>
                      {y.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Featured Courses */}
          {featuredItems.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Featured Courses
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featuredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-yellow-200"
                    onClick={() => {
                      setPreviewItem(item);
                      setShowPreview(true);
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 text-white">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl">{item.thumbnail_emoji}</span>
                          <Badge className="bg-white/20 text-white">Featured</Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {item.specialty}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
                            {item.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.estimated_duration_weeks}w
                          </span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {item.target_year}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Library Courses */}
          {regularItems.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Course Templates
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {regularItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => {
                      setPreviewItem(item);
                      setShowPreview(true);
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 text-white">
                        <span className="text-3xl">{item.thumbnail_emoji}</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {item.specialty}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
                            {item.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.estimated_duration_weeks}w
                          </span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {item.target_year}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Public Courses from Professors */}
          {filteredPublicCourses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                Professor-Created Courses
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPublicCourses.map((course) => {
                  const isEnrolled = enrolledCourseIds.includes(course.id);
                  return (
                    <Card
                      key={course.id}
                      className="overflow-hidden hover:shadow-lg transition-all"
                    >
                      <CardContent className="p-0">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 text-white">
                          <div className="flex items-center justify-between">
                            <span className="text-3xl">{course.image || "📚"}</span>
                            {isEnrolled && (
                              <Badge className="bg-white/20 text-white">Enrolled</Badge>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                            <span>{course.total_lessons || 0} lessons</span>
                            <span>•</span>
                            <span>{course.duration_weeks}w</span>
                          </div>
                          <Button
                            className="w-full"
                            variant={isEnrolled ? "outline" : "default"}
                            onClick={() => handleEnrollInCourse(course.id)}
                            disabled={enrolling}
                          >
                            {isEnrolled ? (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                View Course
                              </>
                            ) : (
                              <>
                                <BookmarkPlus className="h-4 w-4 mr-2" />
                                Enroll Now
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredLibraryItems.length === 0 && filteredPublicCourses.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or generate a custom course
                </p>
                <Button onClick={() => router.push("/student/generate")}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Custom Course
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{previewItem?.thumbnail_emoji}</span>
              <div>
                <DialogTitle>{previewItem?.title}</DialogTitle>
                <DialogDescription>{previewItem?.specialty}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-gray-600">{previewItem?.description}</p>

            <div className="flex flex-wrap gap-2">
              <Badge className={getDifficultyColor(previewItem?.difficulty || "")}>
                {previewItem?.difficulty}
              </Badge>
              <Badge variant="outline">{previewItem?.target_year}</Badge>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {previewItem?.estimated_duration_weeks} weeks
              </Badge>
            </div>

            {previewItem?.tags && previewItem.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Topics Covered:</p>
                <div className="flex flex-wrap gap-1">
                  {previewItem.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>How it works:</strong> AI will generate a personalized course based on
                this template, complete with lessons, key points, and quizzes tailored to your
                learning level.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => previewItem && handleGenerateFromLibrary(previewItem)}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate & Enroll
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}