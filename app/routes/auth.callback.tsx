import { useEffect, type ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';

/**
 * Ruta de callback para OAuth (Google, Microsoft).
 * Supabase redirige aquí con un `code` en la query string (PKCE flow).
 * El cliente intercambia el code por una sesión y redirige al home.
 */
export default function AuthCallback(): ReactElement {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).finally(() => navigate('/'));
    } else {
      // Hash flow (implicit) — Supabase lo procesa automáticamente via getSession
      supabase.auth.getSession().finally(() => navigate('/'));
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <span className="text-3xl animate-pulse">🌿</span>
        <p className="text-sm">Autenticando...</p>
      </div>
    </div>
  );
}
