"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Award, BookOpen, TrendingUp, Camera, Edit, Save } from "lucide-react";

export default function StudentProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const achievements = [
    { title: "Quick Learner", desc: "Completed 5 courses in first month", icon: "🚀", date: "Nov 2024" },
    { title: "Perfect Score", desc: "Scored 100% on Anatomy Quiz", icon: "🏆", date: "Dec 2024" },
    { title: "Consistent", desc: "7-day learning streak", icon: "🔥", date: "Dec 2024" },
  ];

  const recentActivity = [
    { action: "Completed quiz", detail: "Neurology Quiz 2", score: "85%", date: "Dec 10" },
    { action: "Watched video", detail: "Heart Anatomy Overview", score: null, date: "Dec 9" },
    { action: "Completed quiz", detail: "Anatomy Practical", score: "92%", date: "Dec 5" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500">View and manage your profile information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-semibold mx-auto">
                  JS
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-4">John Student</h2>
              <p className="text-gray-500">Medical Student</p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                <GraduationCap className="h-4 w-4" />
                Year 3
              </div>
            </div>

            <div className="mt-6 space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">john@university.edu</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Boston, MA</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Joined Sep 2022</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Achievements
            </h3>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.title} className="flex items-start gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-500">{achievement.desc}</p>
                    <p className="text-xs text-gray-400 mt-1">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Courses", value: "4", icon: BookOpen, color: "blue" },
              { label: "Completed", value: "2", icon: GraduationCap, color: "green" },
              { label: "Avg. Score", value: "88%", icon: TrendingUp, color: "purple" },
              { label: "Hours", value: "124", icon: Calendar, color: "orange" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center mb-3`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                {isEditing ? (
                  <input type="text" defaultValue="John" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                ) : (
                  <p className="text-gray-900">John</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                {isEditing ? (
                  <input type="text" defaultValue="Student" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                ) : (
                  <p className="text-gray-900">Student</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                {isEditing ? (
                  <input type="email" defaultValue="john@university.edu" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                ) : (
                  <p className="text-gray-900">john@university.edu</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                {isEditing ? (
                  <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                ) : (
                  <p className="text-gray-900">+1 (555) 123-4567</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                <p className="text-gray-900">Cardiology</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Student ID</label>
                <p className="text-gray-900">STU-2022-4567</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.detail}</p>
                  </div>
                  <div className="text-right">
                    {activity.score && <p className="font-semibold text-emerald-600">{activity.score}</p>}
                    <p className="text-sm text-gray-400">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
