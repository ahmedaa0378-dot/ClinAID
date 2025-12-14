"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  FolderOpen,
  FileText,
  Video,
  Image,
  File,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Eye,
  ChevronRight,
  Upload,
  X,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";

const modulesData = [
  {
    id: 1,
    name: "Introduction to Cardiology",
    course: "Clinical Cardiology",
    itemCount: 6,
    duration: "3 hours",
    published: true,
    items: [
      { id: 1, title: "Overview of Cardiovascular System", type: "video", duration: "45 min", views: 156, published: true },
      { id: 2, title: "Cardiac Anatomy", type: "video", duration: "60 min", views: 142, published: true },
      { id: 3, title: "Anatomy Study Guide", type: "pdf", size: "2.4 MB", views: 98, published: true },
      { id: 4, title: "Cardiac Structures Diagram", type: "image", size: "1.1 MB", views: 87, published: true },
      { id: 5, title: "Reading: Cardiac Structures", type: "document", size: "856 KB", views: 65, published: true },
      { id: 6, title: "Module 1 Summary Notes", type: "pdf", size: "1.8 MB", views: 110, published: true },
    ],
  },
  {
    id: 2,
    name: "Cardiac Physiology",
    course: "Clinical Cardiology",
    itemCount: 5,
    duration: "4 hours",
    published: true,
    items: [
      { id: 7, title: "Electrical Conduction System", type: "video", duration: "50 min", views: 134, published: true },
      { id: 8, title: "Cardiac Cycle Explained", type: "video", duration: "55 min", views: 128, published: true },
      { id: 9, title: "Blood Pressure Regulation", type: "video", duration: "45 min", views: 89, published: false },
      { id: 10, title: "Physiology Handbook", type: "pdf", size: "3.2 MB", views: 76, published: true },
      { id: 11, title: "ECG Basics Reference", type: "document", size: "1.5 MB", views: 92, published: true },
    ],
  },
  {
    id: 3,
    name: "Clinical Assessment",
    course: "Clinical Cardiology",
    itemCount: 4,
    duration: "5 hours",
    published: false,
    items: [
      { id: 12, title: "History Taking in Cardiology", type: "video", duration: "40 min", views: 0, published: false },
      { id: 13, title: "Physical Examination Techniques", type: "video", duration: "60 min", views: 0, published: false },
      { id: 14, title: "Case Study: Chest Pain", type: "document", size: "2.1 MB", views: 0, published: false },
      { id: 15, title: "Assessment Checklist", type: "pdf", size: "450 KB", views: 0, published: false },
    ],
  },
];

const statsData = [
  { label: "Total Modules", value: "12", icon: FolderOpen, color: "blue" },
  { label: "Content Items", value: "48", icon: FileText, color: "emerald" },
  { label: "Total Views", value: "2.4K", icon: Eye, color: "purple" },
  { label: "Study Hours", value: "36h", icon: Clock, color: "orange" },
];

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModules, setExpandedModules] = useState<number[]>([1]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "image":
        return <Image className="h-5 w-5 text-emerald-500" />;
      case "document":
        return <File className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-600" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-500 text-sm">Organize and manage your course materials</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModuleModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FolderOpen className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">New Module</span>
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Content</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="all">All Courses</option>
            <option value="cardiology">Clinical Cardiology</option>
            <option value="ecg">ECG Interpretation</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="all">All Types</option>
            <option value="video">Videos</option>
            <option value="pdf">PDFs</option>
            <option value="document">Documents</option>
          </select>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {modulesData.map((module) => {
          const isExpanded = expandedModules.includes(module.id);

          return (
            <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Module Header */}
              <div
                onClick={() => toggleModule(module.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <ChevronRight
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{module.name}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          module.published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {module.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {module.course} • {module.itemCount} items • {module.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Module Content */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  <div className="divide-y divide-gray-100">
                    {module.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(item.type)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} •{" "}
                              {"duration" in item ? item.duration : item.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span>{item.views}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              item.published
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.published ? "Live" : "Draft"}
                          </span>
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                              <Eye className="h-4 w-4 text-gray-400" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                              <Edit className="h-4 w-4 text-gray-400" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                              <Download className="h-4 w-4 text-gray-400" />
                            </button>
                            <button className="p-1.5 hover:bg-red-50 rounded transition-colors">
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      Add content to this module
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload Content</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter content title"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module *
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select a module</option>
                  {modulesData.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type *
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select type</option>
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Drag and drop or <span className="text-blue-600">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOC, MP4, PNG up to 100MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="publish" className="rounded border-gray-300" />
                <label htmlFor="publish" className="text-sm text-gray-700">
                  Publish immediately
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Module</h3>
              <button
                onClick={() => setShowModuleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Week 1: Introduction"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course *
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select a course</option>
                  <option value="1">Clinical Cardiology</option>
                  <option value="2">ECG Interpretation</option>
                  <option value="3">Advanced Cardiac Care</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of this module"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModuleModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Create Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}