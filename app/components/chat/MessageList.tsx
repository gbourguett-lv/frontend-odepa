import { useEffect, useRef, type ReactElement } from 'react';
import type { UIMessage } from 'ai';
import { MessageBubble } from './MessageBubble';

type MessageListProps = {
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | undefined;
};

export function MessageList({ messages, isLoading, error }: MessageListProps): ReactElement {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Desplaza al final cada vez que cambian los mensajes o el estado de carga
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-1">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
          <span className="text-4xl">🌿</span>
          <p className="text-sm">Consulte sobre precios mayoristas en Chile</p>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <div className="px-4 py-1">
          <div className="flex items-center gap-3 max-w-[85%]">
            <div className="shrink-0 w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
              O
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      {error && <p className="px-4 text-sm text-destructive">Error: {error.message}</p>}

      <div ref={bottomRef} />
    </div>
  );
}
