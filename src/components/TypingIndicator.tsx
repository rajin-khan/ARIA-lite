// src/components/TypingIndicator.tsx
import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start justify-start gap-4 group animate-slide-in-up">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center backdrop-blur-sm group-hover:shadow-purple-500/25 transition-all duration-300">
        <Bot size={16} className="text-purple-300 animate-pulse" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-xl opacity-50 animate-breathe"></div>
      </div>

      {/* Typing Bubble */}
      <div className="relative max-w-[80%]">
        <div className="relative p-4 rounded-2xl rounded-bl-md bg-black/40 border border-purple-500/20 backdrop-blur-sm">
          {/* Typing Animation Dots */}
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

          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-2xl rounded-bl-md bg-gradient-to-br from-purple-500/5 to-blue-500/5 blur-xl opacity-50 -z-10"></div>
        </div>

        {/* Typing indicator label */}
        <div className="absolute -bottom-6 left-4">
          <span className="text-xs text-gray-500 opacity-70">ARIA is thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;