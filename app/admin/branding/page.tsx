"use client";

import { useState } from "react";
import {
  Palette,
  Upload,
  Globe,
  Image,
  Eye,
  Save,
  RotateCcw,
  Check,
  Mail,
  Smartphone,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";

export default function BrandingPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#5B21B6");
  const [secondaryColor, setSecondaryColor] = useState("#7C3AED");
  const [accentColor, setAccentColor] = useState("#A78BFA");
  const [subdomain, setSubdomain] = useState("harvard-medical");
  const [collegeName, setCollegeName] = useState("Harvard Medical School");
  const [tagline, setTagline] = useState("Excellence in Medical Education");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const colorPresets = [
    { name: "Purple", primary: "#5B21B6", secondary: "#7C3AED" },
    { name: "Blue", primary: "#1E40AF", secondary: "#3B82F6" },
    { name: "Green", primary: "#065F46", secondary: "#10B981" },
    { name: "Red", primary: "#991B1B", secondary: "#EF4444" },
    { name: "Orange", primary: "#C2410C", secondary: "#F97316" },
    { name: "Teal", primary: "#0F766E", secondary: "#14B8A6" },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setPrimaryColor("#5B21B6");
    setSecondaryColor("#7C3AED");
    setAccentColor("#A78BFA");
    setLogoPreview(null);
    setFaviconPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branding & White-Label</h1>
          <p className="text-gray-500 text-sm">Customize your institution's look and feel</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">Reset</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSaveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="h-5 w-5 text-emerald-600" />
          <span className="text-emerald-700 font-medium">Branding settings saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Name *
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Your institution's tagline"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subdomain
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-200 rounded-r-lg text-gray-500">
                    .clinaid.com
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your portal will be accessible at: https://{subdomain}.clinaid.com
                </p>
              </div>
            </div>
          </div>

          {/* Logo & Favicon */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Image className="h-5 w-5 text-purple-600" />
              Logo & Favicon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Logo
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  {logoPreview ? (
                    <div className="space-y-3">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-16 mx-auto object-contain"
                      />
                      <button
                        onClick={() => setLogoPreview(null)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="text-purple-600">Upload logo</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, SVG up to 2MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 200x60px, transparent background
                </p>
              </div>

              {/* Favicon Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  {faviconPreview ? (
                    <div className="space-y-3">
                      <img
                        src={faviconPreview}
                        alt="Favicon preview"
                        className="h-12 w-12 mx-auto object-contain"
                      />
                      <button
                        onClick={() => setFaviconPreview(null)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="text-purple-600">Upload favicon</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">ICO, PNG 32x32px</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Appears in browser tab
                </p>
              </div>
            </div>
          </div>

          {/* Color Scheme */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Color Scheme
            </h2>

            {/* Color Presets */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setPrimaryColor(preset.primary);
                      setSecondaryColor(preset.secondary);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      primaryColor === preset.primary
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                    />
                    <span className="text-sm text-gray-700">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-200"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Sidebar, buttons</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-200"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Hover states, accents</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-200"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Highlights, badges</p>
              </div>
            </div>
          </div>

          {/* Email Customization */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-600" />
              Email Customization
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Footer Text
                </label>
                <textarea
                  rows={3}
                  placeholder="Custom footer text for all system emails..."
                  defaultValue={`${collegeName}\n${tagline}\nContact: support@${subdomain}.clinaid.com`}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600" defaultChecked />
                <label className="text-sm text-gray-700">Include institution logo in emails</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600" defaultChecked />
                <label className="text-sm text-gray-700">Use branded colors in email templates</label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="space-y-6">
          {/* Preview Toggle */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Live Preview</h3>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-2 rounded-lg transition-colors ${
                    previewMode === "desktop" ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <Monitor className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-2 rounded-lg transition-colors ${
                    previewMode === "mobile" ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <Smartphone className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Sidebar Preview</h3>
            <div
              className={`rounded-lg overflow-hidden ${
                previewMode === "mobile" ? "w-48 mx-auto" : "w-full"
              }`}
            >
              <div
                className="p-4"
                style={{
                  background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                {/* Logo Area */}
                <div className="flex items-center gap-3 mb-6">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="h-8 object-contain" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <span style={{ color: primaryColor }} className="font-bold text-lg">
                        {collegeName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-white font-bold text-sm block">
                      {collegeName.length > 15 ? collegeName.substring(0, 15) + "..." : collegeName}
                    </span>
                    <span className="text-white/70 text-xs">Student Portal</span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                  {["Dashboard", "My Courses", "AI Tutor", "Quizzes"].map((item, index) => (
                    <div
                      key={item}
                      className={`px-3 py-2 rounded-lg text-white text-sm ${
                        index === 0 ? "" : "opacity-70"
                      }`}
                      style={{
                        backgroundColor: index === 0 ? accentColor : "transparent",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Button Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Button Preview</h3>
            <div className="space-y-3">
              <button
                className="w-full py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: primaryColor }}
              >
                Primary Button
              </button>
              <button
                className="w-full py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: secondaryColor }}
              >
                Secondary Button
              </button>
              <button
                className="w-full py-2 rounded-lg font-medium border-2"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Outline Button
              </button>
            </div>
          </div>

          {/* Login Page Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Login Page Preview</h3>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-center mb-4">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="h-10 mx-auto mb-2" />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <span style={{ color: primaryColor }} className="font-bold text-xl">
                        {collegeName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">{tagline}</p>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-100 rounded" />
                  <div className="h-8 bg-gray-100 rounded" />
                  <div
                    className="h-8 rounded text-white text-xs flex items-center justify-center font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Sign In
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette Display */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Your Color Palette</h3>
            <div className="flex rounded-lg overflow-hidden">
              <div
                className="flex-1 h-16 flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <span className="text-white text-xs font-medium">Primary</span>
              </div>
              <div
                className="flex-1 h-16 flex items-center justify-center"
                style={{ backgroundColor: secondaryColor }}
              >
                <span className="text-white text-xs font-medium">Secondary</span>
              </div>
              <div
                className="flex-1 h-16 flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <span className="text-white text-xs font-medium">Accent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}