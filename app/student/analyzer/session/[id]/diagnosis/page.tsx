"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { BodyRegion, Symptom, DifferentialDiagnosis } from "@/lib/types/analyzer";
import {
  ArrowLeft,
  Loader2,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  FileText,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Generate differential diagnoses based on symptoms - In production, this would be AI-generated
const generateDifferentialDiagnoses = (
  symptoms: Symptom[],
  regionName: string,
  answers: Record<string, string>
): DifferentialDiagnosis[] => {
  // Sample diagnoses based on region
  const diagnosisMap: Record<string, DifferentialDiagnosis[]> = {
    head_neck: [
      {
        id: "d1",
        session_id: "",
        diagnosis_name: "Tension-Type Headache",
        diagnosis_code: "G44.2",
        probability: "high",
        confidence_score: 0.85,
        supporting_findings: ["Bilateral location", "Pressing quality", "Mild to moderate intensity"],
        brief_description: "Most common primary headache disorder characterized by bilateral, pressing pain.",
        diagnostic_criteria: "At least 10 episodes occurring on <15 days/month, lasting 30 min to 7 days",
        typical_presentation: "Bilateral pressing/tightening pain, not aggravated by routine physical activity",
        red_flags: [],
        guideline_source: "International Headache Society (IHS)",
      },
      {
        id: "d2",
        session_id: "",
        diagnosis_name: "Migraine without Aura",
        diagnosis_code: "G43.0",
        probability: "moderate",
        confidence_score: 0.65,
        supporting_findings: ["Unilateral location possible", "Pulsating quality", "Nausea"],
        contradicting_findings: ["No photophobia reported"],
        brief_description: "Recurrent headache disorder with attacks lasting 4-72 hours.",
        diagnostic_criteria: "At least 5 attacks with specific features including nausea or photo/phonophobia",
        typical_presentation: "Unilateral, pulsating, moderate to severe pain with nausea",
        red_flags: ["Sudden onset", "Worst headache of life", "Neurological symptoms"],
        guideline_source: "International Headache Society (IHS)",
      },
      {
        id: "d3",
        session_id: "",
        diagnosis_name: "Cervicogenic Headache",
        diagnosis_code: "G44.841",
        probability: "moderate",
        confidence_score: 0.55,
        supporting_findings: ["Neck stiffness", "Reduced range of motion"],
        brief_description: "Secondary headache caused by a disorder of the cervical spine.",
        diagnostic_criteria: "Clinical and/or imaging evidence of cervical spine disorder",
        typical_presentation: "Unilateral headache with neck pain, triggered by neck movement",
        red_flags: [],
        guideline_source: "International Headache Society (IHS)",
      },
    ],
    chest: [
      {
        id: "d1",
        session_id: "",
        diagnosis_name: "Acute Coronary Syndrome",
        diagnosis_code: "I24.9",
        probability: "high",
        confidence_score: 0.75,
        supporting_findings: ["Chest pain", "Shortness of breath", "Risk factors"],
        brief_description: "Spectrum of conditions due to decreased blood flow to the heart.",
        diagnostic_criteria: "Clinical presentation + ECG changes + cardiac biomarkers",
        typical_presentation: "Crushing chest pain, radiation to arm/jaw, diaphoresis",
        red_flags: ["Severe chest pain", "Hypotension", "Altered mental status"],
        guideline_source: "American Heart Association (AHA)",
      },
      {
        id: "d2",
        session_id: "",
        diagnosis_name: "Costochondritis",
        diagnosis_code: "M94.0",
        probability: "moderate",
        confidence_score: 0.60,
        supporting_findings: ["Localized tenderness", "Reproducible with palpation"],
        brief_description: "Inflammation of costal cartilage causing chest wall pain.",
        diagnostic_criteria: "Clinical diagnosis - reproducible tenderness at costochondral junctions",
        typical_presentation: "Sharp, localized chest pain worsened by movement or palpation",
        red_flags: [],
        guideline_source: "Clinical Practice Guidelines",
      },
    ],
    abdomen: [
      {
        id: "d1",
        session_id: "",
        diagnosis_name: "Acute Appendicitis",
        diagnosis_code: "K35.80",
        probability: "high",
        confidence_score: 0.80,
        supporting_findings: ["RLQ pain", "Nausea", "Fever"],
        brief_description: "Acute inflammation of the appendix requiring surgical evaluation.",
        diagnostic_criteria: "Clinical presentation + imaging (CT/US) + elevated WBC",
        typical_presentation: "Periumbilical pain migrating to RLQ, anorexia, nausea",
        red_flags: ["Rigid abdomen", "Signs of perforation", "Sepsis"],
        guideline_source: "American College of Surgeons",
      },
      {
        id: "d2",
        session_id: "",
        diagnosis_name: "Gastroesophageal Reflux Disease",
        diagnosis_code: "K21.0",
        probability: "moderate",
        confidence_score: 0.65,
        supporting_findings: ["Epigastric pain", "Heartburn", "Postprandial symptoms"],
        brief_description: "Chronic condition where stomach acid flows back into the esophagus.",
        diagnostic_criteria: "Typical symptoms responsive to PPI therapy",
        typical_presentation: "Heartburn, regurgitation, dysphagia",
        red_flags: ["Dysphagia", "Weight loss", "GI bleeding"],
        guideline_source: "American College of Gastroenterology",
      },
    ],
    default: [
      {
        id: "d1",
        session_id: "",
        diagnosis_name: "Further Evaluation Needed",
        probability: "moderate",
        confidence_score: 0.50,
        supporting_findings: ["Symptoms reported"],
        brief_description: "Additional clinical information needed for accurate diagnosis.",
        diagnostic_criteria: "Comprehensive history, physical exam, and appropriate testing",
        typical_presentation: "Variable based on underlying condition",
        red_flags: [],
      },
    ],
  };

  return diagnosisMap[regionName] || diagnosisMap.default;
};

export default function DiagnosisPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const sessionId = params.id as string;
  const regionId = searchParams.get("region");
  const symptomsParam = searchParams.get("symptoms");
  const answersParam = searchParams.get("answers");
  
  const [region, setRegion] = useState<BodyRegion | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [diagnoses, setDiagnoses] = useState<DifferentialDiagnosis[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Parse data and generate diagnoses
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      try {
        // Parse symptoms and answers
        const parsedSymptoms = symptomsParam 
          ? JSON.parse(decodeURIComponent(symptomsParam)) 
          : [];
        const parsedAnswers = answersParam 
          ? JSON.parse(decodeURIComponent(answersParam)) 
          : {};
        
        setSymptoms(parsedSymptoms);
        
        // Fetch region
        if (regionId) {
          const { data: regionData } = await supabase
            .from("body_regions")
            .select("*")
            .eq("id", regionId)
            .single();
          
          if (regionData) {
            setRegion(regionData);
            
            // Generate differential diagnoses
            const generatedDiagnoses = generateDifferentialDiagnoses(
              parsedSymptoms,
              regionData.name,
              parsedAnswers
            );
            setDiagnoses(generatedDiagnoses);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [regionId, symptomsParam, answersParam]);

  // Get probability badge color
  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Get probability icon
  const getProbabilityIcon = (probability: string) => {
    switch (probability) {
      case "high":
        return <TrendingUp className="h-4 w-4" />;
      case "moderate":
        return <Minus className="h-4 w-4" />;
      case "low":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Handle diagnosis selection and continue
  const handleContinue = () => {
    if (!selectedDiagnosis) return;
    
    const diagnosis = diagnoses.find(d => d.id === selectedDiagnosis);
    if (!diagnosis) return;
    
    // Navigate to report generation
    router.push(
      `/student/analyzer/session/${sessionId}/report?region=${regionId}&diagnosis=${encodeURIComponent(JSON.stringify(diagnosis))}&symptoms=${symptomsParam}`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
          <p className="mt-2 text-gray-600">Generating differential diagnoses...</p>
        </div>
      </div>
    );
  }

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
          Back to Questions
        </Button>
        
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Differential Diagnosis</h1>
          </div>
          <p className="text-emerald-100">
            Based on the symptoms and clinical information provided
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="mb-6 bg-gray-50">
        <CardContent className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Region</p>
              <p className="font-medium">{region?.displayname}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Symptoms Reported</p>
              <div className="flex flex-wrap gap-1">
                {symptoms.map((s) => (
                  <Badge key={s.id} variant="secondary" className="text-xs">
                    {s.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800">
                Review the differential diagnoses below and select the most likely diagnosis 
                based on your clinical reasoning. Click on each diagnosis to see more details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Differential Diagnoses */}
      <div className="space-y-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Possible Diagnoses ({diagnoses.length})
        </h2>
        
        <Accordion type="single" collapsible className="space-y-3">
          {diagnoses.map((diagnosis, index) => {
            const isSelected = selectedDiagnosis === diagnosis.id;
            const hasRedFlags = diagnosis.red_flags && diagnosis.red_flags.length > 0;
            
            return (
              <AccordionItem
                key={diagnosis.id}
                value={diagnosis.id}
                className={`border-2 rounded-xl overflow-hidden transition-all ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-50/50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <AccordionTrigger className="px-4 py-4 hover:no-underline">
                  <div className="flex items-start gap-4 w-full text-left">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDiagnosis(diagnosis.id);
                      }}
                      className={`p-1 rounded-full border-2 cursor-pointer transition-colors ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-gray-300 hover:border-emerald-400"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">
                          {index + 1}. {diagnosis.diagnosis_name}
                        </span>
                        <Badge className={getProbabilityColor(diagnosis.probability)}>
                          {getProbabilityIcon(diagnosis.probability)}
                          <span className="ml-1 capitalize">{diagnosis.probability} probability</span>
                        </Badge>
                        {diagnosis.diagnosis_code && (
                          <Badge variant="outline" className="text-xs">
                            ICD: {diagnosis.diagnosis_code}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {diagnosis.brief_description}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">
                        {Math.round(diagnosis.confidence_score * 100)}%
                      </div>
                      <p className="text-xs text-gray-500">confidence</p>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-4 pb-4">
                  <div className="ml-10 space-y-4">
                    {/* Supporting Findings */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Supporting Findings
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {diagnosis.supporting_findings.map((finding, i) => (
                          <li key={i}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Contradicting Findings */}
                    {diagnosis.contradicting_findings && diagnosis.contradicting_findings.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          Contradicting Findings
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {diagnosis.contradicting_findings.map((finding, i) => (
                            <li key={i}>{finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Diagnostic Criteria */}
                    {diagnosis.diagnostic_criteria && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          Diagnostic Criteria
                        </h4>
                        <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
                          {diagnosis.diagnostic_criteria}
                        </p>
                      </div>
                    )}
                    
                    {/* Red Flags */}
                    {hasRedFlags && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Red Flags to Watch
                        </h4>
                        <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                          {diagnosis.red_flags?.map((flag, i) => (
                            <li key={i}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Guideline Source */}
                    {diagnosis.guideline_source && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Source: {diagnosis.guideline_source}
                      </p>
                    )}
                    
                    {/* Select Button */}
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => setSelectedDiagnosis(diagnosis.id)}
                      className={isSelected ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Selected as Primary Diagnosis
                        </>
                      ) : (
                        "Select as Primary Diagnosis"
                      )}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Continue Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {selectedDiagnosis 
            ? "Selected: " + diagnoses.find(d => d.id === selectedDiagnosis)?.diagnosis_name
            : "Select a diagnosis to continue"
          }
        </p>
        <Button
          onClick={handleContinue}
          disabled={!selectedDiagnosis}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
        >
          Generate Report
          <FileText className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}