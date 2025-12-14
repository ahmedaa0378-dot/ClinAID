"use client";

import {
  TrendingUp,
  BookOpen,
  ClipboardList,
  Clock,
  Award,
  Target,
  Calendar,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const statsData = [
  { label: "Overall Progress", value: "68%", change: "+5%", trend: "up", icon: TrendingUp, color: "emerald" },
  { label: "Courses Completed", value: "1/4", change: "", trend: "neutral", icon: BookOpen, color: "blue" },
  { label: "Quizzes Passed", value: "8/12", change: "+2", trend: "up", icon: ClipboardList, color: "purple" },
  { label: "Study Hours", value: "47h", change: "+8h", trend: "up", icon: Clock, color: "orange" },
];

const courseProgress = [
  { name: "Clinical Cardiology", progress: 75, lessons: "12/16", quizzes: "3/4", grade: "A-" },
  { name: "Pediatrics Fundamentals", progress: 40, lessons: "8/20", quizzes: "2/5", grade: "B+" },
  { name: "Human Anatomy", progress: 100, lessons: "24/24", quizzes: "6/6", grade: "A" },
  { name: "Neurology Basics", progress: 20, lessons: "4/20", quizzes: "1/4", grade: "B" },
];

const recentActivity = [
  { action: "Completed Quiz", item: "Cardiac Anatomy Quiz", score: "85%", date: "Today", type: "quiz" },
  { action: "Watched Lesson", item: "Blood Pressure Regulation", score: "", date: "Today", type: "lesson" },
  { action: "Completed Quiz", item: "Child Development Basics", score: "92%", date: "Yesterday", type: "quiz" },
  { action: "Watched Lesson", item: "Electrical Conduction System", score: "", date: "Yesterday", type: "lesson" },
  { action: "Booked Session", item: "Dr. Sarah Smith", score: "", date: "2 days ago", type: "session" },
];

const achievements = [
  { title: "Fast Learner", description: "Complete 5 lessons in one day", earned: true, icon: "🚀" },
  { title: "Quiz Master", description: "Score 90%+ on 3 quizzes", earned: true, icon: "🏆" },
  { title: "Consistent", description: "Study 7 days in a row", earned: false, icon: "📅" },
  { title: "Perfect Score", description: "Get 100% on any quiz", earned: false, icon: "⭐" },
];

const weeklyStudyData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.5 },
  { day: "Wed", hours: 3 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 1 },
  { day: "Sun", hours: 2 },
];

export default function ProgressPage() {
  const maxHours = Math.max(...weeklyStudyData.map((d) => d.hours));

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; light: string }> = {
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600", light: "bg-emerald-500" },
      blue: { bg: "bg-blue-100", text: "text-blue-600", light: "bg-blue-500" },
      purple: { bg: "bg-purple-100", text: "text-purple-600", light: "bg-purple-500" },
      orange: { bg: "bg-orange-100", text: "text-orange-600", light: "bg-orange-500" },
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
        <p className="text-gray-500 text-sm">Track your learning journey and achievements</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                {stat.change && (
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                    {stat.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {stat.change}
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h2>
            <div className="space-y-4">
              {courseProgress.map((course) => (
                <div key={course.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{course.name}</p>
                      <p className="text-sm text-gray-500">
                        {course.lessons} lessons • {course.quizzes} quizzes
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">{course.progress}%</span>
                      <p className="text-sm text-gray-500">Grade: {course.grade}</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${course.progress === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Study Hours</h2>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyStudyData.map((data) => (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-28">
                    <span className="text-xs text-gray-600 mb-1">{data.hours}h</span>
                    <div
                      className="w-full bg-emerald-500 rounded-t-md"
                      style={{ height: `${(data.hours / maxHours) * 100}%`, minHeight: "8px" }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{data.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">This week total</span>
              <span className="text-lg font-bold text-gray-900">
                {weeklyStudyData.reduce((sum, d) => sum + d.hours, 0)}h
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === "quiz" ? "bg-purple-100" : activity.type === "lesson" ? "bg-blue-100" : "bg-emerald-100"
                  }`}>
                    {activity.type === "quiz" ? (
                      <ClipboardList className="h-4 w-4 text-purple-600" />
                    ) : activity.type === "lesson" ? (
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Calendar className="h-4 w-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.item}</p>
                    <p className="text-xs text-gray-500">
                      {activity.action}
                      {activity.score && ` • ${activity.score}`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.title}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    achievement.earned ? "bg-emerald-50" : "bg-gray-50 opacity-60"
                  }`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${achievement.earned ? "text-gray-900" : "text-gray-500"}`}>
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}