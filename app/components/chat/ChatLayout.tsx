import type { ReactNode, ReactElement } from 'react';

type Model = { id: string; label: string; provider: string };

type ChatLayoutProps = {
  children: ReactNode;
  sidebar: ReactNode;
  models: Model[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  isStreaming: boolean;
};

export function ChatLayout({
  children,
  sidebar,
  models,
  selectedModel,
  onModelChange,
  isStreaming,
}: ChatLayoutProps): ReactElement {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar con historial de conversaciones */}
      {sidebar}

      {/* Área principal */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-end px-4 py-3 border-b border-border shrink-0">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            disabled={isStreaming}
            className="text-xs bg-muted text-foreground border border-border rounded-md px-2 py-1 disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </header>

        {/* Mensajes e input */}
        <div className="flex flex-col flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
}
