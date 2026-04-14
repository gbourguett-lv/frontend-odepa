import { useState, useEffect, type ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/auth';

export function meta(): Array<Record<string, string>> {
  return [{ title: 'Ingresar — Asistente ODEPA' }];
}

export default function Login(): ReactElement | null {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Si ya está autenticado, redirigir al home
  useEffect(() => {
    if (!loading && session) navigate('/');
  }, [session, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({ email, password });
      setSubmitting(false);
      if (error) {
        setError(error.message);
      } else {
        setInfo('Revisá tu correo para confirmar la cuenta.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setSubmitting(false);
      if (error) {
        setError(error.message);
      } else {
        navigate('/');
      }
    }
  }

  async function handleOAuth(provider: 'google' | 'azure') {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  }

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-white text-xl font-bold mb-3">
            🌿
          </div>
          <h1 className="text-lg font-semibold text-foreground">Asistente ODEPA</h1>
          <p className="text-sm text-muted-foreground mt-1">Precios mayoristas de Chile</p>
        </div>

        {/* Formulario */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-5">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>

          {/* OAuth */}
          <div className="flex flex-col gap-2 mb-5">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <GoogleIcon />
              Continuar con Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('azure')}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <MicrosoftIcon />
              Continuar con Microsoft
            </button>
          </div>

          <div className="relative flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">o</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />

            {error && <p className="text-xs text-destructive">{error}</p>}
            {info && <p className="text-xs text-green-600">{info}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {submitting
                ? 'Procesando...'
                : mode === 'login'
                  ? 'Ingresar'
                  : 'Crear cuenta'}
            </button>
          </form>
        </div>

        {/* Toggle */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
              setInfo(null);
            }}
            className="text-foreground underline underline-offset-2 hover:no-underline"
          >
            {mode === 'login' ? 'Registrarse' : 'Iniciar sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M11.4 24H0V12.6h11.4V24z" fill="#F25022" />
      <path d="M24 24H12.6V12.6H24V24z" fill="#00A4EF" />
      <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#7FBA00" />
      <path d="M24 11.4H12.6V0H24v11.4z" fill="#FFB900" />
    </svg>
  );
}
