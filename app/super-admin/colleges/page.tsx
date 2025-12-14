"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Building,
  Users,
  GraduationCap,
  MoreVertical,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  Eye,
  Globe,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  ExternalLink,
  Download,
  Pause,
  Play,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const collegesData = [
  {
    id: 1,
    name: "Harvard Medical School",
    subdomain: "harvard-medical",
    email: "admin@hms.edu",
    phone: "+1 617-432-1000",
    students: 1247,
    professors: 52,
    departments: 8,
    plan: "Enterprise",
    mrr: 4999,
    status: "active",
    createdAt: "Jan 15, 2024",
    trialEnds: null,
    lastActive: "2 mins ago",
  },
  {
    id: 2,
    name: "Stanford Medicine",
    subdomain: "stanford-med",
    email: "admin@stanford.edu",
    phone: "+1 650-723-4000",
    students: 986,
    professors: 41,
    departments: 6,
    plan: "Enterprise",
    mrr: 4999,
    status: "active",
    createdAt: "Feb 1, 2024",
    trialEnds: null,
    lastActive: "15 mins ago",
  },
  {
    id: 3,
    name: "Johns Hopkins Medicine",
    subdomain: "jhu-medicine",
    email: "admin@jhmi.edu",
    phone: "+1 410-955-5000",
    students: 1102,
    professors: 48,
    departments: 7,
    plan: "Enterprise",
    mrr: 4999,
    status: "active",
    createdAt: "Feb 10, 2024",
    trialEnds: null,
    lastActive: "1 hour ago",
  },
  {
    id: 4,
    name: "Mayo Clinic College",
    subdomain: "mayo-college",
    email: "admin@mayo.edu",
    phone: "+1 507-284-2511",
    students: 654,
    professors: 28,
    departments: 5,
    plan: "Professional",
    mrr: 1999,
    status: "active",
    createdAt: "Mar 5, 2024",
    trialEnds: null,
    lastActive: "3 hours ago",
  },
  {
    id: 5,
    name: "UCLA Medical School",
    subdomain: "ucla-med",
    email: "admin@ucla.edu",
    phone: "+1 310-825-4321",
    students: 823,
    professors: 35,
    departments: 6,
    plan: "Professional",
    mrr: 1999,
    status: "active",
    createdAt: "Mar 15, 2024",
    trialEnds: null,
    lastActive: "30 mins ago",
  },
  {
    id: 6,
    name: "Duke Medicine",
    subdomain: "duke-med",
    email: "admin@duke.edu",
    phone: "+1 919-684-8111",
    students: 0,
    professors: 0,
    departments: 0,
    plan: "Enterprise",
    mrr: 0,
    status: "trial",
    createdAt: "Dec 10, 2024",
    trialEnds: "Jan 10, 2025",
    lastActive: "2 hours ago",
  },
  {
    id: 7,
    name: "NYU Grossman",
    subdomain: "nyu-med",
    email: "admin@nyulangone.org",
    phone: "+1 212-263-7300",
    students: 512,
    professors: 22,
    departments: 4,
    plan: "Professional",
    mrr: 1999,
    status: "active",
    createdAt: "Apr 1, 2024",
    trialEnds: null,
    lastActive: "5 hours ago",
  },
  {
    id: 8,
    name: "UCSF Medical",
    subdomain: "ucsf-med",
    email: "admin@ucsf.edu",
    phone: "+1 415-476-1000",
    students: 0,
    professors: 0,
    departments: 0,
    plan: "Starter",
    mrr: 399,
    status: "suspended",
    createdAt: "May 10, 2024",
    trialEnds: null,
    lastActive: "2 weeks ago",
  },
];

const plans = [
  { id: "starter", name: "Starter", price: 399, features: "Up to 500 students, 10 professors" },
  { id: "professional", name: "Professional", price: 1999, features: "Up to 2000 students, 50 professors" },
  { id: "enterprise", name: "Enterprise", price: 4999, features: "Unlimited students & professors" },
];

