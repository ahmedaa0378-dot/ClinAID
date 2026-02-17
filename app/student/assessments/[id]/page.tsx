"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Flag,
  Send,
  XCircle,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  points: number;
  order_index: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: string;
  duration_minutes: number;
  total_points: number;
  passing_score: number;
  instructions: string;
  show_answers_after: boolean;
  course: {
    title: string;
    code: string;
  } | null;
}

interface Assignment {
  id: string;
  assessment_id: string;
  status: string;
  score: number | null;
  percentage: number | null;
  started_at: string | null;
  completed_at: string | null;
}

export default function TakeAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    percentage: number;
    passed: boolean;
    totalPoints: number;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch assignment
      const { data: assignmentData, error: assignmentError } = await supabase
        .from("assessment_assignments")
        .select("*")
        .eq("id", assignmentId)
        .single();

      if (assignmentError) throw assignmentError;
      setAssignment(assignmentData);

      // If already completed, redirect to review
      if (assignmentData.status === "completed" || assignmentData.status === "graded") {
        router.push(`/student/assessments/${assignmentId}/review`);
        return;
      }

      // Fetch assessment with course
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("assessments")
        .select(`
          *,
          course:courses(title, code)
        `)
        .eq("id", assignmentData.assessment_id)
        .single();

      if (assessmentError) throw assessmentError;
      setAssessment(assessmentData);

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("assessment_questions")
        .select("*")
        .eq("assessment_id", assignmentData.assessment_id)
        .order("order_index");

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);

      // Load existing responses
      const { data: responsesData } = await supabase
        .from("assessment_responses")
        .select("question_id, selected_answer")
        .eq("assignment_id", assignmentId);

      if (responsesData) {
        const existingAnswers: Record<string, number> = {};
        responsesData.forEach((r) => {
          if (r.selected_answer !== null) {
            existingAnswers[r.question_id] = r.selected_answer;
          }
        });
        setAnswers(existingAnswers);
      }

      // Set timer
      if (assessmentData.duration_minutes) {
        // Calculate remaining time if already started
        if (assignmentData.started_at) {
          const startTime = new Date(assignmentData.started_at).getTime();
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const remaining = assessmentData.duration_minutes * 60 - elapsed;
          setTimeLeft(Math.max(0, remaining));
        } else {
          setTimeLeft(assessmentData.duration_minutes * 60);
        }
      }

      // Mark as started if not already
      if (assignmentData.status === "assigned") {
        await supabase
          .from("assessment_assignments")
          .update({
            status: "in_progress",
            started_at: new Date().toISOString(),
          })
          .eq("id", assignmentId);
      }
    } catch (error) {
      console.error("Error fetching assessment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = async (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));

    // Save response to database
    const question = questions.find((q) => q.id === questionId);
    const isCorrect = question?.correct_answer === answerIndex;
    const pointsEarned = isCorrect ? question?.points || 10 : 0;

    // Check if response exists
    const { data: existingResponse } = await supabase
      .from("assessment_responses")
      .select("id")
      .eq("assignment_id", assignmentId)
      .eq("question_id", questionId)
      .single();

    if (existingResponse) {
      // Update existing
      await supabase
        .from("assessment_responses")
        .update({
          selected_answer: answerIndex,
          is_correct: isCorrect,
          points_earned: pointsEarned,
          answered_at: new Date().toISOString(),
        })
        .eq("id", existingResponse.id);
    } else {
      // Insert new
      await supabase.from("assessment_responses").insert({
        assignment_id: assignmentId,
        question_id: questionId,
        selected_answer: answerIndex,
        is_correct: isCorrect,
        points_earned: pointsEarned,
      });
    }
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setShowSubmitModal(false);

    try {
      // Calculate score
      let totalScore = 0;
      let totalPoints = 0;

      for (const question of questions) {
        totalPoints += question.points || 10;
        const selectedAnswer = answers[question.id];
        if (selectedAnswer === question.correct_answer) {
          totalScore += question.points || 10;
        }
      }

      const percentage = Math.round((totalScore / totalPoints) * 100);
      const passed = percentage >= (assessment?.passing_score || 70);

      // Update assignment
      await supabase
        .from("assessment_assignments")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          score: totalScore,
          percentage: percentage,
        })
        .eq("id", assignmentId);

      setResult({
        score: totalScore,
        percentage,
        passed,
        totalPoints,
      });
      setShowResultModal(true);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit assessment");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!assessment || !currentQuestion) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Assessment not found</h2>
        <Button onClick={() => router.push("/student/assessments")}>
          Back to Assessments
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{assessment.title}</h1>
          <p className="text-gray-500">{assessment.course?.title}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Timer */}
          {timeLeft !== null && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg ${
                timeLeft < 300
                  ? "bg-red-100 text-red-700"
                  : timeLeft < 600
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Clock className="h-5 w-5" />
              {formatTime(timeLeft)}
            </div>
          )}
          {/* Progress */}
          <Badge variant="outline" className="text-sm py-1 px-3">
            {answeredCount} / {questions.length} answered
          </Badge>
        </div>
      </div>

      {/* Question Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => {
              const isAnswered = answers[q.id] !== undefined;
              const isFlagged = flaggedQuestions.has(q.id);
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-all relative ${
                    isCurrent
                      ? "bg-blue-600 text-white"
                      : isAnswered
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">Question {currentIndex + 1} of {questions.length}</Badge>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{currentQuestion.points} points</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFlag(currentQuestion.id)}
                className={flaggedQuestions.has(currentQuestion.id) ? "text-orange-500" : ""}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Text */}
          <p className="text-lg font-medium text-gray-900">{currentQuestion.question_text}</p>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(currentQuestion.id, index)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className={isSelected ? "text-blue-900" : "text-gray-700"}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-3">
          {currentIndex === questions.length - 1 ? (
            <Button
              onClick={() => setShowSubmitModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Assessment
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assessment?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your assessment?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Questions Answered:</span>
                <span className="font-medium">
                  {answeredCount} / {questions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Flagged for Review:</span>
                <span className="font-medium">{flaggedQuestions.size}</span>
              </div>
            </div>

            {answeredCount < questions.length && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span>You have {questions.length - answeredCount} unanswered questions.</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
              Continue Working
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Result Modal */}
      <Dialog open={showResultModal} onOpenChange={() => {}}>
        <DialogContent className="text-center">
          <div className="py-6">
            {result?.passed ? (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-green-600" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {result?.passed ? "Congratulations!" : "Assessment Complete"}
            </h2>

            <p className="text-gray-500 mb-6">
              {result?.passed
                ? "You passed the assessment!"
                : "You didn't pass this time. Review and try again!"}
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-5xl font-bold mb-2" style={{
                color: result?.passed ? "#16a34a" : "#dc2626"
              }}>
                {result?.percentage}%
              </div>
              <p className="text-gray-500">
                {result?.score} / {result?.totalPoints} points
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Passing score: {assessment.passing_score}%
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/student/assessments")}
              >
                Back to Assessments
              </Button>
              <Button
                onClick={() => router.push(`/student/assessments/${assignmentId}/review`)}
              >
                Review Answers
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}