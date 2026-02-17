"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Search,
  BookOpen,
  Clock,
  Star,
  Loader2,
  Sparkles,
  GraduationCap,
  Check,
  Eye,
  FileText,
  Download,
  ExternalLink,
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
  pdf_name: string;
  pdf_storage_path: string;
}

const SPECIALTIES = [
  "All Specialties",
  "Cardiology",
  "Nephrology",
  "Pulmonology",
  "Endocrinology",
  "Pharmacology",
  "Critical Care",
  "Neurology",
  "Pediatrics",
  "Emergency Medicine",
  "Internal Medicine",
  "Surgery",
  "Infectious Disease",
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
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All Specialties");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Preview Modal
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

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

      if (libError) {
        console.error("Library fetch error:", libError);
      } else {
        setLibraryItems(libData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get PDF URL from storage
  const getPdfUrl = (pdfPath: string) => {
    if (!pdfPath) return null;
    const { data } = supabase.storage.from("course-pdfs").getPublicUrl(pdfPath);
    return data?.publicUrl;
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

  const featuredItems = filteredLibraryItems.filter((item) => item.is_featured);
  const regularItems = filteredLibraryItems.filter((item) => !item.is_featured);

  // Generate course from PDF
  const handleGenerateFromPdf = async (item: LibraryItem) => {
    if (!studentId) {
      alert("Please log in to generate courses");
      return;
    }

    setGenerating(true);
    setGenerationError("");

    try {
      const pdfUrl = getPdfUrl(item.pdf_storage_path);
      
      const response = await fetch("/api/courses/generate-from-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfUrl,
          pdfName: item.pdf_name,
          title: item.title,
          specialty: item.specialty,
          difficulty: item.difficulty,
          targetYear: item.target_year,
          tags: item.tags,
          durationWeeks: item.estimated_duration_weeks,
          studentId: studentId,
          libraryItemId: item.id,
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
      setGenerationError(error.message || "Failed to generate course");
    } finally {
      setGenerating(false);
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

  const LibraryCard = ({ item, featured = false }: { item: LibraryItem; featured?: boolean }) => (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
        featured ? "border-yellow-200" : ""
      }`}
      onClick={() => {
        setPreviewItem(item);
        setShowPreview(true);
        setGenerationError("");
      }}
    >
      <CardContent className="p-0">
        <div className={`p-4 text-white ${
          featured 
            ? "bg-gradient-to-br from-yellow-400 to-orange-500" 
            : "bg-gradient-to-br from-blue-500 to-cyan-500"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-3xl">{item.thumbnail_emoji}</span>
            <div className="flex items-center gap-2">
              {item.pdf_name && (
                <Badge className="bg-white/20 text-white text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  PDF
                </Badge>
              )}
              {featured && (
                <Badge className="bg-white/20 text-white text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {item.title}
          </h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {item.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Badge variant="outline" className="text-xs">
              {item.specialty}
            </Badge>
            <Badge className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
              {item.difficulty}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {item.estimated_duration_weeks} weeks
            </span>
            <span className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {item.target_year}
            </span>
            {item.download_count > 0 && (
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {item.download_count}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Library</h1>
          <p className="text-gray-500">Browse medical PDFs and generate personalized courses</p>
        </div>
        <Button onClick={() => router.push("/student/generate")} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Custom AI Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{libraryItems.length}</p>
            <p className="text-sm text-gray-500">Available PDFs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {libraryItems.filter((i) => i.is_featured).length}
            </p>
            <p className="text-sm text-gray-500">Featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {Array.from(new Set(libraryItems.map((i) => i.specialty))).length}
            </p>
            <p className="text-sm text-gray-500">Specialties</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {libraryItems.reduce((acc, i) => acc + (i.download_count || 0), 0)}
            </p>
            <p className="text-sm text-gray-500">Courses Generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, tags, or description..."
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
          {/* Featured PDFs */}
          {featuredItems.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Featured Resources
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featuredItems.map((item) => (
                  <LibraryCard key={item.id} item={item} featured />
                ))}
              </div>
            </div>
          )}

          {/* All PDFs */}
          {regularItems.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                All Resources
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {regularItems.map((item) => (
                  <LibraryCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredLibraryItems.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No PDFs found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or create a custom course
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

            {/* PDF Preview Link */}
            {previewItem?.pdf_storage_path && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-5 w-5 text-red-500" />
                <span className="text-sm text-gray-700 flex-1 truncate">
                  {previewItem.pdf_name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = getPdfUrl(previewItem.pdf_storage_path);
                    if (url) window.open(url, "_blank");
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View PDF
                </Button>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>How it works:</strong> AI will analyze this PDF and generate a
                personalized course with modules, lessons, key points, and quizzes. You'll be
                automatically enrolled upon creation.
              </p>
            </div>

            {generationError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {generationError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => previewItem && handleGenerateFromPdf(previewItem)}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Course...
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