// src/components/ChatInterface.tsx
import React, { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import Groq from "groq-sdk/index.mjs";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions.mjs";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import {
  SendHorizontal,
  RotateCcw,
  AlertTriangle,
  Zap,
  Github,
  Globe,
  Cpu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

// --- PASTE YOUR FULL SYSTEM PROMPT HERE ---
const ADIB_SYSTEM_PROMPT = ``;
// --- END OF SYSTEM PROMPT ---

const PORTFOLIO_URL = "https://rajinkhan.com";
const GITHUB_URL = "https://github.com/rajin-khan";

let groq: Groq | null = null;
let apiKeyError: string | null = null;

if (!groqApiKey) {
  apiKeyError = "Groq API key not configured. Please set VITE_GROQ_API_KEY.";
  console.error(apiKeyError);
} else {
  groq = new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true });
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  isError?: boolean;
}
const MAX_HISTORY_LENGTH = 12;
const INITIAL_AI_MESSAGE =
  "I'm ARIA, Rajin Khan's AI assistant. How can I help you learn more about him, his projects, or skills today?";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "initial-ai-" + Date.now(), text: INITIAL_AI_MESSAGE, sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(apiKeyError);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleResetChat = () => {
    setMessages([
      {
        id: "initial-ai-" + Date.now(),
        text: INITIAL_AI_MESSAGE,
        sender: "ai",
      },
    ]);
    setCurrentError(apiKeyError);
    setIsLoading(false);
    setShowSuggestions(true);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    setShowSuggestions(false);
    setTimeout(() => handleSubmit(), 100);
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || !groq) {
      if (!groq && !apiKeyError)
        setCurrentError(
          "Groq client not initialized. API key might be missing."
        );
      return;
    }

    // Hide suggestions after first user message
    if (messages.length === 1) {
      setShowSuggestions(false);
    }

    const userInput: Message = {
      id: "user-" + Date.now(),
      text: trimmedInput,
      sender: "user",
    };
    setMessages((prev) => [...prev, userInput]);
    setInput("");
    setIsLoading(true);
    setCurrentError(null);

    const conversationHistory: ChatCompletionMessageParam[] = messages
      .filter((msg) => !msg.isError)
      .slice(-MAX_HISTORY_LENGTH)
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));
    conversationHistory.push({ role: "user", content: userInput.text });

    const aiResponseId = "ai-" + Date.now();
    setMessages((prev) => [
      ...prev,
      { id: aiResponseId, text: "", sender: "ai" },
    ]);

    try {
      const stream = await groq.chat.completions.create({
        messages: [
          { role: "system", content: ADIB_SYSTEM_PROMPT },
          ...conversationHistory,
        ],
        model: "llama-3.3-70b-versatile",
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      });

      let currentAiText = "";
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || "";
        if (delta) {
          currentAiText += delta;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiResponseId ? { ...msg, text: currentAiText } : msg
            )
          );
        }
      }
    } catch (err: any) {
      console.error("Error fetching from Groq:", err);
      const errorMessage = err.message || "An error occurred.";
      setCurrentError(errorMessage);
      setMessages((prev) => prev.filter((msg) => msg.id !== aiResponseId));
      setMessages((prev) => [
        ...prev,
        {
          id: "error-" + Date.now(),
          text: `Oops! ${errorMessage}`,
          sender: "ai",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      // Small delay to ensure DOM updates before focusing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  if (apiKeyError && !groq) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center space-y-4 md:space-y-6 animate-slide-in-up">
          <div className="relative">
            <AlertTriangle
              size={48}
              className="md:w-16 md:h-16 text-red-400 mx-auto animate-breathe"
            />
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse"></div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-xl md:text-2xl font-bold gradient-text">
              Configuration Error
            </h2>
            <p className="text-gray-400 max-w-md text-sm md:text-base">{apiKeyError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col text-sm md:text-base">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-purple-500/20 bg-black/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Cpu size={16} className="md:w-5 md:h-5 text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 blur-lg opacity-50 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold gradient-text">A.R.I.A.</h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Rajin's Advanced Responsive Intelligence Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 glow-border"
            title="Portfolio"
          >
            <Globe size={16} className="md:w-[18px] md:h-[18px]" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 glow-border"
            title="GitHub"
          >
            <Github size={16} className="md:w-[18px] md:h-[18px]" />
          </a>
          <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            {isLoading && (
              <Zap size={10} className="md:w-3 md:h-3 text-purple-400 animate-pulse" />
            )}
            <span className="text-xs font-medium text-purple-300">
              {isLoading ? "THINKING" : "ONLINE"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-black/30"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#8b5cf6 transparent",
        }}
      >
        {messages.map((msg, index) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            sender={msg.sender}
            isError={msg.isError}
            isStreaming={
              isLoading &&
              msg.sender === "ai" &&
              index === messages.length - 1 &&
              msg.text.length > 0 &&
              !msg.isError
            }
            isFinalAiMessage={index === messages.length - 1}
          />
        ))}

        {isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1]?.sender === "user" && (
            <TypingIndicator />
          )}
      </div>

      {/* Error Display */}
      {currentError && !apiKeyError && (
        <div className="p-4 md:p-4 mx-4 md:mx-6 mb-4">
          <div className="p-3 md:p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="md:w-5 md:h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{currentError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 md:p-6 border-t border-purple-500/20 bg-black/50 backdrop-blur-xl">
        {/* Collapsible Placeholder Questions */}
        <div className="mb-4 md:mb-6">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center justify-center gap-2 w-full p-2 md:p-3 text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-white/5"
          >
            <span>Try asking about:</span>
            {showSuggestions ? (
              <ChevronUp size={16} className="md:w-[18px] md:h-[18px] transition-transform duration-300" />
            ) : (
              <ChevronDown size={16} className="md:w-[18px] md:h-[18px] transition-transform duration-300" />
            )}
          </button>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showSuggestions 
              ? 'max-h-96 opacity-100 mt-3 md:mt-4' 
              : 'max-h-0 opacity-0 mt-0'
          }`}>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Who is Rajin Khan?",
                "What projects has he worked on?",
                "What are his technical skills?",
                "Tell me about his experience",
                "What's his educational background?",
                "Show me his portfolio",
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className="px-2.5 md:px-3 py-1.5 md:py-2 text-xs bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded-full text-purple-300 hover:text-purple-200 transition-all duration-200 hover:scale-105 transform"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: showSuggestions ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={handleResetChat}
            className="p-2.5 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 glow-border group"
            title="Reset Chat"
          >
            <RotateCcw
              size={16}
              className="md:w-[18px] md:h-[18px] group-hover:rotate-180 transition-transform duration-500"
            />
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isLoading
                  ? "ARIA is thinking..."
                  : "Ask ARIA anything about Rajin Khan..."
              }
              disabled={isLoading || !groq}
              className="w-full p-3 md:p-4 bg-black/40 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:bg-black/60 transition-all duration-200 disabled:opacity-50 glow-border text-sm md:text-base"
            />
            {isLoading && (
              <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim() || !groq}
            className="p-2.5 md:p-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed glow-border group animate-shimmer"
          >
            <SendHorizontal
              size={16}
              className="md:w-[18px] md:h-[18px] group-hover:translate-x-1 transition-transform duration-200"
            />
          </button>
        </form>

        <div className="text-center mt-2 md:mt-3">
          <p className="text-xs text-gray-600">
            A.R.I.A. Project in Progress • Chat history is limited for optimal
            performance
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;