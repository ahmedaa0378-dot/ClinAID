"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Users,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  BookOpen,
  GraduationCap,
  Clock,
  Download,
  Eye,
  AlertCircle,
  Filter,
  Upload,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const studentsData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@student.medical.edu",
    avatar: "JD",
    department: "Cardiology",
    studentType: "UG",
    year: 3,
    enrolledCourses: 3,
    progress: 75,
    avgScore: 82,
    status: "active",
    joinedAt: "Sep 15, 2024",
    trend: "up",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@student.medical.edu",
    avatar: "JS",
    department: "Cardiology",
    studentType: "PG",
    year: 1,
    enrolledCourses: 2,
    progress: 88,
    avgScore: 91,
    status: "active",
    joinedAt: "Sep 10, 2024",
    trend: "up",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@student.medical.edu",
    avatar: "MJ",
    department: "Neurology",
    studentType: "UG",
    year: 2,
    enrolledCourses: 2,
    progress: 45,
    avgScore: 68,
    status: "at-risk",
    joinedAt: "Sep 20, 2024",
    trend: "down",
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily.b@student.medical.edu",
    avatar: "EB",
    department: "Pediatrics",
    studentType: "UG",
    year: 4,
    enrolledCourses: 4,
    progress: 92,
    avgScore: 94,
    status: "active",
    joinedAt: "Sep 5, 2024",
    trend: "up",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@student.medical.edu",
    avatar: "DW",
    department: "Orthopedics",
    studentType: "PG",
    year: 2,
    enrolledCourses: 3,
    progress: 28,
    avgScore: 58,
    status: "at-risk",
    joinedAt: "Oct 1, 2024",
    trend: "down",
  },
  {
    id: 6,
    name: "Sarah Davis",
    email: "sarah.d@student.medical.edu",
    avatar: "SD",
    department: "Cardiology",
    studentType: "UG",
    year: 3,
    enrolledCourses: 3,
    progress: 60,
    avgScore: 78,
    status: "active",
    joinedAt: "Sep 12, 2024",
    trend: "up",
  },
  {
    id: 7,
    name: "Chris Miller",
    email: "chris.m@student.medical.edu",
    avatar: "CM",
    department: "Neurology",
    studentType: "UG",
    year: 2,
    enrolledCourses: 2,
    progress: 55,
    avgScore: 75,
    status: "active",
    joinedAt: "Sep 25, 2024",
    trend: "up",
  },
  {
    id: 8,
    name: "Lisa Anderson",
    email: "lisa.a@student.medical.edu",
    avatar: "LA",
    department: "Oncology",
    studentType: "PG",
    year: 1,
    enrolledCourses: 2,
    progress: 38,
    avgScore: 65,
    status: "inactive",
    joinedAt: "Sep 18, 2024",
    trend: "down",
  },
  {
    id: 9,
    name: "Robert Taylor",
    email: "robert.t@student.medical.edu",
    avatar: "RT",
    department: "Psychiatry",
    studentType: "UG",
    year: 1,
    enrolledCourses: 2,
    progress: 70,
    avgScore: 80,
    status: "active",
    joinedAt: "Oct 5, 2024",
    trend: "up",
  },
  {
    id: 10,
    name: "Amanda White",
    email: "amanda.w@student.medical.edu",
    avatar: "AW",
    department: "Pediatrics",
    studentType: "UG",
    year: 3,
    enrolledCourses: 3,
    progress: 85,
    avgScore: 88,
    status: "active",
    joinedAt: "Sep 8, 2024",
    trend: "up",
  },
];

const pendingEnrollments = [
  {
    id: 101,
    name: "Alex Turner",
    email: "alex.t@student.medical.edu",
    department: "Cardiology",
    studentType: "UG",
    year: 2,
    appliedAt: "Today",
  },
  {
    id: 102,
    name: "Maria Garcia",
    email: "maria.g@student.medical.edu",
    department: "Neurology",
    studentType: "PG",
    year: 1,
    appliedAt: "Today",
  },
  {
    id: 103,
    name: "Tom Harris",
    email: "tom.h@student.medical.edu",
    department: "Pediatrics",
    studentType: "UG",
    year: 1,
    appliedAt: "Yesterday",
  },
  {
    id: 104,
    name: "Sophie Clark",
    email: "sophie.c@student.medical.edu",
    department: "Orthopedics",
    studentType: "UG",
    year: 3,
    appliedAt: "Yesterday",
  },
];

