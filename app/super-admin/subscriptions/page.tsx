"use client";

import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building,
  Calendar,
  Check,
  X,
  Download,
  Eye,
  Edit,
  AlertCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Receipt,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";

const subscriptionStats = [
  { label: "Total MRR", value: "$137,152", change: "+12%", trend: "up" },
  { label: "Active Subscriptions", value: "45", change: "+3", trend: "up" },
  { label: "Trials Ending Soon", value: "4", change: "", trend: "neutral" },
  { label: "Churn Rate", value: "2.1%", change: "-0.5%", trend: "up" },
];

const plansData = [
  {
    id: "starter",
    name: "Starter",
    price: 399,
    billing: "monthly",
    colleges: 8,
    revenue: 3192,
    features: ["Up to 500 students", "10 professors", "5 GB storage", "Email support"],
    color: "gray",
  },
  {
    id: "professional",
    name: "Professional",
    price: 1999,
    billing: "monthly",
    colleges: 22,
    revenue: 43978,
    features: ["Up to 2000 students", "50 professors", "50 GB storage", "Priority support", "Custom branding"],
    color: "blue",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 4999,
    billing: "monthly",
    colleges: 18,
    revenue: 89982,
    features: ["Unlimited students", "Unlimited professors", "Unlimited storage", "24/7 support", "Custom branding", "API access", "Dedicated account manager"],
    color: "purple",
  },
];

const subscriptionsData = [
  { id: 1, college: "Harvard Medical School", plan: "Enterprise", status: "active", mrr: 4999, nextBilling: "Jan 15, 2025", paymentMethod: "Visa •••• 4242" },
  { id: 2, college: "Stanford Medicine", plan: "Enterprise", status: "active", mrr: 4999, nextBilling: "Feb 1, 2025", paymentMethod: "Mastercard •••• 5555" },
  { id: 3, college: "Johns Hopkins Medicine", plan: "Enterprise", status: "active", mrr: 4999, nextBilling: "Feb 10, 2025", paymentMethod: "Amex •••• 1234" },
  { id: 4, college: "Mayo Clinic College", plan: "Professional", status: "active", mrr: 1999, nextBilling: "Mar 5, 2025", paymentMethod: "Visa •••• 9876" },
  { id: 5, college: "UCLA Medical School", plan: "Professional", status: "active", mrr: 1999, nextBilling: "Mar 15, 2025", paymentMethod: "Visa •••• 4321" },
  { id: 6, college: "Duke Medicine", plan: "Enterprise", status: "trial", mrr: 0, nextBilling: "Trial ends Jan 10", paymentMethod: "Not set" },
  { id: 7, college: "NYU Grossman", plan: "Professional", status: "active", mrr: 1999, nextBilling: "Apr 1, 2025", paymentMethod: "Mastercard •••• 8765" },
  { id: 8, college: "UCSF Medical", plan: "Starter", status: "past_due", mrr: 399, nextBilling: "Overdue", paymentMethod: "Visa •••• 1111" },
];

const recentTransactions = [
  { id: 1, college: "Harvard Medical School", amount: 4999, date: "Dec 15, 2024", status: "paid", invoice: "INV-2024-001247" },
  { id: 2, college: "Stanford Medicine", amount: 4999, date: "Dec 14, 2024", status: "paid", invoice: "INV-2024-001246" },
  { id: 3, college: "Mayo Clinic College", amount: 1999, date: "Dec 12, 2024", status: "paid", invoice: "INV-2024-001245" },
  { id: 4, college: "UCSF Medical", amount: 399, date: "Dec 10, 2024", status: "failed", invoice: "INV-2024-001244" },
  { id: 5, college: "NYU Grossman", amount: 1999, date: "Dec 8, 2024", status: "paid", invoice: "INV-2024-001243" },
];

