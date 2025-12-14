"use client";

import { useState } from "react";
import { BookOpen, Search, Clock, FileText, ClipboardList } from "lucide-react";

const coursesData = [
  {
    id: 1,
    title: "Clinical Cardiology",
    professor: "Dr. Sarah Smith",
    department: "Cardiology",
    progress: 75,
    lessonsCompleted: 12,
    totalLessons: 16,
    quizzes: 3,
    assignments: 2,
    lastAccessed: "2 hours ago",
    status: "in-progress",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: 2,
    title: "Pediatrics Fundamentals",
    professor: "Dr. Michael Johnson",
    department: "Pediatrics",
    progress: 40,
    lessonsCompleted: 8,
    totalLessons: 20,
    quizzes: 5,
    assignments: 3,
    lastAccessed: "Yesterday",
    status: "in-progress",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    id: 3,
    title: "Human Anatomy",
    professor: "Dr. Emily Davis",
    department: "Anatomy",
    progress: 100,
    lessonsCompleted: 24,
    totalLessons: 24,
    quizzes: 6,
    assignments: 4,
    lastAccessed: "Last month",
    status: "completed",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    title: "Neurology Basics",
    professor: "Dr. Robert Wilson",
    department: "Neurology",
    progress: 20,
    lessonsCompleted: 4,
    totalLessons: 20,
    quizzes: 4,
    assignments: 2,
    lastAccessed: "3 days ago",
    status: "in-progress",
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "in-progress" && course.status === "in-progress") ||
      (activeTab === "completed" && course.status === "completed");
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 text-sm">View and manage your enrolled courses</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {[
            { id: "all", label: "All Courses" },
            { id: "in-progress", label: "In Progress" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
          >
            {/* Thumbnail */}
            <div className={`h-32 bg-gradient-to-r ${course.gradient} relative`}>
              <span
                className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${
                  course.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {course.status === "completed" ? "Completed" : "In Progress"}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.professor}</p>
                <p className="text-xs text-gray-400">{course.department}</p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-gray-900">{course.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>{course.lessonsCompleted}/{course.totalLessons} Lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClipboardList className="h-3 w-3" />
                  <span>{course.quizzes} Quizzes</span>
                </div>
              </div>

              {/* Last Accessed */}
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{course.status === "completed" ? "Completed" : "Last accessed"}: {course.lastAccessed}</span>
              </div>

              {/* Button */}
<button
  onClick={() => window.location.href = `/courses/${course.id}`}
  className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
    course.status === "completed"
      ? "border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
      : "bg-emerald-600 text-white hover:bg-emerald-700"
  }`}
>
  {course.status === "completed" ? "Review Course" : "Continue Learning"}
</button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-500 font-medium">No courses found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}