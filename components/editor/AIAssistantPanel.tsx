'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Sparkles, Send, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { AI_QUICK_ACTIONS } from '@/lib/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistantPanel() {
  const { isEditorMode, selectedElement, updateContent } = useEditor();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset when selected element changes
  useEffect(() => {
    if (selectedElement) {
      setMessages([]);
      setIsExpanded(true);
      setShowQuickActions(true);
    }
  }, [selectedElement?.id]);

  if (!isEditorMode) return null;

  const handleQuickAction = async (actionKey: string) => {
    if (!selectedElement || isLoading) return;

    setIsLoading(true);
    setShowQuickActions(false);

    const actionDescription = AI_QUICK_ACTIONS[actionKey as keyof typeof AI_QUICK_ACTIONS];
    setMessages(prev => [...prev, { role: 'user', content: actionDescription }]);

    try {
      const response = await fetch('/api/admin/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentContent: selectedElement.currentValue,
          quickAction: actionKey,
          contentType: 'paragraph',
        }),
      });

      if (response.ok) {
        const { newContent } = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: newContent }]);

        // Update the content
        updateContent(
          selectedElement.pageId,
          selectedElement.sectionId,
          selectedElement.contentKey,
          newContent,
          'text'
        );
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      console.error('AI quick action failed:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedElement || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setShowQuickActions(false);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentContent: selectedElement.currentValue,
          instruction: userMessage,
          contentType: 'paragraph',
        }),
      });

      if (response.ok) {
        const { newContent } = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: newContent }]);

        // Update the content
        updateContent(
          selectedElement.pageId,
          selectedElement.sectionId,
          selectedElement.contentKey,
          newContent,
          'text'
        );
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      console.error('AI message failed:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-[9998] w-80">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between bg-gradient-to-r from-jhr-gold to-jhr-gold-light text-jhr-black px-4 py-3 rounded-t-lg font-semibold"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Assistant
        </div>
        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </button>

      {/* Expandable panel */}
      {isExpanded && (
        <div className="bg-jhr-black-light border border-jhr-gold/30 border-t-0 rounded-b-lg shadow-2xl">
          {/* Selected element info */}
          {selectedElement ? (
            <div className="p-3 border-b border-jhr-gold/20 bg-jhr-black/50">
              <p className="text-xs text-jhr-gold">Editing:</p>
              <p className="text-sm text-white truncate">{selectedElement.contentKey}</p>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                &ldquo;{selectedElement.currentValue.slice(0, 100)}...&rdquo;
              </p>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              <p className="text-sm">Click on any text element to edit it with AI assistance</p>
            </div>
          )}

          {selectedElement && (
            <>
              {/* Quick actions */}
              {showQuickActions && (
                <div className="p-3 border-b border-jhr-gold/20">
                  <p className="text-xs text-gray-400 mb-2">Quick Actions:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(AI_QUICK_ACTIONS).slice(0, 4).map(([key, description]) => (
                      <button
                        key={key}
                        onClick={() => handleQuickAction(key)}
                        disabled={isLoading}
                        className="text-xs px-2 py-1 bg-jhr-gold/20 hover:bg-jhr-gold/40 text-jhr-gold rounded transition-colors"
                        title={description}
                      >
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="h-48 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 && !showQuickActions && (
                  <p className="text-sm text-gray-400 text-center">
                    Tell me how you&apos;d like to change this content...
                  </p>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`text-sm ${
                      msg.role === 'user'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    <span
                      className={`inline-block px-3 py-2 rounded-lg max-w-[90%] ${
                        msg.role === 'user'
                          ? 'bg-jhr-gold/20 text-jhr-gold'
                          : 'bg-jhr-black text-white'
                      }`}
                    >
                      {msg.content}
                    </span>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-jhr-gold">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-jhr-gold/20">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your instruction..."
                    className="flex-1 bg-jhr-black border border-jhr-gold/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-jhr-gold"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="p-2 bg-jhr-gold hover:bg-jhr-gold-light text-jhr-black rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
