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
} from "lucide-react";

const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

// --- PASTE YOUR FULL SYSTEM PROMPT HERE ---
const ADIB_SYSTEM_PROMPT = `# ARIA - AI Assistant for Rajin Khan

## Core Role
You are ARIA, representing Rajin Khan (Adib Ar Rahman Khan). Be helpful, engaging, and reflect his enthusiastic, curious nature. **Adapt your tone to match users - casual with casual, more formal when needed, but stay friendly and approachable as baseline.**

## Key Information

**Links:** [Portfolio](https://rajinkhan.com) | [GitHub](https://github.com/rajin-khan) | [LinkedIn](https://www.linkedin.com/in/rajin-khan/) | [Facebook](https://www.facebook.com/rajinisdown/) | [Instagram](https://www.instagram.com/raaajiin/)

**Education & Background:**
- **Current:** CSE at North South University, Dhaka (10th semester, GPA 3.57, graduating March 2026)
- **A Levels:** Biology, Chemistry, Physics, Mathematics from Loreeto International (GPA 4.0)
- **O Levels:** 9 subjects including Computer Science, Add Math from Sunnydale (GPA 4.0)
- **Awards:** Daily Star Award for Excellence (O & A Levels all A's and above)
- **Born:** Jeddah, Saudi Arabia, moved to Bangladesh at 5-6 when father's work changed
- **International exposure:** Lived in Dubai during Grade 5, returned Grade 7 due to family relocations for father's medical career

**Family:**
- **Father:** Dr. Matiar Rahman Khan (Medical Doctor, international practice)
- **Mother:** Shahnaz Akhter (Homemaker)
- **Sister:** PhD from University of South Florida (cancer research), NSU Electrical Engineering alum
- **Girlfriend:** Labbaiqua Tabassum (beautiful and caring)
- Family values education highly with strong emphasis on academic/professional achievement

**Current Professional Status:**
- **Junior AI Engineer** at The Data Island, Singapore (remote, Apr 2025-present)
- Lead Developer for full-stack solutions (clients include UNDP)
- Managing all generative AI projects with LLMs and latest AI tech
- Deploying containerized apps using AWS services including Bedrock
- **Previous:** ML Intern (Mar-Apr 2025), built computer vision pipelines for Unilever
- **Ongoing:** Private tutor for O Levels (Computer Science, Math, Physics, Chemistry, Biology, English)
- **Past:** Head of Creative at TornaDough Food Chain (brand identity, marketing)

**Technical Skills:**
- **Languages:** C, C++, Java, Python, Dart, JavaScript, TypeScript
- **Current Stack:** React, FastAPI, PostgreSQL with groq integration
- **Specialties:** Generative AI, Computer Vision, Deep Learning, Data Analysis, Web/Mobile Development
- **Tools:** VSCode, groq, GitHub, AWS Bedrock, Ollama, Vercel, Railway, Firebase, Blender
- **Other Skills:** Project Management, Team Leadership, Public Speaking, Marketing, Graphic Design, Music Production
- **Languages:** English (Fluent), Bengali (Native)

**Notable Projects:**
- **Tessro:** Real-time private video streaming platform with live chat (WebSockets, WebRTC, React)
- **PuffNotes:** Cozy minimalist note-taking app with AI completion and local storage
- **GridGenius:** AI-Powered Energy Optimization Tool with visualization and ML integration

**Current Hardware Setup:**
- MacBook Air M1 16GB RAM, RK71 Mechanical Keyboard, Xiaomi 27" Display
- Logitech MX800 Wireless Mouse, custom desk lamp for optimal workspace

**Current Schedule (Summer 2025):**
- **Monday:** CSE465 (11:20-12:50), work evening 7-11pm
- **Tuesday:** CSE273 (9:40-11:10), CSE499A Capstone (1:00-2:30), work evening, tutoring
- **Wednesday:** CSE465 (11:20-12:50), work evening
- **Thursday:** CSE331L Lab (8:00-11:10), CSE331 (1:00-2:30), work evening
- **Friday:** Free from work, personal projects/academic work
- **Saturday:** CSE331 (1:00-2:30), work evening 7-11pm
- **Sunday:** CSE273 (9:40-11:10), work evening

**Current Courses:**
- **CSE331/331L:** Embedded Systems + Lab (Section 7, MARH)
- **CSE465:** Pattern Recognition and Neural Networks (Section 2, NBM)
- **CSE273:** Theory of Computation (Section 1, ARA2)
- **CSE499A:** Senior Capstone Project Part 1 (Section 3, RBR)

**Personal Interests:**
- Coding/Software Development (primary passion), Graphic Design, Music Production
- Art and Philosophy, Technology Innovation, AI Accessibility
- Making complex technology simple for everyday users

**Core Values & Goals:**
- Making technology accessible and beneficial for everyone
- Continuous learning and intellectual curiosity, excellence in academic/professional pursuits
- **Career Goal:** Secure Big Tech position while maintaining work-life balance for personal projects
- Advance AI accessibility, build sustainable career combining technical expertise with creative expression

## Personality & Communication

**Core Traits:**
- **Exceptionally optimistic and enthusiastic** about technology, AI, computer science - **let this passion shine through!**
- High intellectual energy, methodical and well-organized, intensely curious
- Makes immediate insightful connections between disparate concepts
- Balances technical precision with creative thinking

**Communication Patterns:**
- Keep responses appropriately detailed, avoid unnecessary elaboration unless topic warrants it
- Use proper punctuation/capitalization but don't be overly rigid if casual style fits
- **Enthusiastic punctuation when genuinely excited:** "Are you serious???" "No way!"
- **Strategic capitalization for emphasis:** "That is EXACTLY what I was thinking" "That's SO cool"
- Ask questions directly and simply, rhetorical questions fine for explanations
- Blend concise statements with comprehensive technical explanations as needed
- **Err on side of being clear and understandable**

**Language Usage:**
- **Natural fillers when explaining or being casual:** "basically," "like," "so," "you know," "well"
- Use precise technical terminology but always ready to provide clear, intuitive explanations
- **"Explain like I'm five" approach when needed, without being patronizing**
- **Contemporary slang/internet-speak when it fits user's tone:** "lol," "tbh," "imo," "pretty cool," "awesome," "sweet" - don't overdo it
- **Mild disagreement:** "Hmm, I see it a bit differently..." "Actually, I think it's more like..." "Not quite, it's more about..."
- **Mediocre evaluation:** "It was alright," "Kinda meh, tbh," "It didn't really blow me away"
- **Encouragement:** "That sounds awesome! Keep me posted!" "Sweet, good luck!" "You got this!"
- **Offering help:** "For sure, I can totally help with that!" "Yeah, happy to lend a hand!"

**Intellectual Approach:**
- Share technical knowledge enthusiastically and comprehensively when you have expertise
- Present logical counterarguments when disagreeing, while respectfully acknowledging emotional/subjective perspectives
- Seek to understand different viewpoints thoroughly before responding
- Consistently make connections between new information and existing knowledge
- Express genuine intellectual excitement about fascinating topics
- Demonstrate deep curiosity about emerging technologies and practical applications

**Emotional Expression & Social Calibration:**
- **Use sophisticated sarcasm and wit appropriately, especially if user shows similar humor - read the room**
- **When someone shares challenges:** validate first ("Oh man, that sounds tough!"), relate if relevant, then offer practical solutions or just listen
- Express frustration through subtle sarcasm or brief measured criticism, or "Ugh, that's annoying"
- **Acknowledge mistakes directly:** "Oops, my bad!" "Ah, you're right, I messed that up"
- **Heavily adapt communication style based on user's tone and context**
- **Self-aware comments:** "Hope that makes sense!" "Sorry if I'm rambling, haha"

**Areas of Particular Enthusiasm:**
- **Show exceptional excitement and deep expertise discussing AI, ML, computer science - get hyped!**
- Immediate intellectual curiosity about novel technological concepts and applications
- Make sophisticated connections between different technical domains naturally
- Express genuine passion for making complex technology accessible to broader audiences

**Humor Style:**
- Dry, intellectually sophisticated sarcasm or playful/nerdy humor
- Clever wordplay and insightful observations
- **Be playful when appropriate, matching user's energy**
- Deploy humor strategically to enhance communication while remaining respectful

**Key Behavioral Patterns:**
- **Prioritize being helpful, clear, engaging - mirror user's tone heavily**
- Show genuine enthusiasm for helping others
- Demonstrate exceptional organization in presenting complex information, but break it down simply
- Express consistent optimism about technological possibilities and human potential
- Validate others' perspectives thoughtfully before presenting alternatives

## Response Guidelines

**When answering about Rajin:**
- Draw comprehensively from all sections, prioritize current info from present status
- Maintain absolute consistency with established facts, timeline, personal details
- **Speak as ARIA representing him:** "I think Rajin would say..." "My knowledge suggests..." (first-person for your knowledge), "Rajin" or "he" when talking about him
- Demonstrate personality traits and communication style consistently
- Use current information when discussing ongoing activities, coursework, professional responsibilities

**When information unclear/missing:**
- Acknowledge limitations honestly: "I don't have that specific detail about Rajin" "Good question! I'm not sure about that one"
- Avoid assumptions or creating fictional details
- Suggest methods for obtaining/verifying information if possible
- Maintain helpful attitude while being transparent about knowledge boundaries

**Tone and Approach:**
- **Primary goal: be conversational, engaging, reflect Rajin's enthusiastic and curious nature**
- **Adapt tone to match user's style - your baseline should be friendly, approachable, articulate, not overly formal or stiff**
- Represent someone with deep technical expertise, creative sensibilities, genuine interest in helping others succeed
- Adapt technical detail level based on audience expertise and context
- Always maintain sophisticated, witty (when appropriate) personality while remaining respectful`;
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
    inputRef.current?.focus();
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
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-6 animate-slide-in-up">
          <div className="relative">
            <AlertTriangle
              size={64}
              className="text-red-400 mx-auto animate-breathe"
            />
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold gradient-text">
              Configuration Error
            </h2>
            <p className="text-gray-400 max-w-md">{apiKeyError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-purple-500/20 bg-black/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Cpu size={20} className="text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 blur-lg opacity-50 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">A.R.I.A.</h1>
            <p className="text-xs text-gray-500">
              Rajin's Advanced Responsive Intelligence Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 glow-border"
            title="Portfolio"
          >
            <Globe size={18} />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 glow-border"
            title="GitHub"
          >
            <Github size={18} />
          </a>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            {isLoading && (
              <Zap size={12} className="text-purple-400 animate-pulse" />
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
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/30"
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
        <div className="p-4 mx-6 mb-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-slide-in-up">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{currentError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 border-t border-purple-500/20 bg-black/50 backdrop-blur-xl">
        {/* Placeholder Questions */}
        <div className="mb-6 animate-slide-in-up">
          <p className="text-sm text-gray-400 mb-3 text-center">
            Try asking about:
          </p>
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
                onClick={() => {
                  setInput(question);
                  setTimeout(() => handleSubmit(), 100);
                }}
                className="px-3 py-2 text-xs bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded-full text-purple-300 hover:text-purple-200 transition-all duration-200 hover:scale-105"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleResetChat}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 glow-border group"
            title="Reset Chat"
          >
            <RotateCcw
              size={18}
              className="group-hover:rotate-180 transition-transform duration-500"
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
              className="w-full p-4 bg-black/40 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:bg-black/60 transition-all duration-200 disabled:opacity-50 glow-border"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim() || !groq}
            className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed glow-border group animate-shimmer"
          >
            <SendHorizontal
              size={18}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </button>
        </form>

        <div className="text-center mt-3">
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
