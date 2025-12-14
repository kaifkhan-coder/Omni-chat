import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1 p-2 bg-slate-100 rounded-2xl rounded-tl-none w-fit">
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce-slow"></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce-slow animation-delay-200"></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce-slow animation-delay-400"></div>
    </div>
  );
};