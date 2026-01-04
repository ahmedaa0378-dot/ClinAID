"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { useAnalyzerAI, Symptom } from "@/hooks/useAnalyzerAI";

interface SymptomMindMapProps {
  regionName: string;
  regionDisplayName: string;
  onSymptomSelect: (symptom: Symptom) => void;
  onSymptomDeselect: (symptomId: string) => void;
  selectedSymptoms: string[];
  onContinue: () => void;
  useAI?: boolean; // Flag to enable/disable AI
}

// Fallback symptoms if AI fails
const getFallbackSymptoms = (regionName: string): Symptom[] => {
  const symptomMap: Record<string, Omit<Symptom, "position">[]> = {
    head_neck: [
      { id: "h1", name: "Headache", description: "Pain in head or scalp", isRedFlag: false },
      { id: "h2", name: "Dizziness", description: "Feeling lightheaded", isRedFlag: false },
      { id: "h3", name: "Vision Changes", description: "Blurred or double vision", isRedFlag: true },
      { id: "h4", name: "Neck Stiffness", description: "Difficulty moving neck", isRedFlag: true },
      { id: "h5", name: "Facial Pain", description: "Pain in face or jaw", isRedFlag: false },
      { id: "h6", name: "Ear Pain", description: "Pain in or around ear", isRedFlag: false },
      { id: "h7", name: "Sore Throat", description: "Pain when swallowing", isRedFlag: false },
      { id: "h8", name: "Nasal Congestion", description: "Blocked nose", isRedFlag: false },
    ],
    chest: [
      { id: "c1", name: "Chest Pain", description: "Pain or pressure in chest", isRedFlag: true },
      { id: "c2", name: "Shortness of Breath", description: "Difficulty breathing", isRedFlag: true },
      { id: "c3", name: "Palpitations", description: "Heart racing or skipping", isRedFlag: false },
      { id: "c4", name: "Cough", description: "Persistent cough", isRedFlag: false },
      { id: "c5", name: "Wheezing", description: "Whistling when breathing", isRedFlag: false },
      { id: "c6", name: "Chest Tightness", description: "Feeling of constriction", isRedFlag: false },
    ],
    abdomen: [
      { id: "a1", name: "Abdominal Pain", description: "Pain in belly area", isRedFlag: false },
      { id: "a2", name: "Nausea", description: "Feeling sick", isRedFlag: false },
      { id: "a3", name: "Vomiting", description: "Being sick", isRedFlag: false },
      { id: "a4", name: "Bloating", description: "Feeling full or swollen", isRedFlag: false },
      { id: "a5", name: "Diarrhea", description: "Loose stools", isRedFlag: false },
      { id: "a6", name: "Constipation", description: "Difficulty passing stools", isRedFlag: false },
      { id: "a7", name: "Blood in Stool", description: "Red or black stools", isRedFlag: true },
      { id: "a8", name: "Loss of Appetite", description: "No desire to eat", isRedFlag: false },
    ],
    pelvis: [
      { id: "p1", name: "Pelvic Pain", description: "Pain in lower abdomen", isRedFlag: false },
      { id: "p2", name: "Urinary Frequency", description: "Need to urinate often", isRedFlag: false },
      { id: "p3", name: "Painful Urination", description: "Burning when urinating", isRedFlag: false },
      { id: "p4", name: "Groin Pain", description: "Pain in groin area", isRedFlag: false },
      { id: "p5", name: "Hip Pain", description: "Pain in hip joint", isRedFlag: false },
    ],
    upper_extremity: [
      { id: "u1", name: "Arm Pain", description: "Pain in arm", isRedFlag: false },
      { id: "u2", name: "Shoulder Pain", description: "Pain in shoulder", isRedFlag: false },
      { id: "u3", name: "Numbness", description: "Loss of sensation", isRedFlag: false },
      { id: "u4", name: "Weakness", description: "Reduced strength", isRedFlag: true },
      { id: "u5", name: "Swelling", description: "Visible enlargement", isRedFlag: false },
      { id: "u6", name: "Joint Stiffness", description: "Difficulty moving", isRedFlag: false },
    ],
    lower_extremity: [
      { id: "l1", name: "Leg Pain", description: "Pain in leg", isRedFlag: false },
      { id: "l2", name: "Knee Pain", description: "Pain in knee", isRedFlag: false },
      { id: "l3", name: "Ankle Swelling", description: "Swollen ankles", isRedFlag: false },
      { id: "l4", name: "Numbness", description: "Loss of sensation", isRedFlag: false },
      { id: "l5", name: "Cramping", description: "Muscle cramps", isRedFlag: false },
      { id: "l6", name: "Difficulty Walking", description: "Problems with gait", isRedFlag: true },
    ],
  };

  return (symptomMap[regionName] || symptomMap.head_neck) as Symptom[];
};

