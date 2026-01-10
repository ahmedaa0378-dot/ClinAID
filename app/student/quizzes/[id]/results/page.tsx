"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  Loader2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export default function QuizResultsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = params.id as string;
  const assignmentId = searchParams.get("assignment");

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadResults();
  }, [quizId, assignmentId]);

  const loadResults = async () => {
    setLoading(true);

    try {
      // Get quiz
      const { data: quizData } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", quizId)
        .single();

      // Get questions
      const { data: questionsData } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("question_number");

      // Get result
      const { data: resultData } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("assignment_id", assignmentId)
        .single();

      // Get responses
      const { data: responsesData } = await supabase
        .from("quiz_responses")
        .select("*")
        .eq("assignment_id", assignmentId);

      setQuiz(quizData);
      setQuestions(questionsData || []);
      setResult(resultData);
      setResponses(responsesData || []);
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getResponseForQuestion = (questionId: string) => {
    return responses.find((r) => r.question_id === questionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Results not found</h2>
        <Button className="mt-4" onClick={() => router.push("/student/quizzes")}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/student/quizzes")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
          <p className="text-gray-500">{quiz?.title}</p>
        </div>
      </div>

      {/* Result Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card
          className={`border-2 ${
            result.passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
          }`}
        >
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    result.passed ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  {result.passed ? (
                    <Trophy className="h-10 w-10 text-green-600" />
                  ) : (
                    <XCircle className="h-10 w-10 text-red-600" />
                  )}
                </div>
                <div>
                  <h2
                    className={`text-3xl font-bold ${
                      result.passed ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {result.passed ? "Congratulations!" : "Keep Learning!"}
                  </h2>
                  <p className={result.passed ? "text-green-600" : "text-red-600"}>
                    {result.passed
                      ? "You passed the quiz!"
                      : `You need ${quiz?.passing_score}% to pass`}
                  </p>
                </div>
              </div>

              <div
                className={`text-center p-6 rounded-2xl ${
                  result.passed ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <p
                  className={`text-5xl font-bold ${
                    result.passed ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {result.score_percentage?.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Your Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{result.correct_answers}</p>
            <p className="text-sm text-gray-500">Correct</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{result.wrong_answers}</p>
            <p className="text-sm text-gray-500">Wrong</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{result.total_questions}</p>
            <p className="text-sm text-gray-500">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              {formatTime(result.time_taken_seconds || 0)}
            </p>
            <p className="text-sm text-gray-500">Time Taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Professor Feedback */}
      {result.professor_feedback && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Lightbulb className="h-5 w-5" />
              Professor Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{result.professor_feedback}</p>
          </CardContent>
        </Card>
      )}

      {/* Review Answers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-500" />
            Review Answers
          </CardTitle>
          <Button variant="outline" onClick={() => setShowAnswers(!showAnswers)}>
            {showAnswers ? "Hide Answers" : "Show Answers"}
          </Button>
        </CardHeader>

        {showAnswers && (
          <CardContent className="space-y-4">
            {questions.map((question, index) => {
              const response = getResponseForQuestion(question.id);
              const isCorrect = response?.is_correct;
              const isExpanded = expandedQuestions.has(question.id);

              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-xl border-2 ${
                    isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => toggleQuestion(question.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? "bg-green-200" : "bg-red-200"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Question {index + 1}</p>
                        <p className="font-medium text-gray-800">{question.question_text}</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 pl-11 space-y-3"
                    >
                      {/* Options */}
                      <div className="space-y-2">
                        {question.options?.map((opt: any) => {
                          const isSelected = response?.selected_answer === opt.id;
                          const isCorrectAnswer = question.correct_answer === opt.id;

                          return (
                            <div
                              key={opt.id}
                              className={`p-3 rounded-lg flex items-center gap-2 ${
                                isCorrectAnswer
                                  ? "bg-green-100 border border-green-300"
                                  : isSelected
                                  ? "bg-red-100 border border-red-300"
                                  : "bg-white border border-gray-200"
                              }`}
                            >
                              <span className="font-semibold text-gray-500">
                                {opt.id.toUpperCase()}.
                              </span>
                              <span className="flex-1">{opt.text}</span>
                              {isCorrectAnswer && (
                                <Badge className="bg-green-500 text-white">Correct</Badge>
                              )}
                              {isSelected && !isCorrectAnswer && (
                                <Badge className="bg-red-500 text-white">Your Answer</Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-medium text-blue-800 mb-1">💡 Explanation</p>
                          <p className="text-sm text-blue-700">{question.explanation}</p>
                        </div>
                      )}

                      {/* Clinical Relevance */}
                      {question.clinical_relevance && (
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm font-medium text-purple-800 mb-1">
                            🏥 Clinical Relevance
                          </p>
                          <p className="text-sm text-purple-700">{question.clinical_relevance}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => router.push("/student/quizzes")}>
          Back to Quizzes
        </Button>
        {!result.passed && (
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => router.push("/student/quizzes")}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Another Quiz
          </Button>
        )}
      </div>
    </div>
  );
}