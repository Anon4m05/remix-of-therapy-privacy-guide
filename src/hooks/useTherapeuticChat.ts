import { useState, useCallback } from 'react';
import { useRole } from '@/context/RoleContext';
import { streamChat, type ChatMessage } from '@/utils/streamChat';
import { useToast } from '@/hooks/use-toast';

export function useTherapeuticChat() {
  const { role } = useRole();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || !role) return;

    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage.trim(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    let assistantContent = '';
    
    const updateAssistantMessage = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          // Update existing assistant message
          return prev.map((msg, i) => 
            i === prev.length - 1 
              ? { ...msg, content: assistantContent }
              : msg
          );
        }
        // Create new assistant message
        return [...prev, { role: 'assistant', content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, newUserMessage],
        userRole: role,
        onDelta: updateAssistantMessage,
        onDone: () => setIsLoading(false),
        onError: (error) => {
          setIsLoading(false);
          toast({
            title: 'Error',
            description: error.message || 'Failed to get response from AI assistant',
            variant: 'destructive',
          });
          // Remove the user message if error occurred before any response
          if (!assistantContent) {
            setMessages(prev => prev.slice(0, -1));
          }
        },
      });
    } catch (error) {
      console.error('Send message error:', error);
      setIsLoading(false);
    }
  }, [messages, role, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
}
