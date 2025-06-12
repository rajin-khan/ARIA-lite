// src/components/TypingIndicator.tsx
import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start justify-start gap-4 group animate-slide-in-up">
      {/* AI Avatar */}
      {/* OPTIMIZATION: Removed backdrop-blur and breathe animation for performance. */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center group-hover:shadow-purple-500/25 transition-all duration-300">
        <Bot size={16} className="text-purple-300 animate-pulse" />
      </div>

      {/* Typing Bubble */}
      <div className="relative max-w-[80%]">
        {/* OPTIMIZATION: Removed backdrop-blur and glow div for performance. */}
        <div className="relative p-4 rounded-2xl rounded-bl-md bg-black/40 border border-purple-500/20">
          <div className="flex items-center space-x-1.5">
            <div 
              className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: '0s', animationDuration: '1.4s' }}
            ></div>
            <div 
              className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{ animationDelay: '0.2s', animationDuration: '1.4s' }}
            ></div>
            <div 
              className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: '0.4s', animationDuration: '1.4s' }}
            ></div>
          </div>
        </div>

        <div className="absolute -bottom-6 left-4">
          <span className="text-xs text-gray-500 opacity-70">ARIA is thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TypingIndicator);