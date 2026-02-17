"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Clock,
  Target,
  Loader2,
  CheckCircle2,
  GraduationCap,
  Stethoscope,
  Brain,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SPECIALTIES = [
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
  "Orthopedics",
  "Dermatology",
  "Gastroenterology",
  "Pulmonology",
  "Nephrology",
  "Endocrinology",
  "Rheumatology",
  "Hematology",
  "Obstetrics & Gynecology",
  "Radiology",
  "Pathology",
  "Anesthesiology",
  "Ophthalmology",
  "ENT",
  "Urology",
];

const YEARS = [
  { value: "1st Year", label: "1st Year - Preclinical" },
  { value: "2nd Year", label: "2nd Year - Preclinical" },
  { value: "3rd Year", label: "3rd Year - Clinical Rotations" },
  { value: "4th Year", label: "4th Year - Advanced Clinical" },
  { value: "Resident", label: "Resident/PGY" },
  { value: "Fellow", label: "Fellow" },
];

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner", description: "Basic concepts and foundations" },
  { value: "intermediate", label: "Intermediate", description: "Clinical applications and case studies" },
  { value: "advanced", label: "Advanced", description: "Complex cases and research-level content" },
];

const DURATIONS = [
  { value: 4, label: "4 weeks - Quick Overview" },
  { value: 6, label: "6 weeks - Standard" },
  { value: 8, label: "8 weeks - Comprehensive" },
  { value: 10, label: "10 weeks - In-Depth" },
  { value: 12, label: "12 weeks - Extensive" },
];

export default function StudentGeneratePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    topic: "",
    specialty: "",
    targetYear: "",
    difficulty: "intermediate",
    durationWeeks: 8,
    keyDiseases: [] as string[],
    focusAreas: "",
    additionalNotes: "",
  });

  const [diseaseInput, setDiseaseInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  // Get student ID on mount
  useState(() => {
    const getStudentId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setStudentId(user.id);
      } else {
        const { data: anyStudent } = await supabase
          .from("users")
          .select("id")
          .eq("role", "student")
          .limit(1)
          .single();
        setStudentId(anyStudent?.id || null);
      }
    };
    getStudentId();
  });

  const addDisease = () => {
    if (diseaseInput.trim() && !formData.keyDiseases.includes(diseaseInput.trim())) {
      setFormData({
        ...formData,
        keyDiseases: [...formData.keyDiseases, diseaseInput.trim()],
      });
      setDiseaseInput("");
    }
  };

  const removeDisease = (disease: string) => {
    setFormData({
      ...formData,
      keyDiseases: formData.keyDiseases.filter((d) => d !== disease),
    });
  };

  const handleGenerate = async () => {
    setError("");

    // Validation
    if (!formData.topic.trim()) {
      setError("Please enter a course topic");
      return;
    }
    if (!formData.specialty) {
      setError("Please select a specialty");
      return;
    }
    if (!formData.targetYear) {
      setError("Please select your year of study");
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch("/api/courses/generate-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          studentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate course");
      }

      setGeneratedCourse(data);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate course");
    } finally {
      setGenerating(false);
    }
  };

  const handleViewCourse = () => {
    if (generatedCourse?.courseId) {
      router.push(`/student/courses/${generatedCourse.courseId}`);
    }
  };

  // Success Screen
  if (generatedCourse) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Generated!</h1>
            <p className="text-gray-500 mb-6">
              Your personalized course has been created and you're automatically enrolled.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{generatedCourse.course?.image || "📚"}</span>
                <div>
                  <h2 className="font-bold text-lg">{generatedCourse.course?.title}</h2>
                  <p className="text-sm text-gray-500">{generatedCourse.course?.code}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{generatedCourse.course?.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {generatedCourse.course?.modules?.length || 0} Modules
                </Badge>
                <Badge variant="outline">
                  {generatedCourse.totalLessons || 0} Lessons
                </Badge>
                <Badge variant="outline">
                  {formData.durationWeeks} Weeks
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  {formData.difficulty}
                </Badge>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => {
                setGeneratedCourse(null);
                setFormData({
                  topic: "",
                  specialty: "",
                  targetYear: "",
                  difficulty: "intermediate",
                  durationWeeks: 8,
                  keyDiseases: [],
                  focusAreas: "",
                  additionalNotes: "",
                });
              }}>
                Generate Another
              </Button>
              <Button onClick={handleViewCourse}>
                <BookOpen className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/student/library")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Library
        </Button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Course Generator</h1>
            <p className="text-gray-500">Create a personalized course tailored to your needs</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Course Details
          </CardTitle>
          <CardDescription>
            Tell us what you want to learn and we'll create a custom course for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic */}
          <div>
            <Label htmlFor="topic">Course Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g., Congestive Heart Failure Management"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific about what you want to learn
            </p>
          </div>

          {/* Specialty & Year Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Medical Specialty *</Label>
              <Select
                value={formData.specialty}
                onValueChange={(value) => setFormData({ ...formData, specialty: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Year of Study *</Label>
              <Select
                value={formData.targetYear}
                onValueChange={(value) => setFormData({ ...formData, targetYear: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your year" />
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

          {/* Difficulty Selection */}
          <div>
            <Label>Level of Detail *</Label>
            <div className="grid md:grid-cols-3 gap-3 mt-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setFormData({ ...formData, difficulty: d.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.difficulty === d.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900">{d.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{d.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label>Course Duration</Label>
            <Select
              value={formData.durationWeeks.toString()}
              onValueChange={(value) => setFormData({ ...formData, durationWeeks: parseInt(value) })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value.toString()}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Key Diseases/Conditions */}
          <div>
            <Label>Key Diseases/Conditions to Cover</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="e.g., Myocardial Infarction"
                value={diseaseInput}
                onChange={(e) => setDiseaseInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDisease())}
              />
              <Button type="button" variant="outline" onClick={addDisease}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.keyDiseases.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keyDiseases.map((disease) => (
                  <Badge key={disease} variant="secondary" className="gap-1">
                    {disease}
                    <button onClick={() => removeDisease(disease)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Press Enter or click + to add multiple conditions
            </p>
          </div>

          {/* Focus Areas */}
          <div>
            <Label htmlFor="focusAreas">Special Focus Areas (Optional)</Label>
            <Textarea
              id="focusAreas"
              placeholder="e.g., Focus on diagnostic criteria, treatment protocols, and patient communication..."
              value={formData.focusAreas}
              onChange={(e) => setFormData({ ...formData, focusAreas: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any specific requirements or learning preferences..."
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="mt-1"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">What You'll Get</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  4 comprehensive modules with {Math.ceil(formData.durationWeeks / 2)} lessons each
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Detailed content tailored to {formData.targetYear || "your level"}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Key points and clinical pearls for each lesson
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Interactive quizzes with explanations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Progress tracking and completion certificates
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full py-6 text-lg"
        size="lg"
      >
        {generating ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Generating Your Course... (1-2 minutes)
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Generate My Course
          </>
        )}
      </Button>
    </div>
  );
}