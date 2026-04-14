import { useState, type ReactElement } from "react";
import Markdown from "react-markdown";
import type { UIMessage } from "ai";

type MessageBubbleProps = {
  message: UIMessage;
};

export function MessageBubble({ message }: MessageBubbleProps): ReactElement {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-1">
        <div className="max-w-[75%] bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2 text-sm">
          {message.parts.map((part, i) =>
            part.type === "text" ? (
              <p key={i}>{(part as { text: string }).text}</p>
            ) : null
          )}
        </div>
      </div>
    );
  }

  // Mensaje del asistente
  const isCallingTool = message.parts.some(
    (p) => p.type === "tool-invocation" && (p as { state?: string }).state === "call"
  );

  const textContent = message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { text: string }).text)
    .join("\n");

  return (
    <div className="px-4 py-1">
      <div className="flex items-start gap-3 max-w-[85%]">
        {/* Ícono del asistente */}
        <div className="shrink-0 w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold mt-0.5">
          O
        </div>

        <div className="flex-1 min-w-0 group">
          {isCallingTool && (
            <p className="text-xs text-muted-foreground italic mb-1 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Consultando base de datos...
            </p>
          )}

          <div className="prose prose-sm max-w-none text-foreground [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:font-semibold [&_td]:py-1 [&_tr]:border-b [&_tr]:border-border">
            {message.parts.map((part, i) =>
              part.type === "text" ? (
                <Markdown key={i}>{(part as { text: string }).text}</Markdown>
              ) : null
            )}
          </div>

          {/* Botón copiar — aparece al hover */}
          {textContent && (
            <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton text={textContent} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      title="Copiar respuesta"
      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copiado
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
            <path
              d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Copiar
        </>
      )}
    </button>
  );
}
