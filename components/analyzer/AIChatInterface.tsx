"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Loader2, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAnalyzerAI, Question, DiagnosisResponse } from "@/hooks/useAnalyzerAI";

interface Message {
  id: string;
  type: "ai" | "user" | "system";
  content: string;
  options?: ChatOption[];
  selectedOption?: string;
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
  onComplete: (diagnoses: DiagnosisResult[]) => void;
}

// Fallback questions if AI fails
const getFallbackQuestions = (): Question[] => [
  {
    id: "q1",
    question: "How long have you been experiencing these symptoms?",
    clinicalRationale: "Duration helps differentiate acute from chronic conditions.",
    options: [
      { id: "q1_a", text: "Less than 24 hours", clinicalSignificance: "Acute onset" },
      { id: "q1_b", text: "1-7 days", clinicalSignificance: "Subacute" },
      { id: "q1_c", text: "1-4 weeks", clinicalSignificance: "Prolonged" },
      { id: "q1_d", text: "More than a month", clinicalSignificance: "Chronic" },
    ],
  },
  {
    id: "q2",
    question: "How would you rate the severity?",
    clinicalRationale: "Severity guides urgency of evaluation.",
    options: [
      { id: "q2_a", text: "Mild - not limiting activities", clinicalSignificance: "Low acuity" },
      { id: "q2_b", text: "Moderate - affecting daily activities", clinicalSignificance: "Moderate acuity" },
      { id: "q2_c", text: "Severe - significantly limiting", clinicalSignificance: "High acuity" },
      { id: "q2_d", text: "Very severe - unable to function", clinicalSignificance: "Urgent" },
    ],
  },
  {
    id: "q3",
    question: "Is the symptom constant or intermittent?",
    clinicalRationale: "Pattern indicates underlying pathophysiology.",
    options: [
      { id: "q3_a", text: "Constant - always present", clinicalSignificance: "Continuous process" },
      { id: "q3_b", text: "Intermittent - comes and goes", clinicalSignificance: "Episodic" },
      { id: "q3_c", text: "Progressive - getting worse", clinicalSignificance: "Evolving" },
      { id: "q3_d", text: "Variable - no clear pattern", clinicalSignificance: "Unpredictable" },
    ],
  },
  {
    id: "q4",
    question: "What makes it better or worse?",
    clinicalRationale: "Aggravating/alleviating factors provide diagnostic clues.",
    options: [
      { id: "q4_a", text: "Movement or activity", clinicalSignificance: "Musculoskeletal" },
      { id: "q4_b", text: "Rest or lying down", clinicalSignificance: "Positional" },
      { id: "q4_c", text: "Eating or drinking", clinicalSignificance: "GI related" },
      { id: "q4_d", text: "No clear pattern", clinicalSignificance: "Non-specific" },
    ],
  },
  {
    id: "q5",
    question: "Any associated symptoms?",
    clinicalRationale: "Associated symptoms help narrow differential.",
    options: [
      { id: "q5_a", text: "Fever or chills", clinicalSignificance: "Infectious/inflammatory" },
      { id: "q5_b", text: "Fatigue or weakness", clinicalSignificance: "Systemic" },
      { id: "q5_c", text: "Nausea or appetite changes", clinicalSignificance: "GI involvement" },
      { id: "q5_d", text: "None", clinicalSignificance: "Isolated symptom" },
    ],
  },
];

// Fallback diagnoses
const getFallbackDiagnoses = (regionName: string, symptoms: Symptom[]): DiagnosisResult[] => {
  const hasRedFlags = symptoms.some(s => s.isRedFlag);
  return [
    {
      name: "Primary Assessment Needed",
      probability: hasRedFlags ? "high" : "moderate",
      confidence: 0.7,
      description: "Based on the symptoms reported, further clinical evaluation is recommended.",
      supportingFindings: symptoms.map(s => s.name),
      redFlags: symptoms.filter(s => s.isRedFlag).map(s => s.name),
    },
    {
      name: "Common Condition",
      probability: "moderate",
      confidence: 0.5,
      description: "Symptoms may indicate a common condition that responds well to treatment.",
      supportingFindings: symptoms.slice(0, 2).map(s => s.name),
    },
    {
      name: "Alternative Diagnosis",
      probability: "low",
      confidence: 0.3,
      description: "Less likely but should be considered if primary assessment is negative.",
      supportingFindings: [symptoms[0]?.name || "Reported symptoms"],
    },
  ];
};

