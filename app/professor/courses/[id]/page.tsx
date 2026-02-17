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
  Users,
  FileText,
  CheckCircle2,
  Play,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  source_pdf_name: string;
  created_at: string;
}

export default function ProfessorCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [enrollmentCount, setEnrollmentCount] = useState(0);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
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

      // Fetch enrollment count
      const { count } = await supabase
        .from("course_enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId);

      setEnrollmentCount(count || 0);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: answerIndex });
  };

  const calculateQuizScore = () => {
    if (!activeLesson?.quiz_questions) return 0;
    let correct = 0;
    activeLesson.quiz_questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct_answer) correct++;
    });
    return Math.round((correct / activeLesson.quiz_questions.length) * 100);
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
          onClick={() => router.push("/professor/courses")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
        </Button>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center text-5xl">
              {course.image || "📚"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <Badge variant={course.status === "active" ? "default" : "secondary"}>
                  {course.status}
                </Badge>
              </div>
              <p className="text-blue-100 mb-3">{course.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" /> {course.total_lessons || lessons.length} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {course.duration_weeks} weeks
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {enrollmentCount} students
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" /> {course.code}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      {course.objectives && course.objectives.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {course.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar - Module/Lesson List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Content</CardTitle>
              <CardDescription>{lessons.length} lessons</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {course.modules && course.modules.length > 0 ? (
                <Accordion type="multiple" defaultValue={["module-0"]} className="w-full">
                  {course.modules.map((module, moduleIndex) => (
                    <AccordionItem key={moduleIndex} value={`module-${moduleIndex}`}>
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="text-left">
                          <p className="font-medium">{module.title}</p>
                          <p className="text-xs text-gray-500">
                            {module.lessons?.length || 0} lessons
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 px-2 pb-2">
                          {module.lessons?.map((lesson: any, lessonIndex: number) => {
                            const dbLesson = lessons.find(
                              (l) => l.title === lesson.title
                            ) || lessons[moduleIndex * (module.lessons?.length || 0) + lessonIndex];
                            const isActive = activeLesson?.id === dbLesson?.id;

                            return (
                              <button
                                key={lessonIndex}
                                onClick={() => {
                                  if (dbLesson) {
                                    setActiveLesson(dbLesson);
                                    setShowQuiz(false);
                                    setQuizAnswers({});
                                    setQuizSubmitted(false);
                                  }
                                }}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${
                                  isActive
                                    ? "bg-blue-100 text-blue-900"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Play className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                                  <span className="text-sm">{lesson.title}</span>
                                </div>
                                <p className="text-xs text-gray-500 ml-6">
                                  {lesson.duration_minutes || 30} min
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="p-4 space-y-2">
                  {lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveLesson(lesson);
                        setShowQuiz(false);
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeLesson?.id === lesson.id
                          ? "bg-blue-100 text-blue-900"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium">{lesson.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Lesson View */}
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
                          setQuizSubmitted(false);
                          setQuizAnswers({});
                        }}
                      >
                        <HelpCircle className="h-4 w-4 mr-1" />
                        Quiz ({activeLesson.quiz_questions.length})
                      </Button>
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
                            <li key={i} className="flex items-start gap-2 text-yellow-900">
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
                  </>
                ) : (
                  /* Quiz View */
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold">Lesson Quiz</h3>

                    {activeLesson.quiz_questions?.map((question, qIndex) => (
                      <div key={qIndex} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium mb-3">
                          {qIndex + 1}. {question.question}
                        </p>
                        <div className="space-y-2">
                          {question.options?.map((option: string, oIndex: number) => (
                            <button
                              key={oIndex}
                              onClick={() => !quizSubmitted && handleQuizAnswer(qIndex, oIndex)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                quizSubmitted
                                  ? oIndex === question.correct_answer
                                    ? "bg-green-100 border-green-500"
                                    : quizAnswers[qIndex] === oIndex
                                    ? "bg-red-100 border-red-500"
                                    : "bg-white"
                                  : quizAnswers[qIndex] === oIndex
                                  ? "bg-blue-100 border-blue-500"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                            >
                              <span className="font-medium mr-2">
                                {String.fromCharCode(65 + oIndex)}.
                              </span>
                              {option}
                            </button>
                          ))}
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
                        onClick={() => setQuizSubmitted(true)}
                        disabled={
                          Object.keys(quizAnswers).length !==
                          activeLesson.quiz_questions?.length
                        }
                        className="w-full"
                      >
                        Submit Quiz
                      </Button>
                    ) : (
                      <div className="p-4 bg-gray-100 rounded-lg text-center">
                        <p className="text-2xl font-bold mb-2">
                          Score: {calculateQuizScore()}%
                        </p>
                        <p className="text-gray-600">
                          {calculateQuizScore() >= 70
                            ? "Great job! 🎉"
                            : "Keep studying! 📚"}
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
                <p className="text-gray-500">Select a lesson to view content</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}