export default function CollegesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<typeof collegesData[0] | null>(null);

  const filteredColleges = collegesData.filter((college) => {
    const matchesSearch =
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = selectedPlan === "all" || college.plan.toLowerCase() === selectedPlan;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && college.status === "active") ||
      (activeTab === "trial" && college.status === "trial") ||
      (activeTab === "suspended" && college.status === "suspended");
    return matchesSearch && matchesPlan && matchesTab;
  });

  const totalColleges = collegesData.length;
  const activeCount = collegesData.filter((c) => c.status === "active").length;
  const trialCount = collegesData.filter((c) => c.status === "trial").length;
  const totalMRR = collegesData.reduce((acc, c) => acc + c.mrr, 0);

  const handleViewClick = (college: typeof collegesData[0]) => {
    setSelectedCollege(college);
    setShowViewModal(true);
  };

  const handleEditClick = (college: typeof collegesData[0]) => {
    setSelectedCollege(college);
    setShowEditModal(true);
  };

  const handleSuspendClick = (college: typeof collegesData[0]) => {
    setSelectedCollege(college);
    setShowSuspendModal(true);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Enterprise": return "bg-purple-100 text-purple-700";
      case "Professional": return "bg-blue-100 text-blue-700";
      case "Starter": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-100 text-emerald-700";
      case "trial": return "bg-orange-100 text-orange-700";
      case "suspended": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Colleges</h1>
          <p className="text-gray-500 text-sm">Manage all registered institutions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add College</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalColleges}</p>
              <p className="text-sm text-gray-500">Total Colleges</p>
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
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{trialCount}</p>
              <p className="text-sm text-gray-500">On Trial</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${totalMRR.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search colleges by name, subdomain, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
          >
            <option value="all">All Plans</option>
            <option value="enterprise">Enterprise</option>
            <option value="professional">Professional</option>
            <option value="starter">Starter</option>
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
            { id: "all", label: "All Colleges" },
            { id: "active", label: "Active" },
            { id: "trial", label: "Trial" },
            { id: "suspended", label: "Suspended" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? "text-rose-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Colleges Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">College</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Users</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Plan</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">MRR</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Last Active</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredColleges.map((college) => (
                <tr key={college.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                        <Building className="h-5 w-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{college.name}</p>
                        <p className="text-xs text-gray-500">{college.subdomain}.clinaid.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{college.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <GraduationCap className="h-3 w-3" />
                        <span>{college.professors} professors</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(college.plan)}`}>
                      {college.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium text-gray-900">
                      {college.mrr > 0 ? `$${college.mrr.toLocaleString()}` : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(college.status)}`}>
                      {college.status.charAt(0).toUpperCase() + college.status.slice(1)}
                    </span>
                    {college.trialEnds && (
                      <p className="text-xs text-gray-500 mt-1">Ends: {college.trialEnds}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-500">{college.lastActive}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleViewClick(college)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleEditClick(college)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Visit Portal"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-500" />
                      </button>
                      {college.status === "active" ? (
                        <button
                          onClick={() => handleSuspendClick(college)}
                          className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Suspend"
                        >
                          <Pause className="h-4 w-4 text-orange-500" />
                        </button>
                      ) : college.status === "suspended" ? (
                        <button
                          className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Reactivate"
                        >
                          <Play className="h-4 w-4 text-emerald-500" />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredColleges.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-500 font-medium">No colleges found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add College Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New College</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Harvard Medical School"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain *</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="harvard-medical"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-200 rounded-r-lg text-gray-500">
                    .clinaid.com
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email *</label>
                <input
                  type="email"
                  placeholder="admin@college.edu"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Phone</label>
                <input
                  type="tel"
                  placeholder="+1 234-567-8900"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plan *</label>
                <div className="space-y-2">
                  {plans.map((plan) => (
                    <label
                      key={plan.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" name="plan" value={plan.id} className="text-rose-600" />
                        <div>
                          <p className="font-medium text-gray-900">{plan.name}</p>
                          <p className="text-xs text-gray-500">{plan.features}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">${plan.price}/mo</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="rounded border-gray-300 text-rose-600" defaultChecked />
                  <span className="text-sm font-medium text-gray-700">Start with 30-day trial</span>
                </label>
                <p className="text-xs text-gray-500 ml-6">College won't be charged until trial ends</p>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-rose-600" defaultChecked />
                <span className="text-sm text-gray-700">Send welcome email with login credentials</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors">
                Create College
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View College Modal */}
      {showViewModal && selectedCollege && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">College Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-xl bg-rose-100 flex items-center justify-center mx-auto mb-3">
                <Building className="h-10 w-10 text-rose-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">{selectedCollege.name}</h4>
              <a href={`https://${selectedCollege.subdomain}.clinaid.com`} className="text-rose-600 text-sm hover:underline flex items-center justify-center gap-1">
                {selectedCollege.subdomain}.clinaid.com
                <ExternalLink className="h-3 w-3" />
              </a>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(selectedCollege.plan)}`}>
                  {selectedCollege.plan}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCollege.status)}`}>
                  {selectedCollege.status.charAt(0).toUpperCase() + selectedCollege.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{selectedCollege.students.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{selectedCollege.professors}</p>
                <p className="text-xs text-gray-500">Professors</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{selectedCollege.departments}</p>
                <p className="text-xs text-gray-500">Departments</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Admin Email</p>
                  <p className="text-sm text-gray-900">{selectedCollege.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{selectedCollege.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Monthly Revenue</p>
                  <p className="text-sm text-gray-900">${selectedCollege.mrr.toLocaleString()}/month</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">{selectedCollege.createdAt}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditClick(selectedCollege);
                }}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Edit Details
              </button>
              <button className="flex-1 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Visit Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit College Modal */}
      {showEditModal && selectedCollege && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit College</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College Name *</label>
                <input
                  type="text"
                  defaultValue={selectedCollege.name}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain *</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    defaultValue={selectedCollege.subdomain}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-200 rounded-r-lg text-gray-500">
                    .clinaid.com
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email *</label>
                <input
                  type="email"
                  defaultValue={selectedCollege.email}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Phone</label>
                <input
                  type="tel"
                  defaultValue={selectedCollege.phone}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plan</label>
                <select
                  defaultValue={selectedCollege.plan.toLowerCase()}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>{plan.name} - ${plan.price}/mo</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  defaultValue={selectedCollege.status}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="suspended">Suspended</option>
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
              <button className="flex-1 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend College Modal */}
      {showSuspendModal && selectedCollege && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Suspend College?</h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to suspend <strong>{selectedCollege.name}</strong>? All users will be locked out until reactivated.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg mb-6">
              <p className="text-sm text-orange-700">
                <strong>Warning:</strong> This will immediately block access for {selectedCollege.students.toLocaleString()} students and {selectedCollege.professors} professors.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for suspension
              </label>
              <textarea
                rows={3}
                placeholder="Enter reason..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Suspend College
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}