export default function SymptomMindMap({
  regionName,
  regionDisplayName,
  onSymptomSelect,
  onSymptomDeselect,
  selectedSymptoms,
  onContinue,
  useAI = true,
}: SymptomMindMapProps) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [hoveredSymptom, setHoveredSymptom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchSymptoms, loading: aiLoading, error: aiError } = useAnalyzerAI();

  useEffect(() => {
    async function loadSymptoms() {
      setIsLoading(true);
      
      if (useAI) {
        try {
          const aiSymptoms = await fetchSymptoms(regionName, regionDisplayName);
          if (aiSymptoms && aiSymptoms.length > 0) {
            setSymptoms(aiSymptoms);
          } else {
            // Fallback to static symptoms
            setSymptoms(getFallbackSymptoms(regionName));
          }
        } catch (err) {
          console.error("AI symptoms failed, using fallback:", err);
          setSymptoms(getFallbackSymptoms(regionName));
        }
      } else {
        setSymptoms(getFallbackSymptoms(regionName));
      }
      
      setIsLoading(false);
    }

    loadSymptoms();
  }, [regionName, regionDisplayName, useAI]);

  // Calculate position based on angle and distance
  const getPosition = (index: number, total: number) => {
    const angle = (index * 360) / total;
    const distance = 140 + (index % 2) * 30;
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * distance,
      y: Math.sin(radian) * distance,
    };
  };

  const handleSymptomClick = (symptom: Symptom) => {
    if (selectedSymptoms.includes(symptom.id)) {
      onSymptomDeselect(symptom.id);
    } else {
      onSymptomSelect(symptom);
    }
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mx-auto" />
          <p className="mt-4 text-gray-600">
            {useAI ? "AI is generating symptoms..." : "Loading symptoms..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Center node - Region */}
      <motion.div
        className="absolute z-10 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg cursor-default"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="text-center text-white">
          <p className="font-bold text-sm">{regionDisplayName}</p>
          <p className="text-xs opacity-80 mt-1">
            {selectedSymptoms.length} selected
          </p>
        </div>
      </motion.div>

      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <g transform={`translate(${300}, ${300})`}>
          {symptoms.map((symptom, index) => {
            const pos = getPosition(index, symptoms.length);
            const isSelected = selectedSymptoms.includes(symptom.id);
            
            return (
              <motion.line
                key={`line-${symptom.id}`}
                x1="0"
                y1="0"
                x2={pos.x}
                y2={pos.y}
                stroke={isSelected ? "#10b981" : "#e5e7eb"}
                strokeWidth={isSelected ? 2 : 1}
                strokeDasharray={isSelected ? "0" : "4"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              />
            );
          })}
        </g>
      </svg>

      {/* Symptom nodes */}
      <AnimatePresence>
        {symptoms.map((symptom, index) => {
          const pos = getPosition(index, symptoms.length);
          const isSelected = selectedSymptoms.includes(symptom.id);
          const isHovered = hoveredSymptom === symptom.id;
          
          return (
            <motion.div
              key={symptom.id}
              className="absolute"
              style={{
                left: `calc(50% + ${pos.x}px - 50px)`,
                top: `calc(50% + ${pos.y}px - 25px)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                delay: index * 0.05 
              }}
            >
              <motion.button
                className={`
                  relative px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200 shadow-md min-w-[100px]
                  ${isSelected 
                    ? symptom.isRedFlag 
                      ? "bg-red-500 text-white shadow-red-200" 
                      : "bg-emerald-500 text-white shadow-emerald-200"
                    : isHovered
                      ? "bg-gray-100 text-gray-800 shadow-lg"
                      : "bg-white text-gray-700 border border-gray-200"
                  }
                `}
                onClick={() => handleSymptomClick(symptom)}
                onMouseEnter={() => setHoveredSymptom(symptom.id)}
                onMouseLeave={() => setHoveredSymptom(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center gap-1">
                  {isSelected && <Check className="h-3 w-3" />}
                  {symptom.isRedFlag && !isSelected && (
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                  )}
                  {symptom.name}
                </span>
                
                {/* Tooltip on hover */}
                <AnimatePresence>
                  {isHovered && !isSelected && (
                    <motion.div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-20 max-w-[200px] text-center"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                    >
                      <span className="whitespace-normal">{symptom.description}</span>
                      {symptom.isRedFlag && (
                        <span className="text-red-400 block mt-1">
                          ⚠️ Red Flag Symptom
                        </span>
                      )}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Continue button */}
      <AnimatePresence>
        {selectedSymptoms.length > 0 && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <button
              onClick={onContinue}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Continue with {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? "s" : ""} →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
        <p className="text-xs text-gray-500 mb-2">Click symptoms to select</p>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2 text-xs mt-1">
          <AlertTriangle className="h-3 w-3 text-red-500" />
          <span className="text-gray-600">Red Flag</span>
        </div>
        {useAI && (
          <div className="flex items-center gap-2 text-xs mt-2 pt-2 border-t">
            <span className="text-emerald-600">✨ AI Generated</span>
          </div>
        )}
      </div>
    </div>
  );
}