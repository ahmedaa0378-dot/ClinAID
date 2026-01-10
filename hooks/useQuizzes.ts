"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export interface Quiz {
  id: string;
  professor_id: string;
  college_id?: string;
  title: string;
  description?: string;
  topic?: string;
  difficulty_level: "easy" | "medium" | "hard";
  time_limit_minutes?: number;
  passing_score: number;
  is_ai_generated: boolean;
  ai_prompt_used?: string;
  is_published: boolean;
  total_questions: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_number: number;
  question_text: string;
  question_type: "multiple_choice" | "true_false" | "short_answer";
  options?: { id: string; text: string }[];
  correct_answer: string;
  explanation?: string;
  points: number;
  clinical_relevance?: string;
}

export interface QuizAssignment {
  id: string;
  quiz_id: string;
  student_id: string;
  assigned_by: string;
  due_date?: string;
  status: "assigned" | "in_progress" | "completed" | "expired";
  assigned_at: string;
  started_at?: string;
  completed_at?: string;
  quiz?: Quiz;
}

export interface QuizResult {
  id: string;
  assignment_id: string;
  student_id: string;
  quiz_id: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score_percentage: number;
  passed: boolean;
  time_taken_seconds?: number;
  professor_feedback?: string;
  completed_at: string;
}

export function useQuizzes() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // PROFESSOR FUNCTIONS
  // =====================================================

  // Create a new quiz
  const createQuiz = async (quizData: {
    title: string;
    description?: string;
    topic?: string;
    difficultyLevel?: "easy" | "medium" | "hard";
    timeLimitMinutes?: number;
    passingScore?: number;
    isAiGenerated?: boolean;
    aiPromptUsed?: string;
  }): Promise<Quiz | null> => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("quizzes")
        .insert({
          professor_id: user.id,
          college_id: profile?.college_id,
          title: quizData.title,
          description: quizData.description,
          topic: quizData.topic,
          difficulty_level: quizData.difficultyLevel || "medium",
          time_limit_minutes: quizData.timeLimitMinutes,
          passing_score: quizData.passingScore || 70,
          is_ai_generated: quizData.isAiGenerated ?? true,
          ai_prompt_used: quizData.aiPromptUsed,
          is_published: false,
          total_questions: 0,
        })
        .select()
        .single();

      if (dbError) throw dbError;
      return data;
    } catch (err: any) {
      console.error("Error creating quiz:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add questions to quiz
  const addQuestions = async (
    quizId: string,
    questions: {
      questionText: string;
      questionType?: "multiple_choice" | "true_false" | "short_answer";
      options?: { id: string; text: string }[];
      correctAnswer: string;
      explanation?: string;
      points?: number;
      clinicalRelevance?: string;
    }[]
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const questionsData = questions.map((q, index) => ({
        quiz_id: quizId,
        question_number: index + 1,
        question_text: q.questionText,
        question_type: q.questionType || "multiple_choice",
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points || 1,
        clinical_relevance: q.clinicalRelevance,
      }));

      const { error: dbError } = await supabase
        .from("quiz_questions")
        .insert(questionsData);

      if (dbError) throw dbError;

      // Update total questions count
      await supabase
        .from("quizzes")
        .update({ total_questions: questions.length })
        .eq("id", quizId);

      return true;
    } catch (err: any) {
      console.error("Error adding questions:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Publish quiz
  const publishQuiz = async (quizId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from("quizzes")
        .update({ is_published: true })
        .eq("id", quizId);

      if (dbError) throw dbError;
      return true;
    } catch (err: any) {
      console.error("Error publishing quiz:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Assign quiz to students
  const assignQuiz = async (
    quizId: string,
    studentIds: string[],
    dueDate?: string
  ): Promise<boolean> => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const assignments = studentIds.map((studentId) => ({
        quiz_id: quizId,
        student_id: studentId,
        assigned_by: user.id,
        due_date: dueDate,
        status: "assigned",
      }));

      const { error: dbError } = await supabase
        .from("quiz_assignments")
        .insert(assignments);

      if (dbError) throw dbError;

      // Get quiz info for notification
      const { data: quiz } = await supabase
        .from("quizzes")
        .select("title")
        .eq("id", quizId)
        .single();

      // Notify students
      const notifications = studentIds.map((studentId) => ({
        user_id: studentId,
        title: "New Quiz Assigned",
        message: `You have been assigned a new quiz: ${quiz?.title || "Quiz"}`,
        notification_type: "quiz_assigned",
        entity_type: "quiz",
        entity_id: quizId,
        action_url: `/student/quizzes/${quizId}`,
      }));

      await supabase.from("notifications").insert(notifications);

      return true;
    } catch (err: any) {
      console.error("Error assigning quiz:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get professor's quizzes
  const getProfessorQuizzes = async () => {
    if (!user) return [];

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("professor_id", user.id)
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;
      return data || [];
    } catch (err: any) {
      console.error("Error fetching quizzes:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get quiz results for professor
  const getQuizResults = async (quizId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("quiz_results")
        .select(`
          *,
          student:student_id (id, full_name, email)
        `)
        .eq("quiz_id", quizId)
        .order("completed_at", { ascending: false });

      if (dbError) throw dbError;
      return data || [];
    } catch (err: any) {
      console.error("Error fetching quiz results:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Professor adds feedback to quiz result
  const addQuizFeedback = async (
    resultId: string,
    feedback: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from("quiz_results")
        .update({ professor_feedback: feedback })
        .eq("id", resultId);

      if (dbError) throw dbError;
      return true;
    } catch (err: any) {
      console.error("Error adding feedback:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STUDENT FUNCTIONS
  // =====================================================

  // Get student's assigned quizzes
  const getStudentAssignments = async () => {
    if (!user) return [];

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("quiz_assignments")
        .select(`
          *,
          quiz:quiz_id (*)
        `)
        .eq("student_id", user.id)
        .order("assigned_at", { ascending: false });

      if (dbError) throw dbError;
      return data || [];
    } catch (err: any) {
      console.error("Error fetching assignments:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get quiz with questions (for taking the quiz)
  const getQuizWithQuestions = async (quizId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", quizId)
        .single();

      if (quizError) throw quizError;

      const { data: questions, error: questionsError } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("question_number");

      if (questionsError) throw questionsError;

      return { quiz, questions: questions || [] };
    } catch (err: any) {
      console.error("Error fetching quiz:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Start quiz (update assignment status)
  const startQuiz = async (assignmentId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from("quiz_assignments")
        .update({
          status: "in_progress",
          started_at: new Date().toISOString(),
        })
        .eq("id", assignmentId);

      if (dbError) throw dbError;
      return true;
    } catch (err: any) {
      console.error("Error starting quiz:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Submit quiz response
  const submitQuizResponse = async (
    assignmentId: string,
    questionId: string,
    selectedAnswer: string,
    isCorrect: boolean,
    pointsEarned: number,
    timeSpentSeconds?: number
  ): Promise<boolean> => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase.from("quiz_responses").insert({
        assignment_id: assignmentId,
        question_id: questionId,
        student_id: user.id,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        points_earned: pointsEarned,
        time_spent_seconds: timeSpentSeconds,
      });

      if (dbError) throw dbError;
      return true;
    } catch (err: any) {
      console.error("Error submitting response:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Complete quiz and calculate result
  const completeQuiz = async (
    assignmentId: string,
    quizId: string,
    totalQuestions: number,
    correctAnswers: number,
    timeTakenSeconds: number,
    passingScore: number
  ): Promise<QuizResult | null> => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const scorePercentage = (correctAnswers / totalQuestions) * 100;
      const passed = scorePercentage >= passingScore;

      // Create result
      const { data: result, error: resultError } = await supabase
        .from("quiz_results")
        .insert({
          assignment_id: assignmentId,
          student_id: user.id,
          quiz_id: quizId,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          wrong_answers: totalQuestions - correctAnswers,
          score_percentage: scorePercentage,
          passed,
          time_taken_seconds: timeTakenSeconds,
        })
        .select()
        .single();

      if (resultError) throw resultError;

      // Update assignment status
      await supabase
        .from("quiz_assignments")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", assignmentId);

      // Notify professor
      const { data: assignment } = await supabase
        .from("quiz_assignments")
        .select("assigned_by, quiz:quiz_id (title)")
        .eq("id", assignmentId)
        .single();

      if (assignment) {
        const quizTitle = Array.isArray(assignment.quiz) && assignment.quiz.length > 0
          ? assignment.quiz[0].title
          : "a quiz";

        await supabase.from("notifications").insert({
          user_id: assignment.assigned_by,
          title: "Quiz Completed",
          message: `${profile?.full_name || "A student"} has completed ${quizTitle} with a score of ${scorePercentage.toFixed(0)}%`,
          notification_type: "quiz_completed",
          entity_type: "quiz_result",
          entity_id: result.id,
          action_url: `/professor/quizzes/${quizId}/results`,
        });
      }

      return result;
    } catch (err: any) {
      console.error("Error completing quiz:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get student's quiz results
  const getStudentResults = async () => {
    if (!user) return [];

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("quiz_results")
        .select(`
          *,
          quiz:quiz_id (title, topic, difficulty_level)
        `)
        .eq("student_id", user.id)
        .order("completed_at", { ascending: false });

      if (dbError) throw dbError;
      return data || [];
    } catch (err: any) {
      console.error("Error fetching results:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    // Professor functions
    createQuiz,
    addQuestions,
    publishQuiz,
    assignQuiz,
    getProfessorQuizzes,
    getQuizResults,
    addQuizFeedback,
    // Student functions
    getStudentAssignments,
    getQuizWithQuestions,
    startQuiz,
    submitQuizResponse,
    completeQuiz,
    getStudentResults,
  };
}