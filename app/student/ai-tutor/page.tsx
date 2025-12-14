"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Paperclip,
  Mic,
  MoreVertical,
  BookOpen,
  Lightbulb,
  HelpCircle,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
} from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  { icon: BookOpen, text: "Explain the cardiac cycle in simple terms" },
  { icon: Lightbulb, text: "What are the key symptoms of heart failure?" },
  { icon: HelpCircle, text: "Help me understand ECG interpretation" },
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your AI Medical Tutor. I'm here to help you understand complex medical concepts, answer your questions, and guide your learning journey. I have access to your course materials and can provide explanations tailored to your level.\n\nWhat would you like to learn about today?",
    timestamp: new Date(),
  },
];

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: generateMockResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("cardiac cycle") || lowerQuestion.includes("heart cycle")) {
      return "The cardiac cycle refers to the sequence of events that occur during one complete heartbeat. It consists of two main phases:\n\n**1. Diastole (Relaxation Phase)**\n- The heart muscle relaxes\n- The atria and ventricles fill with blood\n- The AV valves (tricuspid and mitral) are open\n- The semilunar valves are closed\n\n**2. Systole (Contraction Phase)**\n- The heart muscle contracts\n- Blood is ejected from the ventricles\n- The AV valves close (producing the 'lub' sound)\n- The semilunar valves open\n\nThe average cardiac cycle lasts about 0.8 seconds at a resting heart rate of 75 beats per minute.\n\nWould you like me to explain any part in more detail?";
    }
    
    if (lowerQuestion.includes("ecg") || lowerQuestion.includes("electrocardiogram")) {
      return "ECG (Electrocardiogram) interpretation involves analyzing the electrical activity of the heart. Here are the key components:\n\n**P Wave** - Atrial depolarization\n**PR Interval** - Time from atrial to ventricular depolarization (0.12-0.20s)\n**QRS Complex** - Ventricular depolarization (0.06-0.10s)\n**T Wave** - Ventricular repolarization\n**QT Interval** - Total ventricular activity\n\n**Normal Sinus Rhythm Criteria:**\n- Rate: 60-100 bpm\n- Regular rhythm\n- P wave before each QRS\n- Consistent PR interval\n\nWould you like me to explain any specific rhythm or abnormality?";
    }
    
    if (lowerQuestion.includes("heart failure")) {
      return "Heart failure occurs when the heart cannot pump blood effectively to meet the body's needs. Key symptoms include:\n\n**Left-Sided Heart Failure:**\n- Dyspnea (shortness of breath)\n- Orthopnea (difficulty breathing when lying flat)\n- Paroxysmal nocturnal dyspnea\n- Fatigue and weakness\n- Pulmonary congestion\n\n**Right-Sided Heart Failure:**\n- Peripheral edema (swelling in legs/ankles)\n- Jugular venous distension (JVD)\n- Hepatomegaly (enlarged liver)\n- Ascites (fluid in abdomen)\n\n**Common Causes:**\n- Coronary artery disease\n- Hypertension\n- Valvular heart disease\n- Cardiomyopathy\n\nWould you like to learn about the treatment approaches?";
    }
    
    return "That's a great question! Based on your course materials, I can help you understand this concept better.\n\nTo provide you with the most accurate and relevant information, I'm analyzing the content from your enrolled courses. This topic relates to several key areas in your medical curriculum.\n\nCould you provide a bit more context about which specific aspect you'd like me to focus on? For example:\n- Are you preparing for an exam?\n- Do you need a clinical perspective?\n- Would you like practice questions on this topic?";
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Tutor</h1>
          <p className="text-gray-500 text-sm">Ask questions about your courses and get instant help</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "assistant"
                    ? "bg-emerald-100"
                    : "bg-blue-100"
                }`}
              >
                {message.role === "assistant" ? (
                  <Bot className="h-5 w-5 text-emerald-600" />
                ) : (
                  <span className="text-blue-600 text-sm font-medium">JD</span>
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex flex-col max-w-[80%] ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === "assistant"
                      ? "bg-gray-100 text-gray-800 rounded-tl-none"
                      : "bg-emerald-600 text-white rounded-tr-none"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                </div>

                {/* Message Actions (for AI messages) */}
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      {copiedId === message.id ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <ThumbsUp className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <ThumbsDown className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                )}

                <span className="text-xs text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Bot className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions (show only if no user messages) */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-500 mb-3">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, index) => {
                const Icon = q.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(q.text)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-emerald-600" />
                    {q.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-end gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Paperclip className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your courses..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Mic className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`p-3 rounded-xl transition-colors ${
                inputValue.trim()
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            AI Tutor uses your course materials to provide accurate, relevant answers
          </p>
        </div>
      </div>
    </div>
  );
}