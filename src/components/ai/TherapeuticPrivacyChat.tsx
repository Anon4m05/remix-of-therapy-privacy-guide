import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTherapeuticChat } from '@/hooks/useTherapeuticChat';
import { useRole } from '@/context/RoleContext';
import { cn } from '@/lib/utils';

export function TherapeuticPrivacyChat() {
  const { role } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, sendMessage, clearMessages } = useTherapeuticChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus textarea when chat opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Don't show chat widget if no role selected
  if (!role) {
    return null;
  }

  // Greeting messages based on role
  const getGreeting = () => {
    switch (role) {
      case 'healthcare_provider':
        return 'Hello! I\'m here to help you navigate privacy decisions through a therapeutic lens. Ask me about consent, capacity, circle of care, substitute decision-makers, or any privacy dilemma you\'re facing in patient care.';
      case 'patient_family':
        return 'Hello! I\'m here to help you understand your privacy rights and how they affect your healthcare experience. Feel free to ask about your medical records, family involvement, or any privacy concerns you have.';
      case 'privacy_professional':
        return 'Hello! I bring a therapeutic jurisprudence perspective to privacy compliance work. I can help with policy development, breach response, staff education, or complex privacy scenarios requiring ethical analysis.';
      default:
        return 'Hello! I\'m your therapeutic privacy assistant. How can I help you today?';
    }
  };

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
          size="icon"
          aria-label="Open therapeutic privacy chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold text-base">Therapeutic Privacy Assistant</h3>
            </div>
            <div className="flex gap-2">
              {messages.length > 0 && (
                <Button
                  onClick={clearMessages}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-primary-foreground/20"
                  aria-label="Clear conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-primary-foreground/20"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700 mb-4">
                <p className="mb-2">{getGreeting()}</p>
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Disclaimer:</strong> This AI provides educational guidance based on therapeutic jurisprudence principles. It is not a substitute for legal advice, institutional policy review, or clinical decision-making.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'mb-4 flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-4 py-2 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900 border border-gray-200'
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about privacy, consent, capacity, or any therapeutic concern..."
                className="flex-1 min-h-[60px] max-h-[120px] text-sm resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="h-[60px] w-[60px] bg-primary hover:bg-primary/90"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
