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
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface Symptom {
  id: string;
  name: string;
  description: string;
  is_red_flag: boolean;
  category?: string;
}

// Sample symptoms based on region - In production, this would come from AI
const getSymptomsByRegion = (regionName: string): Symptom[] => {
  const symptomMap: Record<string, Symptom[]> = {
    head_neck: [
      { id: "s1", name: "Headache", description: "Pain or discomfort in the head or scalp", is_red_flag: false },
      { id: "s2", name: "Dizziness", description: "Feeling of lightheadedness or unsteadiness", is_red_flag: false },
      { id: "s3", name: "Vision Changes", description: "Blurred vision, double vision, or vision loss", is_red_flag: true },
      { id: "s4", name: "Neck Stiffness", description: "Difficulty moving neck, pain with movement", is_red_flag: true },
      { id: "s5", name: "Facial Pain", description: "Pain in face, jaw, or around eyes", is_red_flag: false },
      { id: "s6", name: "Hearing Loss", description: "Decreased hearing in one or both ears", is_red_flag: false },
    ],
    eye: [
      { id: "s1", name: "Eye Pain", description: "Sharp or aching pain in or around the eye", is_red_flag: false },
      { id: "s2", name: "Redness", description: "Red or bloodshot appearance of the eye", is_red_flag: false },
      { id: "s3", name: "Sudden Vision Loss", description: "Rapid decrease or loss of vision", is_red_flag: true },
      { id: "s4", name: "Discharge", description: "Mucus or pus coming from the eye", is_red_flag: false },
      { id: "s5", name: "Light Sensitivity", description: "Pain or discomfort when exposed to light", is_red_flag: false },
      { id: "s6", name: "Floaters", description: "Dark spots or lines in vision", is_red_flag: false },
    ],
    chest: [
      { id: "s1", name: "Chest Pain", description: "Pain, pressure, or discomfort in the chest", is_red_flag: true },
      { id: "s2", name: "Shortness of Breath", description: "Difficulty breathing or catching breath", is_red_flag: true },
      { id: "s3", name: "Palpitations", description: "Feeling of heart racing or skipping beats", is_red_flag: false },
      { id: "s4", name: "Cough", description: "Persistent cough, dry or productive", is_red_flag: false },
      { id: "s5", name: "Wheezing", description: "Whistling sound when breathing", is_red_flag: false },
      { id: "s6", name: "Chest Tightness", description: "Feeling of pressure or constriction", is_red_flag: false },
    ],
    abdomen: [
      { id: "s1", name: "Abdominal Pain", description: "Pain anywhere in the belly area", is_red_flag: false },
      { id: "s2", name: "Nausea", description: "Feeling of sickness with urge to vomit", is_red_flag: false },
      { id: "s3", name: "Vomiting Blood", description: "Blood in vomit or coffee-ground appearance", is_red_flag: true },
      { id: "s4", name: "Bloating", description: "Feeling of fullness or swelling in abdomen", is_red_flag: false },
      { id: "s5", name: "Change in Bowel Habits", description: "Diarrhea, constipation, or alternating", is_red_flag: false },
      { id: "s6", name: "Loss of Appetite", description: "Decreased desire to eat", is_red_flag: false },
    ],
    default: [
      { id: "s1", name: "Pain", description: "Discomfort or pain in the affected area", is_red_flag: false },
      { id: "s2", name: "Swelling", description: "Visible enlargement or puffiness", is_red_flag: false },
      { id: "s3", name: "Redness", description: "Red or inflamed appearance", is_red_flag: false },
      { id: "s4", name: "Warmth", description: "Area feels warm to touch", is_red_flag: false },
      { id: "s5", name: "Limited Movement", description: "Difficulty moving the affected area", is_red_flag: false },
      { id: "s6", name: "Numbness", description: "Loss of sensation or tingling", is_red_flag: false },
    ],
  };
  
  return symptomMap[regionName] || symptomMap.default;
};

export default function SymptomsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const sessionId = params.id as string;
  const regionId = searchParams.get("region");
  
  const [region, setRegion] = useState<BodyRegion | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Fetch region and generate symptoms
  useEffect(() => {
    async function fetchData() {
      if (!regionId) return;
      
      setLoading(true);
      
      try {
        // Fetch region details
        const { data: regionData } = await supabase
          .from("body_regions")
          .select("*")
          .eq("id", regionId)
          .single();
        
        if (regionData) {
          setRegion(regionData);
          
          // Get symptoms for this region (in production, this would be an AI call)
          const regionSymptoms = getSymptomsByRegion(regionData.name);
          setSymptoms(regionSymptoms);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [regionId]);

  // Toggle symptom selection
  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  // Continue to questions
  const handleContinue = () => {
    if (selectedSymptoms.length === 0) return;
    
    // Store selected symptoms and navigate to questions
    const symptomsParam = encodeURIComponent(JSON.stringify(
      symptoms.filter(s => selectedSymptoms.includes(s.id))
    ));
    
    router.push(
      `/student/analyzer/session/${sessionId}/questions?region=${regionId}&symptoms=${symptomsParam}`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading symptoms...</p>
        </div>
      </div>
    );
  }

  const selectedCount = selectedSymptoms.length;
  const redFlagSelected = symptoms
    .filter(s => selectedSymptoms.includes(s.id))
    .some(s => s.is_red_flag);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Region Selection
        </Button>
        
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Select Symptoms</h1>
          </div>
          <p className="text-emerald-100">
            Choose all symptoms the patient is experiencing in the {region?.display_name} region
          </p>
        </div>
      </div>

      {/* Region Info */}
      {region && (
        <Card className="mb-6 border-emerald-200 bg-emerald-50/50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Selected Region:</span>
              <Badge variant="outline" className="bg-white">
                {region.display_name}
              </Badge>
              {region.medical_term && (
                <span className="text-gray-400">({region.medical_term})</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Red Flag Warning */}
      {redFlagSelected && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Red Flag Symptom Detected</h4>
                <p className="text-sm text-red-700 mt-1">
                  One or more selected symptoms are considered red flags that may indicate 
                  a serious condition requiring urgent evaluation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symptoms List */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Common Symptoms
            </CardTitle>
            <Badge variant="outline">
              {selectedCount} selected
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {symptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              
              return (
                <div
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? symptom.is_red_flag
                        ? "border-red-300 bg-red-50"
                        : "border-emerald-300 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      {isSelected ? (
                        <CheckCircle2 className={`h-5 w-5 ${
                          symptom.is_red_flag ? "text-red-600" : "text-emerald-600"
                        }`} />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium ${
                          isSelected 
                            ? symptom.is_red_flag ? "text-red-900" : "text-emerald-900"
                            : "text-gray-900"
                        }`}>
                          {symptom.name}
                        </h4>
                        {symptom.is_red_flag && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Red Flag
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {symptom.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Select at least one symptom to continue
        </p>
        <Button
          onClick={handleContinue}
          disabled={selectedCount === 0}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
        >
          Continue to Questions
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Help Text */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex gap-3">
          <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900">How to Select Symptoms</h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Click on any symptom to select or deselect it</li>
              <li>• Select all symptoms the patient is currently experiencing</li>
              <li>• Red flag symptoms indicate potentially serious conditions</li>
              <li>• You can always come back and modify your selections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}