import type { ReactElement } from 'react';
import type { User } from '@supabase/supabase-js';

export type Thread = {
  id: string;
  title: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

type SidebarProps = {
  threads: Thread[];
  activeThreadId: string | null;
  loading: boolean;
  user: User | null;
  onSelectThread: (id: string) => void;
  onNewConversation: () => void;
  onDeleteThread: (id: string) => void;
  onSignOut: () => void;
};

export function Sidebar({
  threads,
  activeThreadId,
  loading,
  user,
  onSelectThread,
  onNewConversation,
  onDeleteThread,
  onSignOut,
}: SidebarProps): ReactElement {
  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen bg-muted/40 border-r border-border">
      {/* Header del sidebar */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-border shrink-0">
        <span className="text-green-600 font-bold text-base">🌿</span>
        <span className="text-xs font-semibold text-foreground tracking-tight flex-1">
          Asistente ODEPA
        </span>
      </div>

      {/* Botón nueva conversación */}
      <div className="px-2 pt-3 pb-1 shrink-0">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-border bg-background hover:bg-muted transition-colors text-foreground"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1v10M1 6h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Nueva conversación
        </button>
      </div>

      {/* Lista de threads */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {loading && <p className="text-xs text-muted-foreground px-2 py-2">Cargando...</p>}

        {!loading && threads.length === 0 && (
          <p className="text-xs text-muted-foreground px-2 py-3">Sin conversaciones aún.</p>
        )}

        {threads.map((thread) => (
          <ThreadItem
            key={thread.id}
            thread={thread}
            active={thread.id === activeThreadId}
            onSelect={() => onSelectThread(thread.id)}
            onDelete={() => onDeleteThread(thread.id)}
          />
        ))}
      </div>

      {/* Footer con usuario */}
      <div className="border-t border-border px-3 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {user?.email?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <span className="text-xs text-muted-foreground truncate flex-1 min-w-0">
            {user?.email ?? ''}
          </span>
          <button
            onClick={onSignOut}
            title="Cerrar sesión"
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

type ThreadItemProps = {
  thread: Thread;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
};

function ThreadItem({ thread, active, onSelect, onDelete }: ThreadItemProps): ReactElement {
  return (
    <div
      className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer text-xs transition-colors ${
        active
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
      onClick={onSelect}
    >
      <span className="flex-1 truncate">{thread.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Eliminar"
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