export default function AIChatInterface({
  regionName,
  symptoms,
  onComplete,
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [initComplete, setInitComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { fetchQuestions, fetchDiagnosis } = useAnalyzerAI();

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize chat
  useEffect(() => {
    if (initComplete) return;

    const initChat = async () => {
      // Welcome message
      await addAIMessage(
        `Hello! I'm your AI clinical assistant. I see you're experiencing symptoms in the **${regionName}** region.`
      );

      // Symptoms summary
      const symptomList = symptoms.map(s => s.name).join(", ");
      const hasRedFlags = symptoms.some(s => s.isRedFlag);

      await addAIMessage(
        `You've reported: **${symptomList}**${hasRedFlags ? "\n\n⚠️ *Some of these are red flag symptoms.*" : ""}`
      );

      // Fetch AI questions
      setIsTyping(true);
      
      try {
        const aiQuestions = await fetchQuestions(regionName, symptoms);

        if (aiQuestions && aiQuestions.length > 0) {
          setQuestions(aiQuestions);
          setIsAIGenerated(true);
          setIsTyping(false);
          await addAIMessage("✨ I've generated clinical questions based on your symptoms.");
          askQuestion(aiQuestions[0]);
        } else {
          throw new Error("No questions returned");
        }
      } catch (err) {
        console.error("AI questions failed:", err);
        const fallback = getFallbackQuestions();
        setQuestions(fallback);
        setIsAIGenerated(false);
        setIsTyping(false);
        await addAIMessage("Let me ask you some questions to narrow down the diagnosis.");
        askQuestion(fallback[0]);
      }

      setInitComplete(true);
    };

    initChat();
  }, []);

  const addAIMessage = (content: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: `msg-${Date.now()}`, type: "ai", content, },
        ]);
        setIsTyping(false);
        resolve();
      }, 500);
    });
  };

  const askQuestion = async (question: Question) => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 400));

    setMessages((prev) => [
      ...prev,
      {
        id: question.id,
        type: "ai",
        content: question.question,
        options: question.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          subtext: opt.clinicalSignificance,
        })),
      },
    ]);
    setIsTyping(false);
  };

  const handleOptionSelect = async (questionId: string, option: ChatOption) => {
    // Add user response
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: "user", content: option.text },
    ]);

    // Mark answered
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === questionId ? { ...msg, selectedOption: option.id } : msg
      )
    );

    // Save answer
    const newAnswers = { ...answers, [questionId]: option.text };
    setAnswers(newAnswers);

    // Acknowledgment
    const acks = ["Got it.", "I understand.", "Thank you.", "Noted."];
    await addAIMessage(acks[Math.floor(Math.random() * acks.length)]);

    // Next question or diagnosis
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => askQuestion(questions[nextIndex]), 300);
    } else {
      await generateDiagnosis(newAnswers);
    }
  };

  const generateDiagnosis = async (finalAnswers: Record<string, string>) => {
    await addAIMessage("Analyzing your responses with AI...");
    setIsTyping(true);

    try {
      const result = await fetchDiagnosis(regionName, symptoms, finalAnswers);

      setIsTyping(false);

      if (result && result.diagnoses && result.diagnoses.length > 0) {
        setMessages((prev) => [
          ...prev,
          { id: `system-${Date.now()}`, type: "system", content: "DIAGNOSIS_READY" },
        ]);

        if (result.clinicalPearl) {
          await addAIMessage(`💡 **Clinical Pearl:** ${result.clinicalPearl}`);
        }

        // Convert to expected format
        const diagnoses: DiagnosisResult[] = result.diagnoses.map((d) => ({
          name: d.name,
          probability: d.probability,
          confidence: d.confidence,
          description: d.description,
          supportingFindings: d.supportingFindings || [],
          redFlags: d.redFlags || [],
        }));

        onComplete(diagnoses);
      } else {
        throw new Error("No diagnoses returned");
      }
    } catch (err) {
      console.error("Diagnosis failed:", err);
      setIsTyping(false);
      await addAIMessage("Using fallback analysis...");
      
      const fallback = getFallbackDiagnoses(regionName, symptoms);
      setMessages((prev) => [
        ...prev,
        { id: `system-${Date.now()}`, type: "system", content: "DIAGNOSIS_READY" },
      ]);
      onComplete(fallback);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white flex items-center gap-2">
            AI Clinical Assistant
            {isAIGenerated && <Sparkles className="h-4 w-4" />}
          </h3>
          <p className="text-emerald-100 text-sm">
            {isTyping ? "Thinking..." : "Powered by OpenAI"}
          </p>
        </div>
        <Badge className="ml-auto bg-white/20 text-white border-0">
          {symptoms.length} symptoms
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "system" && message.content === "DIAGNOSIS_READY" ? (
                <div className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-medium text-emerald-800">AI Analysis Complete!</p>
                </div>
              ) : (
                <div
                  className={`max-w-[80%] ${
                    message.type === "user"
                      ? "bg-emerald-500 text-white rounded-2xl rounded-tr-sm"
                      : "bg-white border border-gray-200 rounded-2xl rounded-tl-sm"
                  } px-4 py-3 shadow-sm`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === "ai" && (
                      <Bot className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm ${message.type === "user" ? "text-white" : "text-gray-800"}`}
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
                              className="w-full p-3 text-left bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl transition-all"
                            >
                              <p className="font-medium text-gray-800">{option.text}</p>
                              {option.subtext && (
                                <p className="text-xs text-gray-500 mt-0.5">{option.subtext}</p>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex">
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

      {/* Progress */}
      <div className="px-4 py-2 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {questions.length > 0
              ? `Question ${Math.min(currentQuestionIndex + 1, questions.length)} of ${questions.length}`
              : "Initializing..."}
          </span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
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