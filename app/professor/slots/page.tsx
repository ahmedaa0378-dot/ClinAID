"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  Video,
  User,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Repeat,
  AlertCircle,
} from "lucide-react";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
];

const existingSlots = [
  { id: 1, day: "Mon", time: "10:00 AM", duration: 30, recurring: true, booked: false },
  { id: 2, day: "Mon", time: "2:00 PM", duration: 30, recurring: true, booked: true, student: "John Doe", topic: "ECG Doubts" },
  { id: 3, day: "Tue", time: "11:00 AM", duration: 30, recurring: true, booked: false },
  { id: 4, day: "Wed", time: "10:00 AM", duration: 30, recurring: true, booked: true, student: "Jane Smith", topic: "Case Discussion" },
  { id: 5, day: "Wed", time: "3:00 PM", duration: 30, recurring: true, booked: false },
  { id: 6, day: "Thu", time: "2:00 PM", duration: 30, recurring: true, booked: false },
  { id: 7, day: "Fri", time: "10:00 AM", duration: 30, recurring: false, booked: true, student: "Mike Johnson", topic: "Exam Prep" },
];

const upcomingBookings = [
  { id: 1, student: "John Doe", date: "Mon, Dec 16", time: "2:00 PM", topic: "ECG Interpretation Doubts", status: "confirmed" },
  { id: 2, student: "Jane Smith", date: "Wed, Dec 18", time: "10:00 AM", topic: "Case Study Discussion", status: "confirmed" },
  { id: 3, student: "Mike Johnson", date: "Fri, Dec 20", time: "10:00 AM", topic: "Exam Preparation", status: "pending" },
  { id: 4, student: "Emily Brown", date: "Mon, Dec 23", time: "10:00 AM", topic: "Research Guidance", status: "pending" },
];

export default function SlotsPage() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isRecurring, setIsRecurring] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);

  const getSlotForDayTime = (day: string, time: string) => {
    return existingSlots.find((slot) => slot.day === day && slot.time === time);
  };

  const handleCellClick = (day: string, time: string) => {
    const existingSlot = getSlotForDayTime(day, time);
    if (!existingSlot) {
      setSelectedDay(day);
      setSelectedTime(time);
      setShowAddModal(true);
    }
  };

  const confirmedCount = upcomingBookings.filter((b) => b.status === "confirmed").length;
  const pendingCount = upcomingBookings.filter((b) => b.status === "pending").length;
  const availableCount = existingSlots.filter((s) => !s.booked).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultation Slots</h1>
          <p className="text-gray-500 text-sm">Manage your availability for student consultations</p>
        </div>
        <button
          onClick={() => {
            setSelectedDay("");
            setSelectedTime("");
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Slot</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Check className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{confirmedCount}</p>
              <p className="text-sm text-gray-500">Confirmed Bookings</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              <p className="text-sm text-gray-500">Pending Approval</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
              <p className="text-sm text-gray-500">Available Slots</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {[
            { id: "schedule", label: "Weekly Schedule" },
            { id: "bookings", label: "Upcoming Bookings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Week Navigation */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <button
              onClick={() => setCurrentWeek((prev) => prev - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="font-medium text-gray-900">
              {currentWeek === 0 ? "This Week" : currentWeek === 1 ? "Next Week" : `Week ${currentWeek + 1}`}
            </span>
            <button
              onClick={() => setCurrentWeek((prev) => prev + 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Schedule Grid */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-24">Time</th>
                  {weekDays.slice(1, 6).map((day) => (
                    <th key={day} className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.filter((_, i) => i % 2 === 0).map((time) => (
                  <tr key={time} className="border-t border-gray-100">
                    <td className="px-4 py-2 text-sm text-gray-500">{time}</td>
                    {weekDays.slice(1, 6).map((day) => {
                      const slot = getSlotForDayTime(day, time);
                      return (
                        <td
                          key={`${day}-${time}`}
                          className="px-2 py-2"
                        >
                          {slot ? (
                            <div
                              className={`p-2 rounded-lg text-xs ${
                                slot.booked
                                  ? "bg-blue-100 border border-blue-200"
                                  : "bg-emerald-50 border border-emerald-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`font-medium ${slot.booked ? "text-blue-700" : "text-emerald-700"}`}>
                                  {slot.booked ? "Booked" : "Available"}
                                </span>
                                {slot.recurring && <Repeat className="h-3 w-3 text-gray-400" />}
                              </div>
                              {slot.booked && slot.student && (
                                <p className="text-gray-600 mt-1 truncate">{slot.student}</p>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleCellClick(day, time)}
                              className="w-full h-12 border border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-gray-100 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-50 border border-emerald-200" />
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
              <span className="text-sm text-gray-600">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Recurring</span>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          {upcomingBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-700 font-medium">
                      {booking.student.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.student}</h3>
                    <p className="text-sm text-gray-500">{booking.topic}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{booking.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                  </span>
                  <div className="flex items-center gap-2">
                    {booking.status === "pending" && (
                      <>
                        <button className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                          <Check className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <>
                        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          <Video className="h-4 w-4" />
                          Start
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {upcomingBookings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-500 font-medium">No upcoming bookings</h3>
              <p className="text-gray-400 text-sm">Your consultation bookings will appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Consultation Slot</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day *</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select day</option>
                  {weekDays.slice(1, 6).map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="15">15 minutes</option>
                  <option value="30" selected>30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="zoom">Zoom Meeting</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div>
                  <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                    Recurring weekly
                  </label>
                  <p className="text-xs text-gray-500">This slot will repeat every week</p>
                </div>
              </div>

              {!isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specific Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Add Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}