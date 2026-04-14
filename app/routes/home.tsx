import { useState, useEffect, useMemo, useCallback, type ReactElement } from 'react';
import { useNavigate, useLoaderData } from 'react-router';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { UIMessage } from 'ai';
import { ChatLayout } from '../components/chat/ChatLayout';
import { MessageList } from '../components/chat/MessageList';
import { ChatInput } from '../components/chat/ChatInput';
import { Sidebar, type Thread } from '../components/chat/Sidebar';
import { useAuth } from '../context/auth';
import { supabase, authFetch } from '../lib/supabase';
import type { Route } from './+types/home';

type Model = { id: string; label: string; provider: string; description: string };

export async function clientLoader(): Promise<{ models: Model[]; defaultModel: string }> {
  const res = await fetch('/api/chat/models');
  if (!res.ok) return { models: [], defaultModel: 'claude-haiku-4-5' };
  const data = await res.json();
  return { models: data.models ?? [], defaultModel: data.default ?? 'claude-haiku-4-5' };
}

export function meta({}: Route.MetaArgs): Array<Record<string, string>> {
  return [{ title: 'Asistente ODEPA' }];
}

export default function Home(): ReactElement | null {
  const { models, defaultModel } = useLoaderData<typeof clientLoader>();
  const { session, user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  // ── Estado del modelo ─────────────────────────────────────────────────────
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [input, setInput] = useState('');

  // ── Estado de threads ─────────────────────────────────────────────────────
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [loadingThreads, setLoadingThreads] = useState(false);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !session) navigate('/login');
  }, [authLoading, session, navigate]);

  // ── Cargar threads al autenticarse ────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    setLoadingThreads(true);
    authFetch('/api/threads')
      .then((r) => r.json())
      .then((data) => {
        const list: Thread[] = data.threads ?? [];
        setThreads(list);
        if (list.length > 0) setActiveThreadId(list[0].id);
      })
      .finally(() => setLoadingThreads(false));
  }, [session]);

  // ── Transport con auth dinámica ───────────────────────────────────────────
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        headers: async (): Promise<Record<string, string>> => {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.access_token) {
            return { Authorization: `Bearer ${session.access_token}` };
          }
          return {};
        },
      }),
    []
  );

  const { messages, sendMessage, setMessages, status, error } = useChat({ transport });
  const isLoading = status === 'submitted' || status === 'streaming';

  // ── Cargar mensajes cuando cambia el thread activo ────────────────────────
  useEffect(() => {
    if (!activeThreadId || !session) return;
    authFetch(`/api/threads/${activeThreadId}/messages`)
      .then((r) => r.json())
      .then((data) => {
        const msgs = (data.messages ?? []) as UIMessage[];
        setMessages(msgs);
      });
  }, [activeThreadId, session, setMessages]);

  // ── Crear nueva conversación ──────────────────────────────────────────────
  const handleNewConversation = useCallback(async () => {
    const id = crypto.randomUUID();
    await authFetch(`/api/threads/${id}`, { method: 'POST' });
    const newThread: Thread = {
      id,
      title: 'Nueva conversación',
      archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(id);
    setMessages([]);
    setInput('');
  }, [setMessages]);

  // ── Seleccionar thread ────────────────────────────────────────────────────
  function handleSelectThread(id: string): void {
    if (id === activeThreadId) return;
    setActiveThreadId(id);
    setInput('');
  }

  // ── Eliminar thread ───────────────────────────────────────────────────────
  async function handleDeleteThread(id: string): Promise<void> {
    await authFetch(`/api/threads/${id}`, { method: 'DELETE' });
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (activeThreadId === id) {
      const remaining = threads.filter((t) => t.id !== id);
      if (remaining.length > 0) {
        setActiveThreadId(remaining[0].id);
      } else {
        setActiveThreadId(null);
        setMessages([]);
      }
    }
  }

  // ── Cambiar modelo ────────────────────────────────────────────────────────
  function handleModelChange(modelId: string): void {
    setSelectedModel(modelId);
    setMessages([]);
    setInput('');
  }

  // ── Enviar mensaje ────────────────────────────────────────────────────────
  async function handleSubmit(): Promise<void> {
    if (!input.trim() || isLoading) return;

    // Si no hay thread activo, crear uno automáticamente
    let threadId = activeThreadId;
    if (!threadId && session) {
      const id = crypto.randomUUID();
      await authFetch(`/api/threads/${id}`, { method: 'POST' });
      const newThread: Thread = {
        id,
        title: 'Nueva conversación',
        archived: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(id);
      threadId = id;
    }

    const text = input;
    setInput('');
    sendMessage({ text }, { body: { modelId: selectedModel, threadId: threadId ?? undefined } });

    // Actualizar título del thread con el primer mensaje si sigue siendo el default
    if (threadId && messages.length === 0) {
      const title = text.slice(0, 60);
      authFetch(`/api/threads/${threadId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title }),
      });
      setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, title } : t)));
    }
  }

  // ── Splash mientras carga la sesión ───────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-3xl animate-pulse">🌿</span>
      </div>
    );
  }

  if (!session) return null;

  return (
    <ChatLayout
      sidebar={
        <Sidebar
          threads={threads}
          activeThreadId={activeThreadId}
          loading={loadingThreads}
          user={user}
          onSelectThread={handleSelectThread}
          onNewConversation={handleNewConversation}
          onDeleteThread={handleDeleteThread}
          onSignOut={signOut}
        />
      }
      models={models}
      selectedModel={selectedModel}
      onModelChange={handleModelChange}
      isStreaming={isLoading}
    >
      <MessageList messages={messages} isLoading={isLoading} error={error} />
      <ChatInput value={input} onChange={setInput} onSubmit={handleSubmit} isLoading={isLoading} />
    </ChatLayout>
  );
}
