"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  Clock,
  FileText,
  CheckCircle2,
  Play,
  HelpCircle,
  Sparkles,
  Award,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Lesson {
  id: string;
  title: string;
  description: string;
  content_markdown: string;
  duration_minutes: number;
  key_points: string[];
  quiz_questions: any[];
  order_index: number;
}

interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  image: string;
  duration_weeks: number;
  total_lessons: number;
  status: string;
  objectives: string[];
  modules: any[];
}

interface Enrollment {
  id: string;
  progress_percent: number;
  completed_at: string | null;
}

export default function StudentCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);

  // Lesson navigation
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      let sId = user?.id;

      // Fallback for development
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

      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

      if (!lessonsError && lessonsData) {
        setLessons(lessonsData);
        if (lessonsData.length > 0) {
          setActiveLesson(lessonsData[0]);
        }
      }

      // Fetch enrollment if student
      if (sId) {
        const { data: enrollmentData } = await supabase
          .from("course_enrollments")
          .select("*")
          .eq("course_id", courseId)
          .eq("student_id", sId)
          .single();

        if (enrollmentData) {
          setEnrollment(enrollmentData);
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleIndex: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleIndex)
        ? prev.filter((i) => i !== moduleIndex)
        : [...prev, moduleIndex]
    );
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setShowQuiz(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    if (!quizSubmitted) {
      setQuizAnswers({ ...quizAnswers, [questionIndex]: answerIndex });
    }
  };

  const handleSubmitQuiz = async () => {
    if (!activeLesson?.quiz_questions) return;

    let correct = 0;
    activeLesson.quiz_questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct_answer) correct++;
    });

    const score = Math.round((correct / activeLesson.quiz_questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    // If passed (70%+), mark lesson as complete
    if (score >= 70 && activeLesson) {
      await markLessonComplete(activeLesson.id);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (completedLessonIds.includes(lessonId)) return;

    const newCompletedIds = [...completedLessonIds, lessonId];
    setCompletedLessonIds(newCompletedIds);

    // Update progress in database
    if (studentId && enrollment) {
      const progressPercent = Math.round((newCompletedIds.length / lessons.length) * 100);
      const isComplete = progressPercent === 100;

      await supabase
        .from("course_enrollments")
        .update({
          progress_percent: progressPercent,
          completed_at: isComplete ? new Date().toISOString() : null,
        })
        .eq("id", enrollment.id);

      setEnrollment({
        ...enrollment,
        progress_percent: progressPercent,
        completed_at: isComplete ? new Date().toISOString() : null,
      });
    }
  };

  const calculateProgress = () => {
    if (lessons.length === 0) return 0;
    return Math.round((completedLessonIds.length / lessons.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Course not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/student/courses")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Courses
        </Button>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-4xl">
              {course.image || "📚"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{course.title}</h1>
              <p className="text-blue-100 text-sm mb-3">{course.code}</p>
              <p className="text-blue-50 text-sm mb-4">{course.description}</p>

              {/* Progress Bar */}
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${enrollment?.progress_percent || calculateProgress()}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span>{enrollment?.progress_percent || calculateProgress()}% Complete</span>
                <span>
                  {completedLessonIds.length} / {lessons.length} lessons
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar - Lessons List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Content</CardTitle>
              <CardDescription>
                {lessons.length} lessons • {course.duration_weeks} weeks
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 max-h-[600px] overflow-y-auto">
              {course.modules && course.modules.length > 0 ? (
                // If course has modules, show accordion
                <div className="divide-y">
                  {course.modules.map((module, moduleIndex) => {
                    const isExpanded = expandedModules.includes(moduleIndex);
                    const moduleLessons = module.lessons || [];

                    return (
                      <div key={moduleIndex}>
                        <button
                          onClick={() => toggleModule(moduleIndex)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                            <div className="text-left">
                              <p className="font-medium text-sm">{module.title}</p>
                              <p className="text-xs text-gray-500">
                                {moduleLessons.length} lessons
                              </p>
                            </div>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="bg-gray-50 px-2 pb-2">
                            {moduleLessons.map((lesson: any, lessonIndex: number) => {
                              // Find matching DB lesson
                              const dbLesson = lessons.find(
                                (l) => l.title === lesson.title
                              ) || lessons[moduleIndex * moduleLessons.length + lessonIndex];

                              const isActive = activeLesson?.id === dbLesson?.id;
                              const isCompleted = dbLesson && completedLessonIds.includes(dbLesson.id);

                              return (
                                <button
                                  key={lessonIndex}
                                  onClick={() => dbLesson && handleSelectLesson(dbLesson)}
                                  className={`w-full text-left p-3 rounded-lg mb-1 transition-colors flex items-center gap-3 ${
                                    isActive
                                      ? "bg-blue-100 text-blue-900"
                                      : "bg-white hover:bg-gray-100"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                  ) : (
                                    <Play className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{lesson.title}</p>
                                    <p className="text-xs text-gray-500">
                                      {lesson.duration_minutes || 30} min
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Simple lesson list if no modules
                <div className="p-4 space-y-2">
                  {lessons.map((lesson, index) => {
                    const isActive = activeLesson?.id === lesson.id;
                    const isCompleted = completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson)}
                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                          isActive
                            ? "bg-blue-100 text-blue-900"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs flex-shrink-0">
                            {index + 1}
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lesson.title}</p>
                          <p className="text-xs text-gray-500">
                            {lesson.duration_minutes || 30} min
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Lesson Viewer */}
        <div className="lg:col-span-2">
          {activeLesson ? (
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{activeLesson.title}</CardTitle>
                    <CardDescription>{activeLesson.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {activeLesson.duration_minutes || 30} min
                    </Badge>
                    {activeLesson.quiz_questions && activeLesson.quiz_questions.length > 0 && (
                      <Button
                        variant={showQuiz ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setShowQuiz(!showQuiz);
                          if (!showQuiz) {
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                          }
                        }}
                      >
                        <HelpCircle className="h-4 w-4 mr-1" />
                        Take Quiz
                      </Button>
                    )}
                    {completedLessonIds.includes(activeLesson.id) && (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-6">
                {!showQuiz ? (
                  <>
                    {/* Key Points */}
                    {activeLesson.key_points && activeLesson.key_points.length > 0 && (
                      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4" /> Key Points
                        </h4>
                        <ul className="space-y-1">
                          {activeLesson.key_points.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-yellow-900 text-sm">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Lesson Content */}
                    <div className="prose prose-blue max-w-none">
                      {activeLesson.content_markdown ? (
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-2xl font-bold mt-6 mb-3">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-xl font-bold mt-5 mb-2">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-3 leading-relaxed">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside space-y-1 mb-4">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside space-y-1 mb-4">{children}</ol>
                            ),
                            li: ({ children }) => <li className="ml-4">{children}</li>,
                            strong: ({ children }) => (
                              <strong className="font-semibold">{children}</strong>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 rounded-r">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {activeLesson.content_markdown}
                        </ReactMarkdown>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 italic">
                            No detailed content available for this lesson yet.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Mark Complete Button */}
                    {!completedLessonIds.includes(activeLesson.id) && (
                      <div className="mt-8 pt-6 border-t">
                        <Button
                          onClick={() => markLessonComplete(activeLesson.id)}
                          className="w-full"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark as Complete
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  /* Quiz View */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Lesson Quiz</h3>
                      <Badge variant="outline">
                        {activeLesson.quiz_questions?.length || 0} Questions
                      </Badge>
                    </div>

                    {activeLesson.quiz_questions?.map((question, qIndex) => (
                      <div key={qIndex} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium mb-3">
                          {qIndex + 1}. {question.question}
                        </p>
                        <div className="space-y-2">
                          {question.options?.map((option: string, oIndex: number) => {
                            const isSelected = quizAnswers[qIndex] === oIndex;
                            const isCorrect = oIndex === question.correct_answer;
                            const showResult = quizSubmitted;

                            return (
                              <button
                                key={oIndex}
                                onClick={() => handleQuizAnswer(qIndex, oIndex)}
                                disabled={quizSubmitted}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                  showResult
                                    ? isCorrect
                                      ? "bg-green-100 border-green-500 text-green-900"
                                      : isSelected
                                      ? "bg-red-100 border-red-500 text-red-900"
                                      : "bg-white border-gray-200"
                                    : isSelected
                                    ? "bg-blue-100 border-blue-500"
                                    : "bg-white border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {String.fromCharCode(65 + oIndex)}.
                                  </span>
                                  <span>{option}</span>
                                  {showResult && isCorrect && (
                                    <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {!quizSubmitted ? (
                      <Button
                        onClick={handleSubmitQuiz}
                        disabled={
                          Object.keys(quizAnswers).length !==
                          activeLesson.quiz_questions?.length
                        }
                        className="w-full"
                        size="lg"
                      >
                        Submit Quiz
                      </Button>
                    ) : (
                      <div className={`p-6 rounded-lg text-center ${
                        quizScore >= 70 ? "bg-green-100" : "bg-red-100"
                      }`}>
                        <Award className={`h-12 w-12 mx-auto mb-3 ${
                          quizScore >= 70 ? "text-green-600" : "text-red-600"
                        }`} />
                        <p className="text-3xl font-bold mb-2">
                          {quizScore}%
                        </p>
                        <p className={`font-medium ${
                          quizScore >= 70 ? "text-green-700" : "text-red-700"
                        }`}>
                          {quizScore >= 70
                            ? "Great job! You passed! 🎉"
                            : "Keep studying and try again! 📚"}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {quizScore >= 70
                            ? "This lesson has been marked as complete."
                            : "You need 70% to pass."}
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                          }}
                        >
                          Retry Quiz
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a lesson to start learning</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}