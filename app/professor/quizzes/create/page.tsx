"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Clock,
  Target,
  Users,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useQuizzes } from "@/hooks/useQuizzes";

interface GeneratedQuestion {
  questionText: string;
  questionType: "multiple_choice" | "true_false";
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  clinicalRelevance?: string;
}

export default function CreateQuizPage() {
  const router = useRouter();
  const { createQuiz, addQuestions, publishQuiz, loading } = useQuizzes();

  // Quiz settings
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [passingScore, setPassingScore] = useState<number>(70);
  const [questionCount, setQuestionCount] = useState<number>(10);

  // AI generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Status
  const [step, setStep] = useState<"settings" | "generate" | "review" | "assign">("settings");
  const [quizId, setQuizId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const generateQuestions = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic for the quiz.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          questionCount,
          title,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate questions");

      const data = await response.json();
      setGeneratedQuestions(data.questions);
      setStep("review");
    } catch (err) {
      console.error("Error generating questions:", err);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateQuestion = (index: number, updates: Partial<GeneratedQuestion>) => {
    setGeneratedQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = (index: number) => {
    setGeneratedQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const addManualQuestion = () => {
    setGeneratedQuestions((prev) => [
      ...prev,
      {
        questionText: "",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "" },
          { id: "b", text: "" },
          { id: "c", text: "" },
          { id: "d", text: "" },
        ],
        correctAnswer: "a",
        explanation: "",
      },
    ]);
    setEditingIndex(generatedQuestions.length);
  };

  const saveQuiz = async () => {
    if (!title.trim()) {
      alert("Please enter a quiz title.");
      return;
    }

    if (generatedQuestions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    setIsSaving(true);

    try {
      // Create quiz
      const quiz = await createQuiz({
        title,
        description,
        topic,
        difficultyLevel: difficulty,
        timeLimitMinutes: timeLimit,
        passingScore,
        isAiGenerated: true,
        aiPromptUsed: `Topic: ${topic}, Difficulty: ${difficulty}, Count: ${questionCount}`,
      });

      if (!quiz) throw new Error("Failed to create quiz");

      // Add questions
      const success = await addQuestions(quiz.id, generatedQuestions);
      if (!success) throw new Error("Failed to add questions");

      setQuizId(quiz.id);
      setStep("assign");
    } catch (err) {
      console.error("Error saving quiz:", err);
      alert("Failed to save quiz. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!quizId) return;

    const success = await publishQuiz(quizId);
    if (success) {
      router.push(`/professor/quizzes/${quizId}`);
    } else {
      alert("Failed to publish quiz.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/professor/quizzes")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create AI Quiz</h1>
          <p className="text-gray-500">Generate clinical questions with AI</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {["settings", "generate", "review", "assign"].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? "bg-emerald-500 text-white"
                  : ["settings", "generate", "review", "assign"].indexOf(step) > i
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            {i < 3 && (
              <div
                className={`w-12 h-1 ${
                  ["settings", "generate", "review", "assign"].indexOf(step) > i
                    ? "bg-emerald-500"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Settings */}
      {step === "settings" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                Quiz Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Cardiovascular Assessment Quiz"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the quiz..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic for AI Generation *
                </label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Acute Myocardial Infarction, Pneumonia, Diabetes Management"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific for better question quality
                </p>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <div className="flex gap-3">
                  {(["easy", "medium", "hard"] as const).map((d) => (
                    <Button
                      key={d}
                      type="button"
                      variant={difficulty === d ? "default" : "outline"}
                      onClick={() => setDifficulty(d)}
                      className={difficulty === d ? "bg-emerald-600" : ""}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <div className="flex gap-3">
                  {[5, 10, 15, 20].map((n) => (
                    <Button
                      key={n}
                      type="button"
                      variant={questionCount === n ? "default" : "outline"}
                      onClick={() => setQuestionCount(n)}
                      className={questionCount === n ? "bg-emerald-600" : ""}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value) || 30)}
                    min={5}
                    max={120}
                    className="w-24"
                  />
                  <span className="text-gray-500">minutes</span>
                </div>
              </div>

              {/* Passing Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%)
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                    min={0}
                    max={100}
                    className="w-24"
                  />
                  <span className="text-gray-500">%</span>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateQuestions}
                disabled={isGenerating || !topic.trim()}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Questions with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Questions with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Review Questions */}
      {step === "review" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Review Questions ({generatedQuestions.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={addManualQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
                <Button variant="outline" onClick={() => setStep("settings")}>
                  Regenerate
                </Button>
              </div>
            </CardHeader>
          </Card>

          {generatedQuestions.map((question, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-emerald-100 text-emerald-800">
                    Question {index + 1}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuestion(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {editingIndex === index ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <Textarea
                      value={question.questionText}
                      onChange={(e) => updateQuestion(index, { questionText: e.target.value })}
                      placeholder="Question text..."
                      className="min-h-[80px]"
                    />

                    <div className="space-y-2">
                      {question.options.map((opt, optIndex) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={question.correctAnswer === opt.id}
                            onChange={() => updateQuestion(index, { correctAnswer: opt.id })}
                            className="text-emerald-500"
                          />
                          <Input
                            value={opt.text}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[optIndex] = { ...opt, text: e.target.value };
                              updateQuestion(index, { options: newOptions });
                            }}
                            placeholder={`Option ${opt.id.toUpperCase()}`}
                          />
                        </div>
                      ))}
                    </div>

                    <Textarea
                      value={question.explanation}
                      onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                      placeholder="Explanation (shown after answering)..."
                      className="min-h-[60px]"
                    />

                    <Button variant="outline" onClick={() => setEditingIndex(null)}>
                      Done Editing
                    </Button>
                  </div>
                ) : (
                  /* View Mode */
                  <div
                    className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg -m-2"
                    onClick={() => setEditingIndex(index)}
                  >
                    <p className="font-medium text-gray-800 mb-3">{question.questionText}</p>
                    <div className="space-y-2">
                      {question.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-lg flex items-center gap-2 ${
                            question.correctAnswer === opt.id
                              ? "bg-emerald-100 border border-emerald-300"
                              : "bg-gray-50"
                          }`}
                        >
                          <span className="font-semibold text-gray-500">{opt.id.toUpperCase()}.</span>
                          <span>{opt.text}</span>
                          {question.correctAnswer === opt.id && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                    {question.explanation && (
                      <p className="text-sm text-gray-500 mt-3 italic">
                        💡 {question.explanation}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Click to edit</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Save Button */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep("settings")} className="flex-1">
              Back to Settings
            </Button>
            <Button
              onClick={saveQuiz}
              disabled={isSaving || generatedQuestions.length === 0}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save Quiz
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Assign */}
      {step === "assign" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Created!</h2>
              <p className="text-gray-600 mb-6">
                Your quiz "{title}" with {generatedQuestions.length} questions has been saved.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push("/professor/quizzes")}>
                  View All Quizzes
                </Button>
                <Button
                  onClick={handlePublish}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Publish & Assign to Students
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}