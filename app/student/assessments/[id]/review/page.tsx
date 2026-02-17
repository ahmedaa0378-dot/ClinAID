"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  AlertCircle,
  Loader2,
  FileText,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface Response {
  question_id: string;
  selected_answer: number | null;
  is_correct: boolean;
  points_earned: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: string;
  duration_minutes: number;
  total_points: number;
  passing_score: number;
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
  time_spent_minutes: number | null;
}

export default function ReviewAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

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

      // Fetch responses
      const { data: responsesData, error: responsesError } = await supabase
        .from("assessment_responses")
        .select("*")
        .eq("assignment_id", assignmentId);

      if (responsesError) throw responsesError;

      const responsesMap: Record<string, Response> = {};
      (responsesData || []).forEach((r) => {
        responsesMap[r.question_id] = r;
      });
      setResponses(responsesMap);
    } catch (error) {
      console.error("Error fetching review data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const correctCount = Object.values(responses).filter((r) => r.is_correct).length;
  const incorrectCount = questions.length - correctCount;
  const unansweredCount = questions.length - Object.keys(responses).length;

  const formatDuration = (startedAt: string | null, completedAt: string | null) => {
    if (!startedAt || !completedAt) return "-";
    const start = new Date(startedAt).getTime();
    const end = new Date(completedAt).getTime();
    const minutes = Math.round((end - start) / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!assessment || !assignment) {
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

  const passed = (assignment.percentage || 0) >= assessment.passing_score;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/student/assessments")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
            <p className="text-gray-500">{assessment.course?.title}</p>
          </div>
          <Badge
            className={`text-lg py-1 px-4 ${
              passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {passed ? "Passed" : "Failed"}
          </Badge>
        </div>
      </div>

      {/* Score Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {/* Score */}
            <div className="col-span-2 md:col-span-1 text-center">
              <div
                className={`text-5xl font-bold mb-1 ${
                  passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {assignment.percentage || 0}%
              </div>
              <p className="text-gray-500 text-sm">
                {assignment.score || 0} / {assessment.total_points} pts
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block border-l border-gray-200" />

            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{correctCount}</p>
                <p className="text-gray-500 text-sm">Correct</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{incorrectCount}</p>
                <p className="text-gray-500 text-sm">Incorrect</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {formatDuration(assignment.started_at, assignment.completed_at)}
                </p>
                <p className="text-gray-500 text-sm">Time Taken</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Review */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Question Review</h2>

        {questions.map((question, index) => {
          const response = responses[question.id];
          const isCorrect = response?.is_correct;
          const selectedAnswer = response?.selected_answer;
          const wasAnswered = selectedAnswer !== undefined && selectedAnswer !== null;

          return (
            <Card
              key={question.id}
              className={`border-l-4 ${
                !wasAnswered
                  ? "border-l-gray-300"
                  : isCorrect
                  ? "border-l-green-500"
                  : "border-l-red-500"
              }`}
            >
              <CardContent className="p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                        !wasAnswered
                          ? "bg-gray-100 text-gray-600"
                          : isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <Badge variant="secondary">{question.points} pts</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {!wasAnswered ? (
                      <Badge variant="outline" className="text-gray-500">
                        Not Answered
                      </Badge>
                    ) : isCorrect ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Correct
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700">
                        <XCircle className="h-3 w-3 mr-1" />
                        Incorrect
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-gray-900 font-medium mb-4">{question.question_text}</p>

                {/* Options */}
                <div className="space-y-2 mb-4">
                  {question.options.map((option, optIndex) => {
                    const isSelected = selectedAnswer === optIndex;
                    const isCorrectAnswer = question.correct_answer === optIndex;

                    return (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg border-2 ${
                          isCorrectAnswer
                            ? "border-green-500 bg-green-50"
                            : isSelected && !isCorrect
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                              isCorrectAnswer
                                ? "bg-green-500 text-white"
                                : isSelected && !isCorrect
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span
                            className={`flex-1 ${
                              isCorrectAnswer
                                ? "text-green-800"
                                : isSelected && !isCorrect
                                ? "text-red-800"
                                : "text-gray-700"
                            }`}
                          >
                            {option}
                          </span>
                          {isCorrectAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                          {isSelected && !isCorrect && (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
                    <p className="text-sm text-blue-700">{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" onClick={() => router.push("/student/assessments")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>
        <Button onClick={() => router.push("/student/courses")}>
          Continue Learning
        </Button>
      </div>
    </div>
  );
}