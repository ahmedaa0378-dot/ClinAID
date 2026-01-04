"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  CheckCircle2,
  AlertTriangle,
  FileText,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  type: "ai" | "user" | "system";
  content: string;
  options?: ChatOption[];
  selectedOption?: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatOption {
  id: string;
  text: string;
  subtext?: string;
}

interface Symptom {
  id: string;
  name: string;
  isRedFlag: boolean;
}

interface DiagnosisResult {
  name: string;
  probability: "high" | "moderate" | "low";
  confidence: number;
  description: string;
  supportingFindings: string[];
  redFlags?: string[];
}

interface AIChatInterfaceProps {
  regionName: string;
  symptoms: Symptom[];
  onComplete: (diagnosis: DiagnosisResult[]) => void;
}

// Sample questions flow
const questionFlow = [
  {
    id: "q1",
    question: "How long have you been experiencing these symptoms?",
    options: [
      { id: "q1_a", text: "Less than 24 hours", subtext: "Just started" },
      { id: "q1_b", text: "1-7 days", subtext: "About a week" },
      { id: "q1_c", text: "1-4 weeks", subtext: "A few weeks" },
      { id: "q1_d", text: "More than a month", subtext: "Ongoing" },
    ],
  },
  {
    id: "q2",
    question: "How would you rate the severity?",
    options: [
      { id: "q2_a", text: "Mild", subtext: "Noticeable but not limiting" },
      { id: "q2_b", text: "Moderate", subtext: "Affecting daily activities" },
      { id: "q2_c", text: "Severe", subtext: "Significantly limiting" },
      { id: "q2_d", text: "Very Severe", subtext: "Unable to function normally" },
    ],
  },
  {
    id: "q3",
    question: "Is the symptom constant or intermittent?",
    options: [
      { id: "q3_a", text: "Constant", subtext: "Always present" },
      { id: "q3_b", text: "Intermittent", subtext: "Comes and goes" },
      { id: "q3_c", text: "Episodes", subtext: "Distinct attacks" },
      { id: "q3_d", text: "Progressive", subtext: "Getting worse" },
    ],
  },
  {
    id: "q4",
    question: "Are there any factors that make it better or worse?",
    options: [
      { id: "q4_a", text: "Movement/activity", subtext: "Physical exertion" },
      { id: "q4_b", text: "Rest/lying down", subtext: "When relaxing" },
      { id: "q4_c", text: "Eating/drinking", subtext: "Related to meals" },
      { id: "q4_d", text: "No clear pattern", subtext: "Unpredictable" },
    ],
  },
  {
    id: "q5",
    question: "Do you have any other associated symptoms?",
    options: [
      { id: "q5_a", text: "Fever or chills", subtext: "Temperature changes" },
      { id: "q5_b", text: "Fatigue", subtext: "Feeling tired" },
      { id: "q5_c", text: "Nausea", subtext: "Feeling sick" },
      { id: "q5_d", text: "None of the above", subtext: "Just the main symptoms" },
    ],
  },
];