const upcomingRenewals = [
  { college: "Harvard Medical School", plan: "Enterprise", amount: 4999, date: "Jan 15, 2025", daysLeft: 34 },
  { college: "Duke Medicine", plan: "Enterprise", amount: 4999, date: "Jan 10, 2025", daysLeft: 29, trial: true },
  { college: "Stanford Medicine", plan: "Enterprise", amount: 4999, date: "Feb 1, 2025", daysLeft: 51 },
  { college: "Johns Hopkins Medicine", plan: "Enterprise", amount: 4999, date: "Feb 10, 2025", daysLeft: 60 },
];

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plansData[0] | null>(null);

  const filteredSubscriptions = subscriptionsData.filter((sub) =>
    sub.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      case "past_due": return "bg-red-100 text-red-700";
      case "cancelled": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Active";
      case "trial": return "Trial";
      case "past_due": return "Past Due";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  const handleEditPlan = (plan: typeof plansData[0]) => {
    setSelectedPlan(plan);
    setShowEditPlanModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-500 text-sm">Manage plans, billing, and revenue</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">Export</span>
          </button>
          <button
            onClick={() => setShowPlanModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            <CreditCard className="h-4 w-4" />
            <span>Manage Plans</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subscriptionStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-rose-600" />
              </div>
              {stat.trend !== "neutral" && (
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}>
                  {stat.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  {stat.change}
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue by Plan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plansData.map((plan) => (
            <div key={plan.id} className={`rounded-xl p-5 border-2 ${
              plan.color === "purple" ? "border-purple-200 bg-purple-50" :
              plan.color === "blue" ? "border-blue-200 bg-blue-50" :
              "border-gray-200 bg-gray-50"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-lg ${
                  plan.color === "purple" ? "text-purple-700" :
                  plan.color === "blue" ? "text-blue-700" :
                  "text-gray-700"
                }`}>{plan.name}</h3>
                <button
                  onClick={() => handleEditPlan(plan)}
                  className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <p className="text-3xl font-bold text-gray-900">${plan.price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Colleges</span>
                  <span className="font-semibold text-gray-900">{plan.colleges}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="font-semibold text-gray-900">${plan.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {[
            { id: "subscriptions", label: "All Subscriptions" },
            { id: "transactions", label: "Recent Transactions" },
            { id: "renewals", label: "Upcoming Renewals" },
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

      {/* Subscriptions Tab */}
      {activeTab === "subscriptions" && (
        <>
          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">College</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Plan</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">MRR</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Next Billing</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Payment Method</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                            <Building className="h-5 w-5 text-rose-600" />
                          </div>
                          <span className="font-medium text-gray-900">{sub.college}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(sub.plan)}`}>
                          {sub.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sub.status)}`}>
                          {getStatusLabel(sub.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-medium text-gray-900">
                          {sub.mrr > 0 ? `$${sub.mrr.toLocaleString()}` : "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-sm ${
                          sub.nextBilling === "Overdue" ? "text-red-600 font-medium" : "text-gray-600"
                        }`}>
                          {sub.nextBilling}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-600">{sub.paymentMethod}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                            <Eye className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                            <Edit className="h-4 w-4 text-gray-500" />
                          </button>
                          {sub.status === "past_due" && (
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Retry Payment">
                              <RefreshCw className="h-4 w-4 text-orange-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Invoice</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">College</th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Receipt className="h-5 w-5 text-gray-600" />
                        </div>
                        <span className="font-mono text-sm text-gray-900">{tx.invoice}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{tx.college}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-medium text-gray-900">${tx.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-600">{tx.date}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        tx.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        {tx.status === "paid" ? "Paid" : "Failed"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Invoice">
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                          <Download className="h-4 w-4 text-gray-500" />
                        </button>
                        {tx.status === "failed" && (
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Retry">
                            <RefreshCw className="h-4 w-4 text-orange-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Renewals Tab */}
      {activeTab === "renewals" && (
        <div className="space-y-4">
          {upcomingRenewals.map((renewal, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-sm border p-5 ${
                renewal.trial ? "border-orange-200" : "border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    renewal.trial ? "bg-orange-100" : "bg-rose-100"
                  }`}>
                    {renewal.trial ? (
                      <Clock className="h-6 w-6 text-orange-600" />
                    ) : (
                      <Calendar className="h-6 w-6 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{renewal.college}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPlanColor(renewal.plan)}`}>
                        {renewal.plan}
                      </span>
                      {renewal.trial && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                          Trial Ending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${renewal.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{renewal.date}</p>
                  <p className={`text-xs mt-1 ${
                    renewal.daysLeft <= 30 ? "text-orange-600" : "text-gray-500"
                  }`}>
                    {renewal.daysLeft} days left
                  </p>
                </div>
              </div>
              {renewal.trial && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Trial ending soon. Ensure payment method is set up to avoid service interruption.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Manage Plans Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Manage Subscription Plans</h3>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plansData.map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
                    <button
                      onClick={() => {
                        setShowPlanModal(false);
                        handleEditPlan(plan);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-4">
                    ${plan.price}<span className="text-sm font-normal text-gray-500">/mo</span>
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{plan.colleges}</span> colleges on this plan
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditPlanModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit {selectedPlan.name} Plan</h3>
              <button
                onClick={() => setShowEditPlanModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                <input
                  type="text"
                  defaultValue={selectedPlan.name}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Price ($)</label>
                <input
                  type="number"
                  defaultValue={selectedPlan.price}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Students</label>
                <input
                  type="text"
                  defaultValue={selectedPlan.name === "Enterprise" ? "Unlimited" : selectedPlan.name === "Professional" ? "2000" : "500"}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Professors</label>
                <input
                  type="text"
                  defaultValue={selectedPlan.name === "Enterprise" ? "Unlimited" : selectedPlan.name === "Professional" ? "50" : "10"}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Storage</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white">
                  <option value="5">5 GB</option>
                  <option value="50">50 GB</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-700">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Changes will apply to new subscriptions. Existing subscriptions will be grandfathered.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditPlanModal(false)}
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
    </div>
  );
}