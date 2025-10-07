// src/components/TypingIndicator.tsx
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start justify-start gap-3 group animate-in" style={{ "--animation-delay": "100ms" } as React.CSSProperties}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center shadow-md">
        {/* --- CHANGE: Replaced Bot icon with your custom SVG --- */}
        <img src="/icons/aria-icon.svg" alt="ARIA Avatar" className="w-4 h-4 animate-pulse" />
      </div>
      <div className="relative max-w-[85%]">
        <div className="relative z-30">
          <div className="p-4 rounded-2xl rounded-bl-lg bg-neutral-900">
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 bg-neutral-600 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-neutral-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-neutral-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 z-20 w-full h-full border border-dashed rounded-2xl border-neutral-700" />
        <div className="absolute inset-0 z-10 w-full h-full border border-dashed rounded-2xl border-neutral-700" />
      </div>
    </div>
  );
};

export default React.memo(TypingIndicator);