"use client";

import { useState } from "react";
import { Calendar, Clock, Video, User, Check } from "lucide-react";

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState("book");
  const [selectedProfessor, setSelectedProfessor] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [bookingTopic, setBookingTopic] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const professors = [
    { id: 1, name: "Dr. Sarah Smith", department: "Cardiology", avatar: "SS" },
    { id: 2, name: "Dr. Michael Johnson", department: "Pediatrics", avatar: "MJ" },
  ];

  const slots = [
    { id: 1, day: "Today", time: "10:00 AM", available: true },
    { id: 2, day: "Today", time: "2:00 PM", available: true },
    { id: 3, day: "Tomorrow", time: "10:00 AM", available: true },
    { id: 4, day: "Tomorrow", time: "3:00 PM", available: false },
  ];

  const upcomingBookings = [
    { id: 1, professor: "Dr. Sarah Smith", department: "Cardiology", date: "Dec 14, 2024", time: "10:00 AM", topic: "ECG Interpretation" },
  ];

  const handleBookSession = () => {
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      setSelectedProfessor(0);
      setSelectedSlot(0);
      setBookingTopic("");
    }, 3000);
  };

  const selectedProf = professors.find((p) => p.id === selectedProfessor);
  const selectedSlotData = slots.find((s) => s.id === selectedSlot);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Session</h1>
        <p className="text-gray-500 text-sm">Schedule consultations with professors</p>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("book")}
            className={`pb-3 text-sm font-medium relative ${activeTab === "book" ? "text-emerald-600" : "text-gray-500"}`}
          >
            Book New Session
            {activeTab === "book" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 text-sm font-medium relative ${activeTab === "upcoming" ? "text-emerald-600" : "text-gray-500"}`}
          >
            Upcoming Sessions
            {activeTab === "upcoming" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
          </button>
        </div>
      </div>

      {activeTab === "book" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Select Professor</h2>
            <div className="space-y-3">
              {professors.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => setSelectedProfessor(prof.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border ${selectedProfessor === prof.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 bg-white"}`}
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 font-medium">{prof.avatar}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{prof.name}</p>
                    <p className="text-sm text-gray-500">{prof.department}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Select Time Slot</h2>
            {selectedProfessor > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="grid grid-cols-2 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => slot.available && setSelectedSlot(slot.id)}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg text-sm font-medium text-left ${selectedSlot === slot.id ? "bg-emerald-600 text-white" : slot.available ? "bg-gray-50 text-gray-700 hover:bg-gray-100" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                    >
                      <div>{slot.day}</div>
                      <div className="text-xs opacity-80">{slot.time}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Select a professor first</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Booking Details</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              {selectedProf && selectedSlotData ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-700 font-medium">{selectedProf.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedProf.name}</p>
                      <p className="text-sm text-gray-500">{selectedProf.department}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{selectedSlotData.day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{selectedSlotData.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-gray-400" />
                      <span>Zoom Meeting</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>
                    <textarea
                      value={bookingTopic}
                      onChange={(e) => setBookingTopic(e.target.value)}
                      placeholder="What would you like to discuss?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    onClick={handleBookSession}
                    disabled={!bookingTopic}
                    className={`w-full py-3 rounded-lg font-medium ${bookingTopic ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                  >
                    Confirm Booking
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select professor and time slot</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 font-medium">SS</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.professor}</h3>
                    <p className="text-sm text-gray-500">{booking.date} at {booking.time}</p>
                    <p className="text-sm text-gray-600 mt-1">Topic: {booking.topic}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Confirmed</span>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Join</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Session Booked!</h3>
            <p className="text-gray-500 mb-4">You will receive a confirmation email.</p>
            <button onClick={() => setShowConfirmation(false)} className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg">
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}