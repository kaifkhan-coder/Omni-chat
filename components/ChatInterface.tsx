import React, { useState, useRef, useEffect } from 'react';
import { Message, Role } from '../types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { sendMessageStream, initializeChat } from '../services/gemini';
import { Send, Sparkles, RefreshCw, Trash2 } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chat on mount
  useEffect(() => {
    if (!isInitialized) {
      initializeChat();
      // Add a welcoming initial message
      setMessages([
        {
          id: 'init-1',
          role: Role.MODEL,
          text: "Hello! I'm OmniChat. I can answer questions, help you with code, or just chat. What's on your mind?",
          timestamp: new Date(),
        }
      ]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Auto-scroll to bottom logic
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      // Use refined scrolling behavior
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      const maxScrollTop = scrollHeight - clientHeight;
      
      scrollContainerRef.current.scrollTo({
        top: maxScrollTop,
        behavior: 'smooth'
      });
    }
  };

  // Scroll when messages change
  useEffect(() => {
    // Small timeout to ensure DOM has updated
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessageText = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: userMessageText,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Add Placeholder Bot Message
      const botMsgId = (Date.now() + 1).toString();
      const botMsg: Message = {
        id: botMsgId,
        role: Role.MODEL,
        text: '',
        timestamp: new Date(),
        isStreaming: true,
      };
      
      setMessages((prev) => [...prev, botMsg]);

      // 3. Stream Response
      let fullResponse = '';
      
      await sendMessageStream(userMessageText, (chunk) => {
        fullResponse += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMsgId 
              ? { ...msg, text: fullResponse } 
              : msg
          )
        );
      });

      // 4. Finalize
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMsgId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );
      
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: Role.MODEL,
          text: "I'm sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    // Add a small fade out effect before reset could be cool, but simplistic reset is faster
    initializeChat();
    setMessages([
        {
          id: Date.now().toString(),
          role: Role.MODEL,
          text: "Fresh start! How can I help you now?",
          timestamp: new Date(),
        }
    ]);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 relative">
      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth overscroll-contain"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === Role.USER && (
          <div className="flex justify-start animate-slide-up-fade">
             <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white/95 backdrop-blur border-t border-slate-100 sm:rounded-b-2xl z-20 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto flex items-end gap-2 sm:gap-3 relative">
            <button 
                onClick={resetChat}
                className="p-3 mb-[1px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-300 hover:rotate-180 active:scale-90"
                title="Reset Conversation"
            >
                <RefreshCw size={20} />
            </button>
            
            <div className="flex-1 relative bg-slate-100 rounded-2xl border border-transparent focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50/50 transition-all duration-300 hover:bg-slate-50">
                <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                rows={1}
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 px-4 py-3.5 max-h-[120px] focus:outline-none resize-none overflow-y-auto rounded-2xl text-[15px] leading-relaxed"
                style={{ scrollbarWidth: 'none' }}
                />
            </div>

            <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`p-3.5 mb-[1px] rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                !input.trim() || isLoading
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed scale-95'
                    : 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-200 hover:scale-110 active:scale-90'
                }`}
            >
                {isLoading ? (
                    <Sparkles className="animate-spin-slow" size={20} />
                ) : (
                    <Send size={20} className={input.trim() ? "translate-x-0.5" : ""} />
                )}
            </button>
        </div>
        <div className="text-center mt-2 hidden sm:block">
            <p className="text-[10px] text-slate-400 animate-pulse">
                AI can make mistakes. Please verify important information.
            </p>
        </div>
      </div>
    </div>
  );
};