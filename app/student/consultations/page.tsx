"use client";

import { useState } from "react";
import { Calendar, Clock, Video, MapPin, User, Plus, Search, CheckCircle, X, MessageSquare, Star } from "lucide-react";

const professors = [
  { id: 1, name: "Dr. Sarah Mitchell", department: "Cardiology", rating: 4.9, reviews: 124, avatar: "SM", available: true, nextSlot: "Tomorrow, 10:00 AM" },
  { id: 2, name: "Dr. James Chen", department: "Neurology", rating: 4.8, reviews: 98, avatar: "JC", available: true, nextSlot: "Dec 16, 2:00 PM" },
  { id: 3, name: "Dr. Emily Rodriguez", department: "Pediatrics", rating: 4.7, reviews: 156, avatar: "ER", available: false, nextSlot: "Dec 18, 11:00 AM" },
];

const myConsultations = [
  { id: 1, professor: "Dr. Sarah Mitchell", avatar: "SM", course: "Clinical Cardiology", date: "Dec 15, 2024", time: "10:00 AM", duration: "30 min", type: "video", status: "upcoming", topic: "ECG interpretation help" },
  { id: 2, professor: "Dr. James Chen", avatar: "JC", course: "Neurology Fundamentals", date: "Dec 12, 2024", time: "3:00 PM", duration: "30 min", type: "video", status: "completed", topic: "Exam preparation" },
];

export default function StudentConsultationsPage() {
  const [activeTab, setActiveTab] = useState<"book" | "upcoming" | "history">("book");
  const [searchQuery, setSearchQuery] = useState("");

  const upcomingConsultations = myConsultations.filter(c => c.status === "upcoming");
  const pastConsultations = myConsultations.filter(c => c.status === "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
        <p className="text-gray-500">Book and manage sessions with your professors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Upcoming", value: "1", icon: Calendar, color: "blue" },
          { label: "Completed", value: "1", icon: CheckCircle, color: "green" },
          { label: "This Month", value: "3", icon: Clock, color: "purple" },
          { label: "Total Hours", value: "4.5h", icon: Video, color: "orange" },
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {[
            { id: "book", label: "Book Session" },
            { id: "upcoming", label: "Upcoming", count: upcomingConsultations.length },
            { id: "history", label: "History" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Book Session Tab */}
      {activeTab === "book" && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search professors by name or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professors.map((professor) => (
              <div key={professor.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg">
                    {professor.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{professor.name}</h3>
                    <p className="text-gray-500 text-sm">{professor.department}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-gray-900">{professor.rating}</span>
                      <span className="text-gray-500 text-sm">({professor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className={`p-3 rounded-lg mb-4 ${professor.available ? "bg-green-50" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${professor.available ? "bg-green-500" : "bg-gray-400"}`} />
                    <span className={`text-sm font-medium ${professor.available ? "text-green-700" : "text-gray-600"}`}>
                      {professor.available ? "Available" : "Next available"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{professor.nextSlot}</p>
                </div>

                <button className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Book Session
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tab */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {upcomingConsultations.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming consultations</h3>
              <p className="text-gray-500 mb-4">Book a session with a professor to get started</p>
              <button onClick={() => setActiveTab("book")} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Book Now
              </button>
            </div>
          ) : (
            upcomingConsultations.map((consultation) => (
              <div key={consultation.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                      {consultation.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{consultation.professor}</h3>
                      <p className="text-gray-500 text-sm">{consultation.course}</p>
                      <p className="text-gray-600 text-sm mt-1">Topic: {consultation.topic}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{consultation.date}</p>
                    <p className="text-gray-500 text-sm">{consultation.time} • {consultation.duration}</p>
                    <div className="flex items-center gap-1 mt-2 justify-end">
                      <Video className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-500 capitalize">{consultation.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                    <Video className="h-4 w-4" />
                    Join Session
                  </button>
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {pastConsultations.map((consultation) => (
            <div key={consultation.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold">
                    {consultation.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{consultation.professor}</h3>
                    <p className="text-gray-500 text-sm">{consultation.course}</p>
                    <p className="text-gray-600 text-sm mt-1">Topic: {consultation.topic}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{consultation.date}</p>
                  <p className="text-gray-500 text-sm">{consultation.time} • {consultation.duration}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Completed
                  </span>
                </div>
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  View Notes
                </button>
                <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Leave Review
                </button>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Book Again
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
