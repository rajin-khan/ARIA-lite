// src/components/MessageBubble.tsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot, Copy, Check, AlertTriangle } from 'lucide-react';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'ai';
  isStreaming?: boolean;
  isFinalAiMessage?: boolean;
  isError?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  sender,
  isStreaming,
  isFinalAiMessage,
  isError
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const shouldAnimate = sender === 'user' || (sender === 'ai' && isFinalAiMessage);
  const animationDelay = sender === 'user' ? '100ms' : '300ms';

  if (sender === 'user') {
    return (
      <div className={`flex items-start justify-end gap-3 group animate-in`} style={{ "--animation-delay": animationDelay } as React.CSSProperties}>
        <div className="relative max-w-[85%] sm:max-w-[80%]">
          <div className="relative z-30 duration-300 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1">
            {/* --- CHANGE: Adjusted padding for better text alignment --- */}
            <div className="px-5 py-3 rounded-2xl rounded-br-lg bg-neutral-900">
              <p className="text-white leading-relaxed" style={{ wordBreak: 'break-word' }}>{text}</p>
            </div>
          </div>
          <div className="absolute inset-0 z-20 w-full h-full duration-300 ease-out border border-dashed rounded-2xl border-neutral-700 group-hover:-translate-x-1 group-hover:-translate-y-1" />
          <div className="absolute inset-0 z-10 w-full h-full duration-300 ease-out border border-dashed rounded-2xl border-neutral-700 group-hover:translate-x-1 group-hover:translate-y-1" />
          <button
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : "Copy message"}
            className="absolute -left-11 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-neutral-900/50 hover:bg-neutral-800/70 text-neutral-400 hover:text-white border border-neutral-700/50"
            title={copied ? "Copied!" : "Copy message"}
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shadow-md">
          <User size={16} className="text-neutral-400" />
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div className={`flex items-start justify-start gap-3 group ${shouldAnimate && !isStreaming ? 'animate-in' : ''}`} style={{ "--animation-delay": animationDelay } as React.CSSProperties}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center shadow-md transition-colors ${isError ? 'bg-red-900/50 border-red-500/30' : 'bg-neutral-900 border-neutral-700'}`}>
        {isError ? <AlertTriangle size={16} className="text-red-400" /> : <Bot size={16} className="text-neutral-400" />}
      </div>
      <div className="max-w-[85%] sm:max-w-[80%] relative">
         <div className="relative z-30 duration-300 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1">
            {/* --- CHANGE: Adjusted padding for better text alignment --- */}
            <div className={`px-5 py-3 rounded-2xl rounded-bl-lg ${isError ? 'bg-red-900/30' : 'bg-neutral-900'}`}>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {text || (isStreaming ? '▋' : '')}
                </ReactMarkdown>
              </div>
            </div>
         </div>
         <div className="absolute inset-0 z-20 w-full h-full duration-300 ease-out border border-dashed rounded-2xl border-neutral-700 group-hover:-translate-x-1 group-hover:-translate-y-1" />
         <div className="absolute inset-0 z-10 w-full h-full duration-300 ease-out border border-dashed rounded-2xl border-neutral-700 group-hover:translate-x-1 group-hover:translate-y-1" />

        {!isError && text.trim() && !isStreaming && (
          <button
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : "Copy message"}
            className="absolute -right-11 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-neutral-900/50 hover:bg-neutral-800/70 text-neutral-400 hover:text-white border border-neutral-700/50"
            title={copied ? "Copied!" : "Copy message"}
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);