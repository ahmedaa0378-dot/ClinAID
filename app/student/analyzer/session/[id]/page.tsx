"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { BodyRegion } from "@/lib/types/analyzer";
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Stethoscope,
  AlertTriangle,
  Brain,
  Heart,
  CircleDot,
  Columns,
  Activity,
  Hand,
  Footprints,
  Scan,
  Eye,
  Ear,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icon mapping for body regions
const regionIcons: Record<string, any> = {
  head_neck: Brain,
  chest: Heart,
  abdomen: CircleDot,
  back: Columns,
  pelvis: Activity,
  upper_extremity: Hand,
  lower_extremity: Footprints,
  skin: Scan,
  face: Eye,
  ear_region: Ear,
  eye: Eye,
  default: MapPin,
};

function getIconForRegion(name: string) {
  return regionIcons[name] || regionIcons.default;
}

export default function AnalyzerSessionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const sessionId = params.id as string;
  const initialRegionId = searchParams.get("region");
  
  const [currentRegion, setCurrentRegion] = useState<BodyRegion | null>(null);
  const [childRegions, setChildRegions] = useState<BodyRegion[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<BodyRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Fetch current region and its children
  useEffect(() => {
    async function fetchRegionData() {
      setLoading(true);
      
      try {
        // If we have an initial region from URL, fetch it
        if (initialRegionId || currentRegion?.id) {
          const regionId = currentRegion?.id || initialRegionId;
          
          // Fetch current region details
          const { data: regionData } = await supabase
            .from("body_regions")
            .select("*")
            .eq("id", regionId)
            .single();
          
          if (regionData) {
            setCurrentRegion(regionData);
          }
          
          // Fetch child regions
          const { data: children } = await supabase
            .from("body_regions")
            .select("*")
            .eq("parent_id", regionId)
            .eq("is_active", true)
            .order("display_order");
          
          setChildRegions(children || []);
          
          // Fetch breadcrumb path
          const { data: pathData } = await supabase.rpc("get_region_path", {
            region_id: regionId,
          });
          
          setBreadcrumb(pathData || []);
        }
      } catch (error) {
        console.error("Error fetching region data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRegionData();
  }, [initialRegionId, currentRegion?.id]);

  // Handle region selection (drill down)
  const handleRegionSelect = (region: BodyRegion) => {
    setSelectedRegion(region.id);
    
    // Check if this region has children
    supabase
      .from("body_regions")
      .select("id")
      .eq("parent_id", region.id)
      .eq("is_active", true)
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          // Has children - drill down
          setCurrentRegion(region);
          setSelectedRegion(null);
        } else {
          // No children - this is the final selection
          // Navigate to symptom selection
          router.push(`/student/analyzer/session/${sessionId}/symptoms?region=${region.id}`);
        }
      });
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (region: BodyRegion, index: number) => {
    if (index === breadcrumb.length - 1) return; // Don't navigate to current
    setCurrentRegion(region);
    setSelectedRegion(null);
  };

  // Go back to parent region
  const handleGoBack = () => {
    if (breadcrumb.length > 1) {
      const parentRegion = breadcrumb[breadcrumb.length - 2];
      setCurrentRegion(parentRegion);
    } else {
      router.push("/student/analyzer");
    }
  };

  // Get level badge color
  const getLevelColor = (level: string) => {
    switch (level) {
      case "system":
        return "bg-emerald-100 text-emerald-700";
      case "area":
        return "bg-blue-100 text-blue-700";
      case "structure":
        return "bg-purple-100 text-purple-700";
      case "component":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading regions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Select Body Region</h1>
          </div>
          <p className="text-emerald-100">
            Drill down to the specific area where symptoms are present
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <Card className="mb-6">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/student/analyzer"
                className="text-gray-500 hover:text-emerald-600 transition-colors"
              >
                Body Map
              </Link>
              {breadcrumb.map((region, index) => (
                <div key={region.id} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <button
                    onClick={() => handleBreadcrumbClick(region, index)}
                    className={`transition-colors ${
                      index === breadcrumb.length - 1
                        ? "text-emerald-600 font-medium"
                        : "text-gray-500 hover:text-emerald-600"
                    }`}
                  >
                    {region.display_name}
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Region Info */}
      {currentRegion && (
        <Card className="mb-6 border-emerald-200 bg-emerald-50/50">
          <CardContent className="py-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                {(() => {
                  const Icon = getIconForRegion(currentRegion.name);
                  return <Icon className="h-6 w-6 text-emerald-600" />;
                })()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {currentRegion.display_name}
                  </h2>
                  <Badge className={getLevelColor(currentRegion.level)}>
                    {currentRegion.level}
                  </Badge>
                </div>
                <p className="text-gray-600">{currentRegion.description}</p>
                {currentRegion.medical_term && (
                  <p className="text-sm text-gray-500 mt-1 italic">
                    Medical term: {currentRegion.medical_term}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Child Regions or Final Selection */}
      {childRegions.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Specific Area
            </h3>
            <span className="text-sm text-gray-500">
              {childRegions.length} regions available
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {childRegions.map((region) => {
              const Icon = getIconForRegion(region.name);
              const isSelected = selectedRegion === region.id;
              
              return (
                <Card
                  key={region.id}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:border-emerald-300 ${
                    isSelected ? "border-emerald-500 ring-2 ring-emerald-200" : ""
                  }`}
                  onClick={() => handleRegionSelect(region)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? "bg-emerald-100" : "bg-gray-100"
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          isSelected ? "text-emerald-600" : "text-gray-600"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-medium text-gray-900 truncate">
                            {region.display_name}
                          </h4>
                          <ChevronRight className={`h-4 w-4 flex-shrink-0 ${
                            isSelected ? "text-emerald-600" : "text-gray-400"
                          }`} />
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {region.description}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`mt-2 text-xs ${getLevelColor(region.level)}`}
                        >
                          {region.level}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : currentRegion ? (
        // No children - final selection reached
        <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/30">
          <CardContent className="py-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Region Selected: {currentRegion.display_name}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You've selected the most specific region. Now let's identify the symptoms.
            </p>
            <Button
              onClick={() => router.push(`/student/analyzer/session/${sessionId}/symptoms?region=${currentRegion.id}`)}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            >
              Continue to Symptoms
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        // No region selected
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Region Selected
            </h3>
            <p className="text-gray-600 mb-4">
              Please go back and select a body region to continue.
            </p>
            <Button variant="outline" onClick={() => router.push("/student/analyzer")}>
              Go to Body Map
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Tip</h4>
            <p className="text-sm text-blue-700 mt-1">
              Be as specific as possible when selecting the body region. This helps generate 
              more accurate differential diagnoses. You can always go back to select a 
              different region.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}