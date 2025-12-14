"use client";

import { useState } from "react";
import {
  Settings,
  Globe,
  Shield,
  Bell,
  Mail,
  Server,
  Zap,
  Database,
  Key,
  Clock,
  Save,
  AlertTriangle,
  Check,
  ToggleLeft,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Wrench,
} from "lucide-react";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "security", label: "Security", icon: Shield },
  { id: "email", label: "Email/SMTP", icon: Mail },
  { id: "features", label: "Feature Flags", icon: Zap },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "api", label: "API & Limits", icon: Server },
];

const featureFlags = [
  { id: "ai_tutor", name: "AI Tutor", description: "Enable AI-powered tutoring for students", enabled: true, beta: false },
  { id: "video_consult", name: "Video Consultations", description: "Enable Zoom video consultations", enabled: true, beta: false },
  { id: "virtual_patient", name: "Virtual Patient Simulator", description: "AI-powered patient simulations", enabled: false, beta: true },
  { id: "advanced_analytics", name: "Advanced Analytics", description: "Detailed performance analytics", enabled: true, beta: false },
  { id: "custom_branding", name: "Custom Branding", description: "Allow colleges to customize branding", enabled: true, beta: false },
  { id: "api_access", name: "API Access", description: "External API access for integrations", enabled: true, beta: false },
  { id: "mobile_app", name: "Mobile App Access", description: "Native mobile app support", enabled: false, beta: true },
  { id: "sso", name: "Single Sign-On (SSO)", description: "SAML/OAuth SSO integration", enabled: true, beta: false },
];

