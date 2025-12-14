import React from 'react';
import { ChatInterface } from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-50 relative overflow-hidden transition-colors duration-500">
      {/* Decorative background elements - Made responsive and animated */}
      <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] sm:w-[500px] sm:h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] sm:w-[500px] sm:h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-200"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[70vw] h-[70vw] sm:w-[500px] sm:h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-400"></div>
      
      <main className="z-10 flex-1 flex flex-col h-full w-full max-w-5xl mx-auto shadow-none sm:shadow-2xl bg-white/80 backdrop-blur-sm sm:rounded-2xl sm:my-4 sm:h-[calc(100dvh-2rem)] border-0 sm:border border-white/20 transition-all duration-300">
        <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md sm:rounded-t-2xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-105 hover:rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/>
                <path d="M12 22v-4"/>
                <path d="M16.2 3.8A8.04 8.04 0 0 0 12 2v0a8.04 8.04 0 0 0-4.2 1.8"/>
                <circle cx="12" cy="11" r="3"/>
                <path d="M8 20v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"/>
                <path d="M4 11a8 8 0 0 1 16 0"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl text-slate-800 tracking-tight leading-tight">OmniChat AI</h1>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Online • Gemini 2.5 Flash</p>
              </div>
            </div>
          </div>
        </header>
        
        <ChatInterface />
        
      </main>
    </div>
  );
};

export default App;