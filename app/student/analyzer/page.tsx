"use client";

import { useRouter } from "next/navigation";
import { useBodyRegions } from "@/hooks/useBodyRegions";
import {
  Brain,
  Heart,
  CircleDot,
  Columns,
  Activity,
  Hand,
  Footprints,
  Scan,
  Stethoscope,
  AlertCircle,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "head-neck": Brain,
  "chest": Heart,
  "abdomen": CircleDot,
  "back": Columns,
  "pelvis-groin": Activity,
  "arms-hands": Hand,
  "legs-feet": Footprints,
  "skin": Scan,
};

const gradients = [
  "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
  "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
  "from-teal-500/20 via-emerald-500/20 to-green-500/20",
  "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
  "from-emerald-500/20 via-cyan-500/20 to-blue-500/20",
  "from-cyan-500/20 via-teal-500/20 to-emerald-500/20",
  "from-teal-500/20 via-cyan-500/20 to-blue-500/20",
  "from-emerald-500/20 via-green-500/20 to-teal-500/20",
];

const getIconForRegion = (name: string): LucideIcon => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("head") || lowerName.includes("neck")) return Brain;
  if (lowerName.includes("chest")) return Heart;
  if (lowerName.includes("abdomen")) return CircleDot;
  if (lowerName.includes("back")) return Columns;
  if (lowerName.includes("pelvis") || lowerName.includes("groin")) return Activity;
  if (lowerName.includes("arm") || lowerName.includes("hand")) return Hand;
  if (lowerName.includes("leg") || lowerName.includes("feet") || lowerName.includes("foot")) return Footprints;
  if (lowerName.includes("skin")) return Scan;
  return Stethoscope;
};

function BodySystemCard({
  region,
  gradient,
  onClick,
}: {
  region: any;
  gradient: string;
  onClick: () => void;
}) {
  const Icon = getIconForRegion(region.name);

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-emerald-400 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 text-left"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-7 w-7 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
              {region.display_name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {region.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Start Assessment</span>
          <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

export default function SymptomAnalyzerPage() {
  const router = useRouter();
  const { regions, loading, error } = useBodyRegions(null);

  const handleRegionClick = (regionId: string) => {
    router.push(`/student/analyzer/session/new?region=${regionId}`);
  };

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-8 mb-8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Symptom Analyzer</h1>
          </div>
          <p className="text-white/90 text-lg max-w-3xl leading-relaxed">
            Practice clinical diagnosis by analyzing patient symptoms. Select a body system to begin your diagnostic training session.
            This AI-powered tool will guide you through a systematic clinical reasoning process.
          </p>

          <div className="mt-6 flex items-center gap-2 text-white/80 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Interactive clinical case simulation for educational purposes</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>Failed to load body systems: {error}</p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select Body System</h2>
            <p className="text-gray-600 mt-1">Choose a region to start your assessment</p>
          </div>
          {!loading && regions.length > 0 && (
            <div className="text-sm text-gray-500">
              {regions.length} system{regions.length !== 1 ? 's' : ''} available
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading ? (
            <>
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          ) : regions.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Stethoscope className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Body Systems Available</h3>
              <p className="text-gray-600">Body system data is not configured yet.</p>
            </div>
          ) : (
            regions.map((region, index) => (
              <BodySystemCard
                key={region.id}
                region={region}
                gradient={gradients[index % gradients.length]}
                onClick={() => handleRegionClick(region.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
