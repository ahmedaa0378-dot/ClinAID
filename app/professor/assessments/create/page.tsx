"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  Loader2,
  GripVertical,
  CheckCircle2,
  Users,
  Save,
  Clock,
  Calendar,
  Edit,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Course {
  id: string;
  title: string;
  code: string;
}

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  points: number;
}

interface Student {
  id: string;
  full_name: string;
  email: string;
}

export default function CreateAssessmentPage() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assessmentType, setAssessmentType] = useState("exam");
  const [courseId, setCourseId] = useState("");
  const [duration, setDuration] = useState(60);
  const [passingScore, setPassingScore] = useState(70);
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");

  // Data
  const [courses, setCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [professorId, setProfessorId] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("intermediate");

  // Edit question modal
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get professor
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

      // Fetch professor's courses
      if (profId) {
        const { data: coursesData } = await supabase
          .from("courses")
          .select("id, title, code")
          .eq("professor_id", profId)
          .eq("status", "active");

        setCourses(coursesData || []);
      }

      // Also fetch courses without professor (student-generated that might be relevant)
      const { data: allCourses } = await supabase
        .from("courses")
        .select("id, title, code")
        .eq("status", "active")
        .limit(20);

      if (allCourses) {
        const existingIds = courses.map(c => c.id);
        const newCourses = allCourses.filter(c => !existingIds.includes(c.id));
        setCourses(prev => [...prev, ...newCourses]);
      }

      // Fetch students
      const { data: studentsData } = await supabase
        .from("users")
        .select("id, full_name, email")
        .eq("role", "student")
        .order("full_name");

      setStudents(studentsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!courseId) {
      alert("Please select a course first");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/assessments/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          title,
          type: assessmentType,
          numQuestions,
          difficulty,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate questions");
      }

      // Add IDs to questions
      const questionsWithIds = data.questions.map((q: any, i: number) => ({
        ...q,
        id: `q-${Date.now()}-${i}`,
      }));

      setQuestions(questionsWithIds);

      // Auto-set title if empty
      if (!title && data.courseTitle) {
        setTitle(`${data.courseTitle} - ${assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)}`);
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      alert(error.message || "Failed to generate questions");
    } finally {
      setGenerating(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      question_text: "",
      question_type: "multiple_choice",
      options: ["", "", "", ""],
      correct_answer: 0,
      explanation: "",
      points: 10,
    };
    setQuestions([...questions, newQuestion]);
    setEditingQuestion(newQuestion);
    setShowEditModal(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setShowEditModal(true);
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion) return;

    setQuestions(questions.map(q =>
      q.id === editingQuestion.id ? editingQuestion : q
    ));
    setShowEditModal(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleSaveAssessment = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!courseId) {
      alert("Please select a course");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }
    if (selectedStudentIds.length === 0) {
      alert("Please assign to at least one student");
      return;
    }

    setSaving(true);
    try {
      const totalPoints = questions.reduce((acc, q) => acc + (q.points || 10), 0);

      // Create assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from("assessments")
        .insert({
          professor_id: professorId,
          course_id: courseId,
          title,
          description,
          type: assessmentType,
          duration_minutes: duration,
          total_points: totalPoints,
          passing_score: passingScore,
          instructions,
          due_date: dueDate || null,
          status: "active",
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Insert questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await supabase.from("assessment_questions").insert({
          assessment_id: assessment.id,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          points: q.points || 10,
          order_index: i,
        });
      }

      // Assign to students
      for (const studentId of selectedStudentIds) {
        await supabase.from("assessment_assignments").insert({
          assessment_id: assessment.id,
          student_id: studentId,
          status: "assigned",
        });
      }

      router.push("/professor/assessments");
    } catch (error: any) {
      console.error("Save error:", error);
      alert(error.message || "Failed to save assessment");
    } finally {
      setSaving(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map(s => s.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Create Assessment</h1>
        <p className="text-gray-500">Create a new quiz, exam, or assignment</p>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Cardiology Midterm Exam"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Type *</Label>
              <Select value={assessmentType} onValueChange={setAssessmentType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Course *</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title} ({course.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the assessment..."
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Passing Score (%)</Label>
              <Input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Instructions</Label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instructions for students..."
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Question Generator
          </CardTitle>
          <CardDescription>
            Generate questions based on the selected course content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <Label>Number of Questions</Label>
              <Input
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 10)}
                className="mt-1 w-[120px]"
                min={1}
                max={50}
              />
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="mt-1 w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGenerateQuestions}
              disabled={!courseId || generating}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Questions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Questions ({questions.length})</CardTitle>
            <Button variant="outline" onClick={handleAddQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No questions yet. Generate with AI or add manually.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 line-clamp-2">
                        {question.question_text || "No question text"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{question.question_type}</Badge>
                        <Badge variant="secondary">{question.points} pts</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign to Students */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Assign to Students
            </CardTitle>
            <Button variant="outline" onClick={() => setShowAssignModal(true)}>
              Select Students ({selectedStudentIds.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedStudentIds.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No students selected. Click "Select Students" to assign this assessment.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedStudentIds.map((id) => {
                const student = students.find((s) => s.id === id);
                return student ? (
                  <Badge key={id} variant="secondary" className="gap-1">
                    {student.full_name}
                    <button
                      onClick={() => toggleStudentSelection(id)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSaveAssessment} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save & Publish
            </>
          )}
        </Button>
      </div>

      {/* Edit Question Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-4">
              <div>
                <Label>Question Text *</Label>
                <Textarea
                  value={editingQuestion.question_text}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    question_text: e.target.value,
                  })}
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Options</Label>
                <div className="space-y-2 mt-1">
                  {editingQuestion.options.map((option, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={editingQuestion.correct_answer === i}
                        onChange={() => setEditingQuestion({
                          ...editingQuestion,
                          correct_answer: i,
                        })}
                        className="w-4 h-4"
                      />
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editingQuestion.options];
                          newOptions[i] = e.target.value;
                          setEditingQuestion({
                            ...editingQuestion,
                            options: newOptions,
                          });
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select the radio button for the correct answer
                </p>
              </div>

              <div>
                <Label>Explanation</Label>
                <Textarea
                  value={editingQuestion.explanation}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    explanation: e.target.value,
                  })}
                  rows={2}
                  className="mt-1"
                  placeholder="Explain why this is the correct answer..."
                />
              </div>

              <div>
                <Label>Points</Label>
                <Input
                  type="number"
                  value={editingQuestion.points}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    points: parseInt(e.target.value) || 10,
                  })}
                  className="mt-1 w-[100px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuestion}>Save Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Selection Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Students</DialogTitle>
            <DialogDescription>
              Choose which students should receive this assessment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllStudents}
              className="w-full"
            >
              {selectedStudentIds.length === students.length
                ? "Deselect All"
                : "Select All"}
            </Button>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {students.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
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
                        {isSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p className="font-medium">{student.full_name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowAssignModal(false)}>
              Done ({selectedStudentIds.length} selected)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
