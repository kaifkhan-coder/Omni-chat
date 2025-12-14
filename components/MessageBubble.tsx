import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Role } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-4 animate-slide-up-fade ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[88%] sm:max-w-[75%] px-4 sm:px-5 py-3 sm:py-3.5 shadow-sm transition-all duration-300 ease-out hover:shadow-md ${
          isUser
            ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
            : 'bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-sm'
        }`}
      >
        <div className={`text-[15px] leading-relaxed break-words prose-sm ${isUser ? 'prose-invert' : 'prose-slate'}`}>
          {isUser ? (
            // User messages are typically simple text, rendering them as is preserves whitespace properly without overhead
            <div className="whitespace-pre-wrap font-sans">{message.text}</div>
          ) : (
            // Bot messages need markdown rendering
            <ReactMarkdown
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match && !String(children).includes('\n');
                  return isInline ? (
                    <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="relative my-2 group">
                       <pre className="bg-slate-900 text-slate-50 p-3 rounded-lg overflow-x-auto text-sm font-mono shadow-inner">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                ul: ({ children }) => <ul className="list-disc ml-4 my-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-4 my-2 space-y-1">{children}</ol>,
                h1: ({ children }) => <h1 className="text-xl font-bold my-3 pb-1 border-b border-slate-100">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold my-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-md font-bold my-1">{children}</h3>,
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline decoration-blue-300 hover:text-blue-600 hover:decoration-blue-500 transition-colors">
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-200 bg-blue-50/50 pl-4 py-1 pr-2 italic my-2 text-slate-600 rounded-r">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                   <div className="overflow-x-auto my-3 rounded-lg border border-slate-200">
                     <table className="min-w-full divide-y divide-slate-200">{children}</table>
                   </div>
                ),
                th: ({ children }) => <th className="bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{children}</th>,
                td: ({ children }) => <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600 border-t border-slate-100">{children}</td>,
              }}
            >
              {message.text}
            </ReactMarkdown>
          )}
        </div>
        <div className={`text-[10px] mt-1.5 opacity-70 select-none flex items-center gap-1 ${isUser ? 'text-blue-100 justify-end' : 'text-slate-400 justify-start'}`}>
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {message.isStreaming && (
             <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse ml-1"></span>
          )}
        </div>
      </div>
    </div>
  );
};