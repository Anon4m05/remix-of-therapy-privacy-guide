import type { Role } from '@/types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface StreamChatOptions {
  messages: ChatMessage[];
  userRole: Role;
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError?: (error: Error) => void;
}

export async function streamChat({
  messages,
  userRole,
  onDelta,
  onDone,
  onError,
}: StreamChatOptions): Promise<void> {
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/therapeutic-privacy-chat`;

  try {
    const response = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages,
        role: userRole 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      // Process line-by-line
      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        // Handle CRLF
        if (line.endsWith('\r')) {
          line = line.slice(0, -1);
        }

        // Skip SSE comments and empty lines
        if (line.startsWith(':') || line.trim() === '') {
          continue;
        }

        // Parse SSE data
        if (!line.startsWith('data: ')) {
          continue;
        }

        const jsonStr = line.slice(6).trim();
        
        // Check for stream end
        if (jsonStr === '[DONE]') {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            onDelta(content);
          }
        } catch (parseError) {
          // Incomplete JSON - put it back and wait for more data
          textBuffer = line + '\n' + textBuffer;
          break;
        }
      }
    }

    // Final flush of remaining buffer
    if (textBuffer.trim()) {
      const lines = textBuffer.split('\n');
      for (let raw of lines) {
        if (!raw) continue;
        if (raw.endsWith('\r')) {
          raw = raw.slice(0, -1);
        }
        if (raw.startsWith(':') || raw.trim() === '') continue;
        if (!raw.startsWith('data: ')) continue;
        
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            onDelta(content);
          }
        } catch {
          // Ignore partial leftovers
        }
      }
    }

    onDone();
  } catch (error) {
    console.error('Stream chat error:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    } else {
      throw error;
    }
  }
}