const departments = [
  "All Departments",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Oncology",
  "Psychiatry",
  "Dermatology",
  "Radiology",
];

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedType, setSelectedType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof studentsData[0] | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" || student.department === selectedDepartment;
    const matchesType =
      selectedType === "all" || student.studentType === selectedType;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && student.status === "active") ||
      (activeTab === "at-risk" && student.status === "at-risk") ||
      (activeTab === "inactive" && student.status === "inactive");
    return matchesSearch && matchesDepartment && matchesType && matchesTab;
  });

  const totalStudents = studentsData.length;
  const activeCount = studentsData.filter((s) => s.status === "active").length;
  const atRiskCount = studentsData.filter((s) => s.status === "at-risk").length;
  const avgProgress = Math.round(studentsData.reduce((acc, s) => acc + s.progress, 0) / totalStudents);

  const handleViewClick = (student: typeof studentsData[0]) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleEditClick = (student: typeof studentsData[0]) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const toggleSelectStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 text-sm">Manage student enrollments and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">Bulk Import</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{atRiskCount}</p>
              <p className="text-sm text-gray-500">At Risk</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
              <p className="text-sm text-gray-500">Avg Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Enrollments */}
      {pendingEnrollments.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-orange-800">Pending Enrollments</h3>
            <span className="text-sm text-orange-600">{pendingEnrollments.length} requests</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingEnrollments.slice(0, 4).map((student) => (
              <div key={student.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-700 font-medium text-sm">
                      {student.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">
                      {student.studentType} Year {student.year} • {student.department}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {pendingEnrollments.length > 4 && (
            <button className="w-full mt-3 py-2 text-sm text-orange-700 hover:text-orange-800 font-medium">
              View All {pendingEnrollments.length} Pending Enrollments
            </button>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="all">All Types</option>
            <option value="UG">Undergraduate (UG)</option>
            <option value="PG">Postgraduate (PG)</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">Export</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {[
            { id: "all", label: "All Students" },
            { id: "active", label: "Active" },
            { id: "at-risk", label: "At Risk" },
            { id: "inactive", label: "Inactive" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? "text-purple-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.id === "at-risk" && atRiskCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                  {atRiskCount}
                </span>
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center justify-between">
          <span className="text-purple-700 font-medium">
            {selectedStudents.length} student(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Send Email
            </button>
            <button className="px-3 py-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Export Selected
            </button>
            <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
              Deactivate
            </button>
            <button
              onClick={() => setSelectedStudents([])}
              className="px-3 py-1.5 text-purple-700 hover:text-purple-800 text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-purple-600"
                  />
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Department</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Type/Year</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Progress</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Avg Score</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleSelectStudent(student.id)}
                      className="rounded border-gray-300 text-purple-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-700 font-medium text-sm">{student.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{student.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        student.studentType === "UG" 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {student.studentType}
                      </span>
                      <span className="text-sm text-gray-500">Year {student.year}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.progress >= 70 ? "bg-emerald-500" :
                            student.progress >= 50 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900">{student.avgScore}%</span>
                      {student.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : student.status === "at-risk"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {student.status === "at-risk" ? "At Risk" : student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewClick(student)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleEditClick(student)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredStudents.length} of {totalStudents} students
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-500 font-medium">No students found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Student</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    placeholder="First name"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="student@medical.edu"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                  <option value="">Select department</option>
                  {departments.slice(1).map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Type *</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                    <option value="">Select type</option>
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study *</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                    <option value="">Select year</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                    <option value="5">Year 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                <input
                  type="text"
                  placeholder="Auto-generated if blank"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600" defaultChecked />
                <label className="text-sm text-gray-700">Send welcome email with login credentials</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Student Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-700 font-bold text-2xl">{selectedStudent.avatar}</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h4>
              <p className="text-gray-500">{selectedStudent.email}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                  selectedStudent.studentType === "UG" 
                    ? "bg-blue-100 text-blue-700" 
                    : "bg-purple-100 text-purple-700"
                }`}>
                  {selectedStudent.studentType}
                </span>
                <span className="text-sm text-gray-500">Year {selectedStudent.year}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <GraduationCap className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm text-gray-900">{selectedStudent.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Enrolled Courses</p>
                  <p className="text-sm text-gray-900">{selectedStudent.enrolledCourses} courses</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm text-gray-900">{selectedStudent.joinedAt}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-700">{selectedStudent.progress}%</p>
                <p className="text-xs text-purple-600">Progress</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{selectedStudent.avgScore}%</p>
                <p className="text-xs text-blue-600">Avg Score</p>
              </div>
              <div className={`text-center p-3 rounded-lg ${
                selectedStudent.status === "active" ? "bg-emerald-50" :
                selectedStudent.status === "at-risk" ? "bg-red-50" : "bg-gray-50"
              }`}>
                <p className={`text-sm font-bold ${
                  selectedStudent.status === "active" ? "text-emerald-700" :
                  selectedStudent.status === "at-risk" ? "text-red-700" : "text-gray-700"
                }`}>
                  {selectedStudent.status === "at-risk" ? "At Risk" : selectedStudent.status.charAt(0).toUpperCase() + selectedStudent.status.slice(1)}
                </p>
                <p className={`text-xs ${
                  selectedStudent.status === "active" ? "text-emerald-600" :
                  selectedStudent.status === "at-risk" ? "text-red-600" : "text-gray-600"
                }`}>Status</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditClick(selectedStudent);
                }}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Edit Details
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Student</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  defaultValue={selectedStudent.name}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  defaultValue={selectedStudent.email}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  defaultValue={selectedStudent.department}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  {departments.slice(1).map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Type *</label>
                  <select
                    defaultValue={selectedStudent.studentType}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study *</label>
                  <select
                    defaultValue={selectedStudent.year}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                    <option value="5">Year 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  defaultValue={selectedStudent.status}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="active">Active</option>
                  <option value="at-risk">At Risk</option>
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

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Bulk Import Students</h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600">
                  Drag and drop or <span className="text-purple-600">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  CSV or Excel file (max 500 students)
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Required columns:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• first_name, last_name</li>
                  <li>• email</li>
                  <li>• department</li>
                  <li>• student_type (UG/PG)</li>
                  <li>• year_of_study</li>
                </ul>
              </div>

              <button className="w-full py-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                Download Template
              </button>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}