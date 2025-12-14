"use client";

import Link from "next/link";
import {
  TrendingUp,
  ClipboardList,
  Calendar,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  Clock,
} from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Clinical Cardiology",
    instructor: "Dr. Sarah Smith",
    progress: 75,
    totalLessons: 16,
    completedLessons: 12,
    image: "🫀",
  },
  {
    id: 2,
    title: "Pediatrics Fundamentals",
    instructor: "Dr. Michael Johnson",
    progress: 40,
    totalLessons: 20,
    completedLessons: 8,
    image: "👶",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "quiz",
    title: "Completed Quiz: Cardiac Anatomy",
    time: "2 hours ago",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    id: 2,
    type: "video",
    title: "Watched: Introduction to ECG",
    time: "Yesterday",
    icon: PlayCircle,
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: 3,
    type: "session",
    title: "Booked session with Dr. Smith",
    time: "2 days ago",
    icon: Calendar,
    color: "text-purple-600 bg-purple-100",
  },
];

const upcomingDeadlines = [
  { id: 1, title: "Cardiology Quiz", due: "Tomorrow", color: "bg-red-500" },
  { id: 2, title: "Assignment: Case Study", due: "In 3 days", color: "bg-orange-500" },
  { id: 3, title: "Live Session", due: "In 5 days", color: "bg-emerald-500" },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-500">Continue your medical learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">68%</p>
              <p className="text-gray-500 text-sm">Overall Progress</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-gray-500 text-sm">Quizzes Due</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">2</p>
              <p className="text-gray-500 text-sm">Upcoming Sessions</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
          <Link
            href="/student/courses"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  {course.image}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-gray-500 text-sm">{course.instructor}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {course.completedLessons} of {course.totalLessons} lessons completed
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <Link
                href={`/student/courses/${course.id}`}
                className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                Continue
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.title}</p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${deadline.color}`} />
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{deadline.title}</p>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {deadline.due}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}