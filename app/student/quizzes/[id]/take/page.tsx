"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Flag,
  Loader2,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuizzes } from "@/hooks/useQuizzes";

export default function TakeQuizPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = params.id as string;
  const assignmentId = searchParams.get("assignment");

  const {
    getQuizWithQuestions,
    startQuiz,
    submitQuizResponse,
    completeQuiz,
    loading,
  } = useQuizzes();

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Load quiz data
  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (!quizStarted || !timeRemaining) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining]);

  const loadQuiz = async () => {
    const data = await getQuizWithQuestions(quizId);
    if (data) {
      setQuiz(data.quiz);
      setQuestions(data.questions);
      if (data.quiz.time_limit_minutes) {
        setTimeRemaining(data.quiz.time_limit_minutes * 60);
      }
    }
  };

  const handleStartQuiz = async () => {
    if (assignmentId) {
      await startQuiz(assignmentId);
    }
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  const selectAnswer = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const toggleFlag = (index: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const handleSubmit = async () => {
    if (!assignmentId || !quiz) return;

    const unanswered = questions.filter((q) => !answers[q.id]).length;
    if (unanswered > 0) {
      const confirm = window.confirm(
        `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Are you sure you want to submit?`
      );
      if (!confirm) return;
    }

    setIsSubmitting(true);

    try {
      // Calculate results
      let correctCount = 0;
      for (const question of questions) {
        const selectedAnswer = answers[question.id];
        const isCorrect = selectedAnswer === question.correct_answer;
        if (isCorrect) correctCount++;

        // Save each response
        await submitQuizResponse(
          assignmentId,
          question.id,
          selectedAnswer || "",
          isCorrect,
          isCorrect ? question.points : 0
        );
      }

      // Calculate time taken
      const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

      // Complete the quiz
      const result = await completeQuiz(
        assignmentId,
        quizId,
        questions.length,
        correctCount,
        timeTaken,
        quiz.passing_score
      );

      if (result) {
        router.push(`/student/quizzes/${quizId}/results?assignment=${assignmentId}`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentIndex];

  if (loading || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  // Pre-quiz screen
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
            <p className="text-gray-600 mb-6">{quiz.description}</p>

            <div className="flex justify-center gap-6 mb-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{questions.length}</p>
                <p className="text-sm text-gray-500">Questions</p>
              </div>
              {quiz.time_limit_minutes && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">{quiz.time_limit_minutes}</p>
                  <p className="text-sm text-gray-500">Minutes</p>
                </div>
              )}
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{quiz.passing_score}%</p>
                <p className="text-sm text-gray-500">To Pass</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-yellow-800 mb-2">Before you begin:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Make sure you have a stable internet connection</li>
                <li>• You cannot pause the quiz once started</li>
                {quiz.time_limit_minutes && (
                  <li>• The quiz will auto-submit when time runs out</li>
                )}
                <li>• Review all questions before submitting</li>
              </ul>
            </div>

            <Button
              onClick={handleStartQuiz}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-gray-800">{quiz.title}</h1>
              <p className="text-sm text-gray-500">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {timeRemaining !== null && (
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    timeRemaining < 60
                      ? "bg-red-100 text-red-700"
                      : timeRemaining < 300
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
                </div>
              )}
              <Badge className="bg-emerald-100 text-emerald-800">
                {answeredCount}/{questions.length} Answered
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Navigator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                  currentIndex === index
                    ? "bg-emerald-500 text-white"
                    : answers[questions[index]?.id]
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } ${flaggedQuestions.has(index) ? "ring-2 ring-orange-400" : ""}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <Badge className="mb-2">Question {currentIndex + 1}</Badge>
                <CardTitle className="text-lg font-medium text-gray-800">
                  {currentQuestion?.question_text}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFlag(currentIndex)}
                className={flaggedQuestions.has(currentIndex) ? "text-orange-500" : "text-gray-400"}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion?.options?.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() => selectAnswer(currentQuestion.id, option.id)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    answers[currentQuestion.id] === option.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        answers[currentQuestion.id] === option.id
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {option.id.toUpperCase()}
                    </span>
                    <span className="text-gray-700">{option.text}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => goToQuestion(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Quiz
                </>
              )}
            </Button>
          ) : (
            <Button onClick={() => goToQuestion(currentIndex + 1)}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}