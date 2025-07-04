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

  const shouldAnimate = (sender === 'user' || (sender === 'ai' && isFinalAiMessage));

  if (sender === 'user') {
    return (
      <div className={`flex items-start justify-end gap-4 group ${shouldAnimate ? 'animate-slide-in-up' : ''}`}>
        <div className="max-w-[80%] relative">
          {/* OPTIMIZATION: Removed backdrop-blur and glow div for performance. */}
          <div className="relative p-4 rounded-2xl rounded-br-md bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <p className="text-white leading-relaxed">{text}</p>
            
            <button
              onClick={handleCopy}
              className="absolute -left-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-gray-400 hover:text-white border border-white/10"
              title={copied ? "Copied!" : "Copy message"}
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
          <User size={16} className="text-white" />
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div className={`flex items-start justify-start gap-4 group ${shouldAnimate && !isStreaming ? 'animate-slide-in-up' : ''}`}>
      {/* AI Avatar */}
      {/* OPTIMIZATION: Removed backdrop-blur and breathe animation for performance. */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center group-hover:shadow-purple-500/25 transition-all duration-300">
        {isError ? (
          <AlertTriangle size={16} className="text-red-400" />
        ) : (
          <Bot size={16} className="text-purple-300" />
        )}
      </div>

      {/* Message Content */}
      <div className="max-w-[80%] relative">
        {/* OPTIMIZATION: Removed backdrop-blur and glow div for performance. */}
        <div className={`relative p-4 rounded-2xl rounded-bl-md border ${
          isError 
            ? 'bg-red-500/10 border-red-500/30' 
            : 'bg-black/40 border-purple-500/20'
        }`}>
          {isStreaming && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          )}

          {isError ? (
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-red-300 leading-relaxed">{text}</p>
            </div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {text || (isStreaming ? '●' : '')}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isError && text.trim() && !isStreaming && (
          <button
            onClick={handleCopy}
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-gray-400 hover:text-white border border-white/10"
            title={copied ? "Copied!" : "Copy message"}
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        )}

        {isStreaming && (
          <div className="absolute -bottom-6 left-4">
            <span className="text-xs text-gray-500 opacity-70 animate-pulse">Generating response...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);