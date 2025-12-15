"use client";

import { useState } from "react";
import { Calendar, Clock, Video, MapPin, User, Plus, ChevronLeft, ChevronRight, Check, X, MessageSquare } from "lucide-react";

const consultations = [
  { id: 1, student: "John Smith", avatar: "JS", course: "Clinical Cardiology", date: "Dec 15, 2024", time: "10:00 AM", duration: "30 min", type: "video", status: "upcoming", topic: "ECG interpretation help" },
  { id: 2, student: "Emily Chen", avatar: "EC", course: "Clinical Cardiology", date: "Dec 15, 2024", time: "2:00 PM", duration: "45 min", type: "in-person", status: "upcoming", topic: "Research project guidance" },
  { id: 3, student: "Michael Brown", avatar: "MB", course: "Advanced Pediatrics", date: "Dec 16, 2024", time: "11:00 AM", duration: "30 min", type: "video", status: "pending", topic: "Case study review" },
  { id: 4, student: "Sarah Wilson", avatar: "SW", course: "Neurology Fundamentals", date: "Dec 14, 2024", time: "3:00 PM", duration: "30 min", type: "video", status: "completed", topic: "Exam preparation" },
];

const availableSlots = [
  { day: "Monday", slots: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"] },
  { day: "Tuesday", slots: ["10:00 AM", "11:00 AM", "3:00 PM"] },
  { day: "Wednesday", slots: ["9:00 AM", "2:00 PM", "4:00 PM"] },
  { day: "Thursday", slots: ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
  { day: "Friday", slots: ["9:00 AM", "10:00 AM"] },
];

export default function ProfessorConsultationsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "requests" | "availability">("upcoming");

  const upcomingConsultations = consultations.filter(c => c.status === "upcoming");
  const pendingRequests = consultations.filter(c => c.status === "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
          <p className="text-gray-500">Manage your student consultation schedule</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-5 w-5" />
          Add Availability
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Sessions", value: "2", icon: Calendar, color: "blue" },
          { label: "Pending Requests", value: "1", icon: Clock, color: "yellow" },
          { label: "This Week", value: "8", icon: Video, color: "green" },
          { label: "Total Hours", value: "24h", icon: MessageSquare, color: "purple" },
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
            { id: "upcoming", label: "Upcoming", count: upcomingConsultations.length },
            { id: "requests", label: "Requests", count: pendingRequests.length },
            { id: "availability", label: "Availability", count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {upcomingConsultations.map((consultation) => (
            <div key={consultation.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                    {consultation.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{consultation.student}</h3>
                    <p className="text-gray-500 text-sm">{consultation.course}</p>
                    <p className="text-gray-600 text-sm mt-1">Topic: {consultation.topic}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{consultation.date}</p>
                  <p className="text-gray-500 text-sm">{consultation.time} • {consultation.duration}</p>
                  <div className="flex items-center gap-1 mt-2 justify-end">
                    {consultation.type === "video" ? <Video className="h-4 w-4 text-blue-500" /> : <MapPin className="h-4 w-4 text-green-500" />}
                    <span className="text-sm text-gray-500 capitalize">{consultation.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Video className="h-4 w-4" />
                  Start Session
                </button>
                <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Reschedule
                </button>
                <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "requests" && (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl border border-yellow-200 bg-yellow-50/50 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                    {request.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.student}</h3>
                    <p className="text-gray-500 text-sm">{request.course}</p>
                    <p className="text-gray-600 text-sm mt-1">Topic: {request.topic}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">Requested: {request.date}</p>
                  <p className="text-gray-500 text-sm">{request.time} • {request.duration}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-yellow-200">
                <button className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" />
                  Accept
                </button>
                <button className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <X className="h-4 w-4" />
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "availability" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Weekly Availability</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {availableSlots.map((day) => (
              <div key={day.day} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{day.day}</h4>
                <div className="space-y-2">
                  {day.slots.map((slot) => (
                    <div key={slot} className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm text-center">
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
