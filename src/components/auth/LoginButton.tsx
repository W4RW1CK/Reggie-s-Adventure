'use client';

import { useAuth } from '@/hooks/useAuth';

interface LoginButtonProps {
  className?: string;
}

export function LoginButton({ className = '' }: LoginButtonProps) {
  const { isLoggedIn, user, login, logout, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className={`${className} opacity-50`}>
        <span className="text-sm">Cargando...</span>
      </div>
    );
  }

  if (isLoggedIn && user) {
    const displayName = user.name || user.email?.split('@')[0] || 'Usuario';
    const truncatedName = displayName.length > 12 ? displayName.substring(0, 12) + '...' : displayName;
    
    return (
      <div className={`${className} nes-container is-dark p-2`}>
        <div className="text-xs mb-1 text-green-400">
          👤 {truncatedName}
        </div>
        <button
          onClick={logout}
          className="nes-btn is-error text-xs"
          style={{ fontSize: '8px', padding: '4px 8px' }}
          aria-label="Cerrar sesión"
        >
          Salir
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={login}
        className="nes-btn is-success text-sm"
        aria-label="Iniciar sesión con Google, Email o Passkey"
      >
        🔗 Entrar
      </button>
    </div>
  );
}