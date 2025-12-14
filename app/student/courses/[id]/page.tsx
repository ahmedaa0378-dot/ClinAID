"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Play,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  Users,
  ClipboardList,
  Lock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const courseData = {
  id: 1,
  title: "Clinical Cardiology",
  professor: "Dr. Sarah Smith",
  department: "Cardiology",
  description: "Comprehensive course covering cardiac anatomy, physiology, pathology, and clinical assessment techniques for medical students.",
  progress: 75,
  totalStudents: 234,
  totalDuration: "24 hours",
  modules: [
    {
      id: 1,
      title: "Introduction to Cardiology",
      duration: "3 hours",
      lessons: [
        { id: 1, title: "Overview of Cardiovascular System", type: "video", duration: "45 min", completed: true },
        { id: 2, title: "Cardiac Anatomy", type: "video", duration: "60 min", completed: true },
        { id: 3, title: "Anatomy Quiz", type: "quiz", duration: "20 min", completed: true },
        { id: 4, title: "Reading: Cardiac Structures", type: "document", duration: "30 min", completed: true },
      ],
    },
    {
      id: 2,
      title: "Cardiac Physiology",
      duration: "4 hours",
      lessons: [
        { id: 5, title: "Electrical Conduction System", type: "video", duration: "50 min", completed: true },
        { id: 6, title: "Cardiac Cycle", type: "video", duration: "55 min", completed: true },
        { id: 7, title: "Blood Pressure Regulation", type: "video", duration: "45 min", completed: false },
        { id: 8, title: "Physiology Quiz", type: "quiz", duration: "25 min", completed: false, locked: true },
      ],
    },
    {
      id: 3,
      title: "Clinical Assessment",
      duration: "5 hours",
      lessons: [
        { id: 9, title: "History Taking in Cardiology", type: "video", duration: "40 min", completed: false, locked: true },
        { id: 10, title: "Physical Examination", type: "video", duration: "60 min", completed: false, locked: true },
        { id: 11, title: "Case Study: Chest Pain", type: "document", duration: "45 min", completed: false, locked: true },
        { id: 12, title: "Assessment Quiz", type: "quiz", duration: "30 min", completed: false, locked: true },
      ],
    },
    {
      id: 4,
      title: "ECG Interpretation",
      duration: "6 hours",
      lessons: [
        { id: 13, title: "ECG Basics", type: "video", duration: "50 min", completed: false, locked: true },
        { id: 14, title: "Normal ECG Patterns", type: "video", duration: "55 min", completed: false, locked: true },
        { id: 15, title: "Abnormal Rhythms", type: "video", duration: "70 min", completed: false, locked: true },
        { id: 16, title: "ECG Practice Quiz", type: "quiz", duration: "30 min", completed: false, locked: true },
      ],
    },
  ],
};

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [expandedModules, setExpandedModules] = useState<number[]>([1, 2]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getIcon = (type: string, completed: boolean, locked: boolean) => {
    if (locked) return <Lock className="h-4 w-4 text-gray-400" />;
    if (completed) return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    
    switch (type) {
      case "video":
        return <Play className="h-4 w-4 text-blue-500" />;
      case "quiz":
        return <ClipboardList className="h-4 w-4 text-orange-500" />;
      case "document":
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const completedLessons = courseData.modules.reduce(
    (acc, module) => acc + module.lessons.filter((l) => l.completed).length,
    0
  );
  const totalLessons = courseData.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/courses")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Courses</span>
      </button>

      {/* Course Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-4">
            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                In Progress
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{courseData.title}</h1>
            <p className="text-gray-500">{courseData.description}</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-700 text-sm font-medium">SS</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{courseData.professor}</p>
                <p className="text-xs text-gray-500">{courseData.department}</p>
              </div>
            </div>
          </div>

          {/* Course Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                <BookOpen className="h-4 w-4" />
              </div>
              <p className="text-lg font-bold text-gray-900">{completedLessons}/{totalLessons}</p>
              <p className="text-xs text-gray-500">Lessons</p>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-lg font-bold text-gray-900">{courseData.totalDuration}</p>
              <p className="text-xs text-gray-500">Duration</p>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                <Users className="h-4 w-4" />
              </div>
              <p className="text-lg font-bold text-gray-900">{courseData.totalStudents}</p>
              <p className="text-xs text-gray-500">Students</p>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                <Award className="h-4 w-4" />
              </div>
              <p className="text-lg font-bold text-gray-900">{courseData.progress}%</p>
              <p className="text-xs text-gray-500">Complete</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Course Progress</span>
            <span className="font-medium text-gray-900">{courseData.progress}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${courseData.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
          <p className="text-sm text-gray-500">
            {courseData.modules.length} modules • {totalLessons} lessons • {courseData.totalDuration}
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {courseData.modules.map((module) => {
            const isExpanded = expandedModules.includes(module.id);
            const moduleCompleted = module.lessons.every((l) => l.completed);
            const completedInModule = module.lessons.filter((l) => l.completed).length;

            return (
              <div key={module.id}>
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-500">
                        {completedInModule}/{module.lessons.length} lessons • {module.duration}
                      </p>
                    </div>
                  </div>
                  {moduleCompleted && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      Completed
                    </span>
                  )}
                </button>

                {/* Lessons List */}
                {isExpanded && (
                  <div className="bg-gray-50 px-4 pb-4">
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center justify-between p-3 rounded-lg bg-white border transition-colors ${
                            lesson.locked
                              ? "border-gray-200 opacity-60"
                              : lesson.completed
                              ? "border-emerald-200"
                              : "border-gray-200 hover:border-emerald-300 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getIcon(lesson.type, lesson.completed, lesson.locked || false)}
                            <div>
                              <p className={`text-sm font-medium ${lesson.locked ? "text-gray-400" : "text-gray-900"}`}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {lesson.type} • {lesson.duration}
                              </p>
                            </div>
                          </div>
                          {!lesson.locked && !lesson.completed && (
                            <button className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                              Start
                            </button>
                          )}
                          {lesson.completed && (
                            <span className="text-xs text-emerald-600 font-medium">Completed</span>
                          )}
                          {lesson.locked && (
                            <span className="text-xs text-gray-400">Locked</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}