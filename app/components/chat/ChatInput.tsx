import type { KeyboardEvent, ReactElement } from "react";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export function ChatInput({ value, onChange, onSubmit, isLoading }: ChatInputProps): ReactElement {
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="shrink-0 px-4 py-3 border-t border-border">
      <div className="flex items-end gap-2 bg-muted rounded-xl px-3 py-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Consulte sobre precios mayoristas... (Enter para enviar)"
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 max-h-32 overflow-y-auto"
        />
        <button
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
          aria-label="Enviar"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-1.5">
        Shift+Enter para nueva línea
      </p>
    </div>
  );
}