const apiLimits = [
  { endpoint: "Authentication", limit: "100 req/min", usage: 45 },
  { endpoint: "Content API", limit: "500 req/min", usage: 72 },
  { endpoint: "Quiz API", limit: "200 req/min", usage: 38 },
  { endpoint: "Analytics API", limit: "50 req/min", usage: 15 },
  { endpoint: "File Upload", limit: "20 req/min", usage: 8 },
];

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [features, setFeatures] = useState(featureFlags);

  const handleSave = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f => 
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-500 text-sm">Configure platform-wide settings and defaults</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Success Message */}
      {showSaveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="h-5 w-5 text-emerald-600" />
          <span className="text-emerald-700 font-medium">Settings saved successfully!</span>
        </div>
      )}

      {/* Maintenance Mode Warning */}
      {maintenanceMode && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="text-orange-700 font-medium">Maintenance mode is active. Users cannot access the platform.</span>
          </div>
          <button
            onClick={() => setMaintenanceMode(false)}
            className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
          >
            Disable
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-rose-50 text-rose-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${
                    activeTab === tab.id ? "text-rose-600" : "text-gray-400"
                  }`} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-rose-600" />
                  Platform Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      defaultValue="ClinAid"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform URL
                    </label>
                    <input
                      type="url"
                      defaultValue="https://clinaid.com"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      defaultValue="support@clinaid.com"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-rose-600" />
                  Default Settings for New Colleges
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Timezone
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white">
                      <option value="UTC">UTC</option>
                      <option value="EST" selected>Eastern Time (EST)</option>
                      <option value="PST">Pacific Time (PST)</option>
                      <option value="GMT">GMT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Language
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white">
                      <option value="en" selected>English (US)</option>
                      <option value="en-gb">English (UK)</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trial Period (days)
                    </label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Storage Limit (GB)
                    </label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Key className="h-5 w-5 text-rose-600" />
                  Password Policy (Platform-wide)
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Password Length
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white">
                      <option value="8">8 characters</option>
                      <option value="10">10 characters</option>
                      <option value="12" selected>12 characters</option>
                      <option value="16">16 characters</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Require uppercase letters</span>
                      <input type="checkbox" className="rounded border-gray-300 text-rose-600" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Require numbers</span>
                      <input type="checkbox" className="rounded border-gray-300 text-rose-600" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Require special characters</span>
                      <input type="checkbox" className="rounded border-gray-300 text-rose-600" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Enforce 2FA for all Super Admins</span>
                      <input type="checkbox" className="rounded border-gray-300 text-rose-600" defaultChecked />
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-rose-600" />
                  Security Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Rate Limiting</p>
                      <p className="text-sm text-gray-500">Protect against brute force attacks</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">IP Whitelisting</p>
                      <p className="text-sm text-gray-500">Restrict Super Admin access by IP</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Audit Logging</p>
                      <p className="text-sm text-gray-500">Log all admin actions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email/SMTP Settings */}
          {activeTab === "email" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-rose-600" />
                  SMTP Configuration
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        defaultValue="smtp.sendgrid.net"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="text"
                        defaultValue="587"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      defaultValue="apikey"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Password
                    </label>
                    <div className="relative">
                      <input
                        type={showSmtpPassword ? "text" : "password"}
                        defaultValue="SG.xxxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <button
                        onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded"
                      >
                        {showSmtpPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        defaultValue="noreply@clinaid.com"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        defaultValue="ClinAid Platform"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Send Test Email</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h2>
                <div className="space-y-3">
                  {["Welcome Email", "Password Reset", "Trial Ending", "Payment Failed", "Subscription Renewed"].map((template) => (
                    <div key={template} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{template}</span>
                      <button className="text-sm text-rose-600 hover:text-rose-700 font-medium">
                        Edit Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feature Flags */}
          {activeTab === "features" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-rose-600" />
                Feature Flags
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Enable or disable features platform-wide. Changes affect all colleges.
              </p>
              <div className="space-y-4">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      feature.enabled ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        feature.enabled ? "bg-emerald-100" : "bg-gray-200"
                      }`}>
                        <Zap className={`h-5 w-5 ${feature.enabled ? "text-emerald-600" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{feature.name}</p>
                          {feature.beta && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                              Beta
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={feature.enabled}
                        onChange={() => toggleFeature(feature.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Mode */}
          {activeTab === "maintenance" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-rose-600" />
                  Maintenance Mode
                </h2>
                <div className={`p-6 rounded-xl ${
                  maintenanceMode ? "bg-orange-50 border-2 border-orange-200" : "bg-gray-50 border border-gray-200"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-lg text-gray-900">
                        {maintenanceMode ? "Maintenance Mode Active" : "Platform is Online"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {maintenanceMode
                          ? "All users are currently locked out of the platform"
                          : "All systems operational and users can access the platform"
                        }
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${
                      maintenanceMode ? "bg-orange-500" : "bg-emerald-500"
                    } animate-pulse`} />
                  </div>
                  <button
                    onClick={() => setShowMaintenanceModal(true)}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      maintenanceMode
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-orange-600 text-white hover:bg-orange-700"
                    }`}
                  >
                    {maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Message</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      defaultValue="We're currently under maintenance"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      defaultValue="We're performing scheduled maintenance to improve your experience. We'll be back shortly. Thank you for your patience."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Duration
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white">
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="240">4 hours</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Maintenance</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 text-rose-600" />
                    <span className="text-sm text-gray-700">Send notification email to all admins 24 hours before</span>
                  </label>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Schedule Maintenance
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* API & Limits */}
          {activeTab === "api" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Server className="h-5 w-5 text-rose-600" />
                  API Rate Limits
                </h2>
                <div className="space-y-4">
                  {apiLimits.map((api) => (
                    <div key={api.endpoint} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{api.endpoint}</span>
                        <span className="text-sm text-gray-500">{api.limit}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            api.usage > 80 ? "bg-red-500" :
                            api.usage > 50 ? "bg-yellow-500" :
                            "bg-emerald-500"
                          }`}
                          style={{ width: `${api.usage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Current usage: {api.usage}%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-rose-600" />
                  Resource Limits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max File Upload Size (MB)
                    </label>
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Video Duration (minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue="120"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Quiz Questions
                    </label>
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Concurrent Sessions
                    </label>
                    <input
                      type="number"
                      defaultValue="5"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">API Documentation</h2>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-700">Developer Documentation</span>
                  </div>
                  <p className="text-sm text-blue-600 mb-3">
                    Complete API reference available at docs.clinaid.com/api
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    View Documentation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Maintenance Mode Confirmation Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                maintenanceMode ? "bg-emerald-100" : "bg-orange-100"
              }`}>
                {maintenanceMode ? (
                  <Check className="h-8 w-8 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {maintenanceMode ? "Disable Maintenance Mode?" : "Enable Maintenance Mode?"}
              </h3>
              <p className="text-gray-500 mt-2">
                {maintenanceMode
                  ? "This will restore access for all users across all colleges."
                  : "This will immediately lock out all users from all colleges. Only Super Admins can access the platform."
                }
              </p>
            </div>

            {!maintenanceMode && (
              <div className="p-4 bg-orange-50 rounded-lg mb-6">
                <p className="text-sm text-orange-700">
                  <strong>Warning:</strong> This affects approximately 12,847 users across 48 colleges.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowMaintenanceModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setMaintenanceMode(!maintenanceMode);
                  setShowMaintenanceModal(false);
                }}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  maintenanceMode
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                {maintenanceMode ? "Enable Platform" : "Enable Maintenance"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}