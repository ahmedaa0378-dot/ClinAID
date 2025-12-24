"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  GraduationCap,
  CheckCircle,
  XCircle,
  Loader2,
  X,
} from "lucide-react";

interface College {
  id: string;
  name: string;
  college_code: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  subdomain: string;
  is_active: boolean;
  subscription_plan: string;
  subscription_status: string;
  max_students: number;
  max_professors: number;
  created_at: string;
}

export default function InstitutionsPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    college_code: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "USA",
    subdomain: "",
    is_active: true,
    subscription_plan: "starter",
    max_students: 500,
    max_professors: 50,
  });

  // Fetch colleges
  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching colleges:", error);
    } else {
      setColleges(data || []);
    }
    setLoading(false);
  };

  // Filter colleges
  const filteredColleges = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.college_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open modal for new college
  const handleAddNew = () => {
    setEditingCollege(null);
    setFormData({
      name: "",
      college_code: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      country: "USA",
      subdomain: "",
      is_active: true,
      subscription_plan: "starter",
      max_students: 500,
      max_professors: 50,
    });
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (college: College) => {
    setEditingCollege(college);
    setFormData({
      name: college.name,
      college_code: college.college_code,
      email: college.email || "",
      phone: college.phone || "",
      city: college.city || "",
      state: college.state || "",
      country: college.country || "USA",
      subdomain: college.subdomain || "",
      is_active: college.is_active,
      subscription_plan: college.subscription_plan || "starter",
      max_students: college.max_students || 500,
      max_professors: college.max_professors || 50,
    });
    setShowModal(true);
  };

  // Save college
  const handleSave = async () => {
    setSaving(true);

    if (editingCollege) {
      // Update existing
      const { error } = await supabase
        .from("colleges")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingCollege.id);

      if (error) {
        console.error("Error updating college:", error);
        alert("Failed to update institution");
      } else {
        fetchColleges();
        setShowModal(false);
      }
    } else {
      // Create new
      const { error } = await supabase.from("colleges").insert({
        ...formData,
        subscription_status: "active",
      });

      if (error) {
        console.error("Error creating college:", error);
        alert("Failed to create institution: " + error.message);
      } else {
        fetchColleges();
        setShowModal(false);
      }
    }

    setSaving(false);
  };

  // Delete college
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this institution?")) return;

    const { error } = await supabase.from("colleges").delete().eq("id", id);

    if (error) {
      console.error("Error deleting college:", error);
      alert("Failed to delete institution");
    } else {
      fetchColleges();
    }
  };

  // Toggle active status
  const toggleActive = async (college: College) => {
    const { error } = await supabase
      .from("colleges")
      .update({ is_active: !college.is_active })
      .eq("id", college.id);

    if (error) {
      console.error("Error toggling status:", error);
    } else {
      fetchColleges();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Institutions</h1>
          <p className="text-gray-500">Manage colleges and universities</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Institution
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Institutions", value: colleges.length, icon: Building2, color: "blue" },
          { label: "Active", value: colleges.filter((c) => c.is_active).length, icon: CheckCircle, color: "green" },
          { label: "Inactive", value: colleges.filter((c) => !c.is_active).length, icon: XCircle, color: "red" },
          { label: "Enterprise Plans", value: colleges.filter((c) => c.subscription_plan === "enterprise").length, icon: Users, color: "purple" },
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search institutions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-rose-600 mx-auto" />
            <p className="mt-2 text-gray-500">Loading institutions...</p>
          </div>
        ) : filteredColleges.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No institutions found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first institution</p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
            >
              <Plus className="h-5 w-5" />
              Add Institution
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Institution</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Location</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Plan</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Limits</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredColleges.map((college) => (
                  <tr key={college.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{college.name}</p>
                        <p className="text-sm text-gray-500">{college.college_code}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{college.city}, {college.state}</p>
                      <p className="text-sm text-gray-500">{college.country}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        college.subscription_plan === "enterprise"
                          ? "bg-purple-100 text-purple-700"
                          : college.subscription_plan === "professional"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {college.subscription_plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                          {college.max_students}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          {college.max_professors}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(college)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          college.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {college.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(college)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(college.id)}
                          className="p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCollege ? "Edit Institution" : "Add New Institution"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Harvard Medical School"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College Code *</label>
                  <input
                    type="text"
                    value={formData.college_code}
                    onChange={(e) => setFormData({ ...formData, college_code: e.target.value.toUpperCase() })}
                    placeholder="HMS"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@college.edu"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-123-4567"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Boston"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="MA"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="USA"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain</label>
                  <input
                    type="text"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })}
                    placeholder="harvard"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plan</label>
                  <select
                    value={formData.subscription_plan}
                    onChange={(e) => setFormData({ ...formData, subscription_plan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="starter">Starter</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.is_active ? "active" : "inactive"}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "active" })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Students</label>
                  <input
                    type="number"
                    value={formData.max_students}
                    onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Professors</label>
                  <input
                    type="number"
                    value={formData.max_professors}
                    onChange={(e) => setFormData({ ...formData, max_professors: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.college_code}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {editingCollege ? "Update" : "Create"} Institution
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}