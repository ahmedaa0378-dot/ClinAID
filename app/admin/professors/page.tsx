"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  GraduationCap,
  Mail,
  Phone,
  MoreVertical,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  BookOpen,
  Users,
  Clock,
  Filter,
  Download,
  Eye,
  UserCheck,
  AlertCircle,
} from "lucide-react";

const professorsData = [
  {
    id: 1,
    name: "Dr. Sarah Smith",
    email: "sarah.smith@medical.edu",
    phone: "+1 234-567-8901",
    avatar: "SS",
    department: "Cardiology",
    designation: "Professor",
    courses: 3,
    students: 156,
    rating: 4.8,
    status: "active",
    joinedAt: "Jan 15, 2024",
    isHod: true,
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    email: "james.wilson@medical.edu",
    phone: "+1 234-567-8902",
    avatar: "JW",
    department: "Neurology",
    designation: "Professor",
    courses: 2,
    students: 89,
    rating: 4.6,
    status: "active",
    joinedAt: "Jan 20, 2024",
    isHod: true,
  },
  {
    id: 3,
    name: "Dr. Michael Johnson",
    email: "michael.j@medical.edu",
    phone: "+1 234-567-8903",
    avatar: "MJ",
    department: "Pediatrics",
    designation: "Associate Professor",
    courses: 2,
    students: 142,
    rating: 4.7,
    status: "active",
    joinedAt: "Feb 1, 2024",
    isHod: true,
  },
  {
    id: 4,
    name: "Dr. Emily Davis",
    email: "emily.d@medical.edu",
    phone: "+1 234-567-8904",
    avatar: "ED",
    department: "Orthopedics",
    designation: "Professor",
    courses: 2,
    students: 118,
    rating: 4.5,
    status: "active",
    joinedAt: "Feb 10, 2024",
    isHod: true,
  },
  {
    id: 5,
    name: "Dr. Robert Lee",
    email: "robert.lee@medical.edu",
    phone: "+1 234-567-8905",
    avatar: "RL",
    department: "Oncology",
    designation: "Assistant Professor",
    courses: 1,
    students: 67,
    rating: 4.4,
    status: "active",
    joinedAt: "Mar 5, 2024",
    isHod: true,
  },
  {
    id: 6,
    name: "Dr. Anna Williams",
    email: "anna.w@medical.edu",
    phone: "+1 234-567-8906",
    avatar: "AW",
    department: "Psychiatry",
    designation: "Associate Professor",
    courses: 2,
    students: 92,
    rating: 4.6,
    status: "active",
    joinedAt: "Mar 15, 2024",
    isHod: true,
  },
  {
    id: 7,
    name: "Dr. Chris Miller",
    email: "chris.m@medical.edu",
    phone: "+1 234-567-8907",
    avatar: "CM",
    department: "Cardiology",
    designation: "Assistant Professor",
    courses: 2,
    students: 78,
    rating: 4.3,
    status: "active",
    joinedAt: "Apr 1, 2024",
    isHod: false,
  },
  {
    id: 8,
    name: "Dr. Lisa Anderson",
    email: "lisa.a@medical.edu",
    phone: "+1 234-567-8908",
    avatar: "LA",
    department: "Neurology",
    designation: "Assistant Professor",
    courses: 1,
    students: 45,
    rating: 4.2,
    status: "inactive",
    joinedAt: "Apr 10, 2024",
    isHod: false,
  },
];

