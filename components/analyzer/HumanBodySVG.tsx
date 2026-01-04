"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BodyRegion {
  id: string;
  name: string;
  displayName: string;
  pathD: string;
  labelPosition: { x: number; y: number };
}

interface HumanBodySVGProps {
  onRegionClick: (regionId: string, regionName: string) => void;
  selectedRegion: string | null;
  highlightedRegions?: string[];
}

// SVG paths for human body regions
const bodyRegions: BodyRegion[] = [
  {
    id: "head",
    name: "head_neck",
    displayName: "Head & Neck",
    pathD: "M200,30 C230,30 250,50 250,80 L250,120 C250,135 235,150 200,150 C165,150 150,135 150,120 L150,80 C150,50 170,30 200,30 Z",
    labelPosition: { x: 200, y: 90 },
  },
  {
    id: "chest",
    name: "chest",
    displayName: "Chest",
    pathD: "M140,155 L260,155 L280,180 L280,280 L120,280 L120,180 Z",
    labelPosition: { x: 200, y: 220 },
  },
  {
    id: "abdomen",
    name: "abdomen",
    displayName: "Abdomen",
    pathD: "M120,285 L280,285 L270,380 L130,380 Z",
    labelPosition: { x: 200, y: 335 },
  },
  {
    id: "pelvis",
    name: "pelvis",
    displayName: "Pelvis",
    pathD: "M130,385 L270,385 L250,440 L150,440 Z",
    labelPosition: { x: 200, y: 415 },
  },
  {
    id: "left_arm",
    name: "upper_extremity",
    displayName: "Left Arm",
    pathD: "M115,160 L80,160 L50,200 L30,320 L50,325 L70,210 L100,180 L115,280 Z",
    labelPosition: { x: 65, y: 240 },
  },
  {
    id: "right_arm",
    name: "upper_extremity",
    displayName: "Right Arm",
    pathD: "M285,160 L320,160 L350,200 L370,320 L350,325 L330,210 L300,180 L285,280 Z",
    labelPosition: { x: 335, y: 240 },
  },
  {
    id: "left_leg",
    name: "lower_extremity",
    displayName: "Left Leg",
    pathD: "M150,445 L195,445 L190,550 L185,650 L175,750 L140,750 L150,650 L155,550 Z",
    labelPosition: { x: 165, y: 600 },
  },
  {
    id: "right_leg",
    name: "lower_extremity",
    displayName: "Right Leg",
    pathD: "M205,445 L250,445 L245,550 L250,650 L260,750 L225,750 L215,650 L210,550 Z",
    labelPosition: { x: 235, y: 600 },
  },
];

export default function HumanBodySVG({ 
  onRegionClick, 
  selectedRegion,
  highlightedRegions = [] 
}: HumanBodySVGProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getRegionColor = (region: BodyRegion) => {
    if (selectedRegion === region.name) {
      return "#10b981"; // emerald-500
    }
    if (hoveredRegion === region.id) {
      return "#34d399"; // emerald-400
    }
    if (highlightedRegions.includes(region.name)) {
      return "#6ee7b7"; // emerald-300
    }
    return "#e5e7eb"; // gray-200
  };

  const getStrokeColor = (region: BodyRegion) => {
    if (selectedRegion === region.name || hoveredRegion === region.id) {
      return "#059669"; // emerald-600
    }
    return "#9ca3af"; // gray-400
  };

  return (
    <div className="relative">
      <svg
        viewBox="0 0 400 800"
        className="w-full max-w-md mx-auto"
        style={{ height: "600px" }}
      >
        {/* Background glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="100%" stopColor="#dcfce7" />
          </linearGradient>
        </defs>

        {/* Body outline shadow */}
        <g transform="translate(2, 2)" opacity="0.1">
          {bodyRegions.map((region) => (
            <path key={`shadow-${region.id}`} d={region.pathD} fill="#000" />
          ))}
        </g>

        {/* Body regions */}
        {bodyRegions.map((region) => (
          <g key={region.id}>
            <motion.path
              d={region.pathD}
              fill={getRegionColor(region)}
              stroke={getStrokeColor(region)}
              strokeWidth={selectedRegion === region.name ? 3 : 2}
              className="cursor-pointer transition-colors"
              onClick={() => onRegionClick(region.name, region.displayName)}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              filter={selectedRegion === region.name ? "url(#glow)" : "none"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: bodyRegions.indexOf(region) * 0.05 }}
            />
            
            {/* Region label on hover */}
            <AnimatePresence>
              {(hoveredRegion === region.id || selectedRegion === region.name) && (
                <motion.g
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <rect
                    x={region.labelPosition.x - 45}
                    y={region.labelPosition.y - 12}
                    width="90"
                    height="24"
                    rx="12"
                    fill={selectedRegion === region.name ? "#059669" : "#374151"}
                    opacity="0.9"
                  />
                  <text
                    x={region.labelPosition.x}
                    y={region.labelPosition.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="500"
                  >
                    {region.displayName}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        ))}

        {/* Pulse animation for selected region */}
        {selectedRegion && (
          <motion.circle
            cx="200"
            cy="400"
            r="180"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </svg>

      {/* Instructions */}
      <div className="text-center mt-4">
        <p className="text-gray-500 text-sm">
          {selectedRegion 
            ? "Click another region or continue with symptoms" 
            : "Click on a body part to select it"}
        </p>
      </div>
    </div>
  );
}