export default function AIChatInterface({
  regionName,
  symptoms,
  onComplete,
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize chat
  useEffect(() => {
    const initChat = async () => {
      // Welcome message
      await addAIMessage(
        `Hello! I'm your AI clinical assistant. I see you're experiencing symptoms in the **${regionName}** region.`,
        500
      );
      
      // Symptoms summary
      const symptomList = symptoms.map(s => s.name).join(", ");
      const hasRedFlags = symptoms.some(s => s.isRedFlag);
      
      await addAIMessage(
        `You've reported: **${symptomList}**${hasRedFlags ? "\n\n⚠️ *Some of these are red flag symptoms that may require urgent attention.*" : ""}`,
        1000
      );
      
      // Start questions
      await addAIMessage(
        "Let me ask you a few questions to better understand your condition.",
        800
      );
      
      askNextQuestion();
    };

    initChat();
  }, []);

  const addAIMessage = (content: string, delay: number = 500): Promise<void> => {
    return new Promise((resolve) => {
      setIsTyping(true);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            type: "ai",
            content,
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
        resolve();
      }, delay);
    });
  };

  const askNextQuestion = async () => {
    if (currentQuestionIndex >= questionFlow.length) {
      // All questions answered - generate diagnosis
      await generateDiagnosis();
      return;
    }

    const question = questionFlow[currentQuestionIndex];
    
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 800));
    
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        type: "ai",
        content: question.question,
        options: question.options,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
  };

  const handleOptionSelect = async (questionId: string, option: ChatOption) => {
    // Add user response
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        type: "user",
        content: option.text,
        timestamp: new Date(),
      },
    ]);

    // Update last AI message to mark selected option
    setMessages((prev) =>
      prev.map((msg) =>
        msg.options?.some((o) => o.id === option.id)
          ? { ...msg, selectedOption: option.id }
          : msg
      )
    );

    // Save answer
    setAnswers((prev) => ({ ...prev, [questionId]: option.id }));

    // Brief acknowledgment
    const acknowledgments = [
      "Got it.",
      "I understand.",
      "Thank you for that information.",
      "Noted.",
      "Okay, that helps.",
    ];
    const ack = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
    
    await addAIMessage(ack, 400);

    // Move to next question
    setCurrentQuestionIndex((prev) => prev + 1);
    
    setTimeout(() => {
      askNextQuestion();
    }, 500);
  };

  const generateDiagnosis = async () => {
    await addAIMessage(
      "Thank you for answering all my questions. Let me analyze this information...",
      500
    );
    
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsTyping(false);

    // Sample diagnoses based on region
    const diagnoses: DiagnosisResult[] = [
      {
        name: "Tension-Type Headache",
        probability: "high",
        confidence: 0.85,
        description: "Most common primary headache disorder characterized by bilateral pressing pain.",
        supportingFindings: ["Bilateral location", "Pressing quality", "Mild to moderate intensity"],
        redFlags: [],
      },
      {
        name: "Migraine",
        probability: "moderate",
        confidence: 0.65,
        description: "Recurrent headache disorder with attacks lasting 4-72 hours.",
        supportingFindings: ["Pulsating quality possible", "Associated symptoms"],
        redFlags: ["Sudden onset", "Worst headache of life"],
      },
      {
        name: "Cervicogenic Headache",
        probability: "low",
        confidence: 0.35,
        description: "Secondary headache caused by cervical spine disorder.",
        supportingFindings: ["Neck involvement"],
        redFlags: [],
      },
    ];

    // Show diagnosis message
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        type: "system",
        content: "DIAGNOSIS_READY",
        timestamp: new Date(),
      },
    ]);

    setShowDiagnosis(true);
    onComplete(diagnoses);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">AI Clinical Assistant</h3>
          <p className="text-emerald-100 text-sm">
            {isTyping ? "Typing..." : "Online"}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge className="bg-white/20 text-white border-0">
            {symptoms.length} symptoms
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "system" && message.content === "DIAGNOSIS_READY" ? (
                <div className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-medium text-emerald-800">Analysis Complete!</p>
                  <p className="text-sm text-emerald-600">
                    Differential diagnoses have been generated based on your responses.
                  </p>
                </div>
              ) : (
                <div
                  className={`max-w-[80%] ${
                    message.type === "user"
                      ? "bg-emerald-500 text-white rounded-2xl rounded-tr-sm"
                      : "bg-white border border-gray-200 rounded-2xl rounded-tl-sm"
                  } px-4 py-3 shadow-sm`}
                >
                  {/* Avatar */}
                  <div className="flex items-start gap-2">
                    {message.type === "ai" && (
                      <Bot className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          message.type === "user" ? "text-white" : "text-gray-800"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\*(.*?)\*/g, "<em>$1</em>")
                            .replace(/\n/g, "<br />"),
                        }}
                      />
                      
                      {/* Options */}
                      {message.options && !message.selectedOption && (
                        <div className="mt-3 space-y-2">
                          {message.options.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => handleOptionSelect(message.id, option)}
                              className="w-full p-3 text-left bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl transition-all group"
                            >
                              <p className="font-medium text-gray-800 group-hover:text-emerald-700">
                                {option.text}
                              </p>
                              {option.subtext && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {option.subtext}
                                </p>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Selected option indicator */}
                      {message.selectedOption && (
                        <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Answered
                        </div>
                      )}
                    </div>
                    {message.type === "user" && (
                      <User className="h-5 w-5 text-emerald-100 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500"
          >
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-emerald-500" />
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Progress indicator */}
      <div className="px-4 py-2 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {showDiagnosis 
              ? "Analysis complete" 
              : `Question ${Math.min(currentQuestionIndex + 1, questionFlow.length)} of ${questionFlow.length}`
            }
          </span>
          <div className="flex gap-1">
            {questionFlow.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < currentQuestionIndex
                    ? "bg-emerald-500"
                    : i === currentQuestionIndex
                    ? "bg-emerald-300"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
