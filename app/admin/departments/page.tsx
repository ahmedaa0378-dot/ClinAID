"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  MoreVertical,
  Edit,
  Trash2,
  X,
  UserCheck,
  TrendingUp,
} from "lucide-react";

const departmentsData = [
  {
    id: 1,
    name: "Cardiology",
    code: "CARD",
    hod: "Dr. Sarah Smith",
    hodEmail: "sarah.smith@medical.edu",
    professors: 12,
    students: 245,
    courses: 8,
    avgProgress: 72,
    status: "active",
    createdAt: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Neurology",
    code: "NEUR",
    hod: "Dr. James Wilson",
    hodEmail: "james.wilson@medical.edu",
    professors: 8,
    students: 189,
    courses: 6,
    avgProgress: 68,
    status: "active",
    createdAt: "Jan 15, 2024",
  },
  {
    id: 3,
    name: "Pediatrics",
    code: "PEDI",
    hod: "Dr. Michael Johnson",
    hodEmail: "michael.j@medical.edu",
    professors: 10,
    students: 203,
    courses: 7,
    avgProgress: 75,
    status: "active",
    createdAt: "Jan 20, 2024",
  },
  {
    id: 4,
    name: "Orthopedics",
    code: "ORTH",
    hod: "Dr. Emily Davis",
    hodEmail: "emily.d@medical.edu",
    professors: 7,
    students: 156,
    courses: 5,
    avgProgress: 70,
    status: "active",
    createdAt: "Feb 1, 2024",
  },
  {
    id: 5,
    name: "Oncology",
    code: "ONCO",
    hod: "Dr. Robert Lee",
    hodEmail: "robert.lee@medical.edu",
    professors: 6,
    students: 134,
    courses: 4,
    avgProgress: 65,
    status: "active",
    createdAt: "Feb 10, 2024",
  },
  {
    id: 6,
    name: "Dermatology",
    code: "DERM",
    hod: null,
    hodEmail: null,
    professors: 4,
    students: 98,
    courses: 3,
    avgProgress: 60,
    status: "active",
    createdAt: "Mar 5, 2024",
  },
  {
    id: 7,
    name: "Psychiatry",
    code: "PSYC",
    hod: "Dr. Anna Williams",
    hodEmail: "anna.w@medical.edu",
    professors: 5,
    students: 112,
    courses: 4,
    avgProgress: 71,
    status: "active",
    createdAt: "Mar 15, 2024",
  },
  {
    id: 8,
    name: "Radiology",
    code: "RADI",
    hod: null,
    hodEmail: null,
    professors: 3,
    students: 67,
    courses: 2,
    avgProgress: 58,
    status: "inactive",
    createdAt: "Apr 1, 2024",
  },
];

const availableProfessors = [
  { id: 1, name: "Dr. Sarah Smith", department: "Cardiology" },
  { id: 2, name: "Dr. James Wilson", department: "Neurology" },
  { id: 3, name: "Dr. Michael Johnson", department: "Pediatrics" },
  { id: 4, name: "Dr. Emily Davis", department: "Orthopedics" },
  { id: 5, name: "Dr. Robert Lee", department: "Oncology" },
  { id: 6, name: "Dr. Anna Williams", department: "Psychiatry" },
  { id: 7, name: "Dr. Chris Miller", department: "Cardiology" },
  { id: 8, name: "Dr. Lisa Anderson", department: "Neurology" },
];

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHodModal, setShowHodModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<typeof departmentsData[0] | null>(null);

  const filteredDepartments = departmentsData.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = departmentsData.reduce((acc, d) => acc + d.students, 0);
  const totalProfessors = departmentsData.reduce((acc, d) => acc + d.professors, 0);
  const activeDepartments = departmentsData.filter((d) => d.status === "active").length;

  const handleEditClick = (dept: typeof departmentsData[0]) => {
    setSelectedDepartment(dept);
    setShowEditModal(true);
  };

  const handleHodClick = (dept: typeof departmentsData[0]) => {
    setSelectedDepartment(dept);
    setShowHodModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500 text-sm">Manage academic departments and assign HODs</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{departmentsData.length}</p>
              <p className="text-sm text-gray-500">Total Departments</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeDepartments}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalProfessors}</p>
              <p className="text-sm text-gray-500">Total Professors</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepartments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                  <span className="text-sm text-gray-500">{dept.code}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    dept.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {dept.status}
                </span>
                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* HOD Section */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Head of Department</p>
              {dept.hod ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-700 text-xs font-medium">
                        {dept.hod.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dept.hod}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleHodClick(dept)}
                    className="text-xs text-purple-600 hover:text-purple-700"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleHodClick(dept)}
                  className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  <UserCheck className="h-4 w-4" />
                  Assign HOD
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <p className="text-lg font-bold text-blue-700">{dept.professors}</p>
                <p className="text-xs text-blue-600">Professors</p>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <p className="text-lg font-bold text-purple-700">{dept.students}</p>
                <p className="text-xs text-purple-600">Students</p>
              </div>
              <div className="text-center p-2 bg-emerald-50 rounded-lg">
                <p className="text-lg font-bold text-emerald-700">{dept.courses}</p>
                <p className="text-xs text-emerald-600">Courses</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-500">Avg Progress</span>
                <span className="font-medium text-gray-900">{dept.avgProgress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${dept.avgProgress}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditClick(dept)}
                className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                <Users className="h-4 w-4" />
                View Users
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDepartments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-500 font-medium">No departments found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search</p>
        </div>
      )}

      {/* Create Department Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Department</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cardiology"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g., CARD"
                  maxLength={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of the department"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign HOD (Optional)
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                  <option value="">Select professor</option>
                  {availableProfessors.map((prof) => (
                    <option key={prof.id} value={prof.id}>{prof.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" className="rounded border-gray-300" defaultChecked />
                <label htmlFor="active" className="text-sm text-gray-700">
                  Set as active department
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Create Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Department</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  defaultValue={selectedDepartment.name}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Code *
                </label>
                <input
                  type="text"
                  defaultValue={selectedDepartment.code}
                  maxLength={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  defaultValue={selectedDepartment.status}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign HOD Modal */}
      {showHodModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Assign HOD</h3>
              <button
                onClick={() => setShowHodModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <p className="text-gray-500 text-sm mb-4">
              Select a professor to assign as Head of Department for <strong>{selectedDepartment.name}</strong>
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableProfessors
                .filter((p) => p.department === selectedDepartment.name)
                .map((prof) => (
                  <label
                    key={prof.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input type="radio" name="hod" className="text-purple-600" />
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-700 font-medium text-sm">
                        {prof.name.split(" ").slice(1).map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{prof.name}</p>
                      <p className="text-sm text-gray-500">{prof.department}</p>
                    </div>
                  </label>
                ))}
              {availableProfessors.filter((p) => p.department === selectedDepartment.name).length === 0 && (
                <p className="text-center text-gray-500 py-4">No professors in this department</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowHodModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Assign HOD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}