const pendingProfessors = [
  {
    id: 101,
    name: "Dr. Kevin Brown",
    email: "kevin.b@medical.edu",
    department: "Cardiology",
    designation: "Associate Professor",
    appliedAt: "Today",
    resume: "resume_kevin.pdf",
  },
  {
    id: 102,
    name: "Dr. Maria Garcia",
    email: "maria.g@medical.edu",
    department: "Pediatrics",
    designation: "Assistant Professor",
    appliedAt: "Yesterday",
    resume: "resume_maria.pdf",
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

export default function ProfessorsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<typeof professorsData[0] | null>(null);

  const filteredProfessors = professorsData.filter((prof) => {
    const matchesSearch =
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" || prof.department === selectedDepartment;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && prof.status === "active") ||
      (activeTab === "inactive" && prof.status === "inactive") ||
      (activeTab === "hod" && prof.isHod);
    return matchesSearch && matchesDepartment && matchesTab;
  });

  const activeCount = professorsData.filter((p) => p.status === "active").length;
  const hodCount = professorsData.filter((p) => p.isHod).length;
  const totalStudents = professorsData.reduce((acc, p) => acc + p.students, 0);

  const handleViewClick = (prof: typeof professorsData[0]) => {
    setSelectedProfessor(prof);
    setShowViewModal(true);
  };

  const handleEditClick = (prof: typeof professorsData[0]) => {
    setSelectedProfessor(prof);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Professors</h1>
          <p className="text-gray-500 text-sm">Manage faculty members and their assignments</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingProfessors.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{pendingProfessors.length} pending approval</span>
            </div>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Professor</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{professorsData.length}</p>
              <p className="text-sm text-gray-500">Total Professors</p>
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
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{hodCount}</p>
              <p className="text-sm text-gray-500">Department HODs</p>
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

      {/* Pending Approvals */}
      {pendingProfessors.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-orange-800">Pending Approvals</h3>
            <span className="text-sm text-orange-600">{pendingProfessors.length} requests</span>
          </div>
          <div className="space-y-3">
            {pendingProfessors.map((prof) => (
              <div key={prof.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-700 font-medium text-sm">
                      {prof.name.split(" ").slice(1).map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{prof.name}</p>
                    <p className="text-sm text-gray-500">{prof.designation} • {prof.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium">
                    Approve
                  </button>
                  <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search professors..."
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
            { id: "all", label: "All Professors" },
            { id: "active", label: "Active" },
            { id: "inactive", label: "Inactive" },
            { id: "hod", label: "HODs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? "text-purple-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Professors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Professor</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Department</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Courses</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Students</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Rating</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProfessors.map((prof) => (
                <tr key={prof.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-700 font-medium text-sm">{prof.avatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{prof.name}</p>
                          {prof.isHod && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              HOD
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{prof.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{prof.department}</p>
                      <p className="text-xs text-gray-500">{prof.designation}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{prof.courses}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{prof.students}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium text-gray-900">{prof.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        prof.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {prof.status.charAt(0).toUpperCase() + prof.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewClick(prof)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleEditClick(prof)}
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
      </div>

      {/* Empty State */}
      {filteredProfessors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-500 font-medium">No professors found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add Professor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Professor</h3>
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
                  placeholder="professor@medical.edu"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  placeholder="+1 234-567-8900"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                  <option value="">Select designation</option>
                  <option value="professor">Professor</option>
                  <option value="associate">Associate Professor</option>
                  <option value="assistant">Assistant Professor</option>
                  <option value="lecturer">Lecturer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <input
                  type="text"
                  placeholder="e.g., Interventional Cardiology"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-purple-600" />
                  <span className="text-sm text-gray-700">Assign as Head of Department</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-purple-600" defaultChecked />
                  <span className="text-sm text-gray-700">Send welcome email with credentials</span>
                </label>
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
                Add Professor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Professor Modal */}
      {showViewModal && selectedProfessor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Professor Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-700 font-bold text-2xl">{selectedProfessor.avatar}</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900">{selectedProfessor.name}</h4>
              <p className="text-gray-500">{selectedProfessor.designation}</p>
              {selectedProfessor.isHod && (
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  Head of Department
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{selectedProfessor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{selectedProfessor.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <GraduationCap className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm text-gray-900">{selectedProfessor.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm text-gray-900">{selectedProfessor.joinedAt}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-700">{selectedProfessor.courses}</p>
                <p className="text-xs text-purple-600">Courses</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{selectedProfessor.students}</p>
                <p className="text-xs text-blue-600">Students</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-700">★ {selectedProfessor.rating}</p>
                <p className="text-xs text-yellow-600">Rating</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditClick(selectedProfessor);
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

      {/* Edit Professor Modal */}
      {showEditModal && selectedProfessor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Professor</h3>
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
                  defaultValue={selectedProfessor.name}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  defaultValue={selectedProfessor.email}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={selectedProfessor.phone}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  defaultValue={selectedProfessor.department}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  {departments.slice(1).map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
                <select
                  defaultValue={selectedProfessor.designation}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  defaultValue={selectedProfessor.status}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hod"
                  defaultChecked={selectedProfessor.isHod}
                  className="rounded border-gray-300 text-purple-600"
                />
                <label htmlFor="hod" className="text-sm text-gray-700">
                  Head of Department
                </label>
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
    </div>
  );
}