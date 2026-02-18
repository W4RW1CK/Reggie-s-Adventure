'use client';

import { useAuth } from '@/hooks/useAuth';

interface AuthScreenProps {
  onLogin: () => void;
  onContinueWithoutAccount: () => void;
}

export default function AuthScreen({ 
  onLogin, 
  onContinueWithoutAccount 
}: AuthScreenProps) {
  const { login } = useAuth();

  const handleLogin = () => {
    login();
    onLogin();
  };

  return (
    <div className="auth-screen fixed inset-0 flex items-center justify-center overflow-y-auto bg-gradient-to-b from-gray-900 to-black" style={{ padding: 'clamp(8px, 2vw, 16px)', zIndex: 75 }}>
      <div className="nes-container is-dark max-w-md w-full my-auto">
        <div className="text-center" style={{ marginBottom: 'clamp(12px, 3vh, 24px)' }}>
          <h1 className="text-white" style={{ fontSize: 'clamp(14px, 3.5vw, 22px)', marginBottom: 'clamp(8px, 2vh, 16px)' }}>🌟 ¡La Conexión!</h1>
          <p className="text-gray-300 leading-relaxed" style={{ fontSize: 'clamp(10px, 2vw, 14px)', marginBottom: 'clamp(12px, 3vh, 24px)' }}>
            Para sincronizar tu aventura entre dispositivos, inicia sesión. 
            O continúa sin cuenta para jugar solo en este navegador.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="nes-btn is-success w-full text-sm"
            aria-label="Iniciar sesión para sincronizar progreso"
          >
            🔗 Iniciar Sesión
          </button>
          
          <div className="text-center text-xs text-gray-400 py-1">
            <span>↕️ Progreso sincronizado</span>
          </div>

          <button
            onClick={onContinueWithoutAccount}
            className="nes-btn is-normal w-full text-sm"
            aria-label="Continuar sin cuenta, progreso solo local"
          >
            Continuar sin cuenta
          </button>
        </div>

        <div className="text-center text-xs text-gray-500 mt-4 space-y-1">
          <p>🌐 Con cuenta: datos en la nube</p>
          <p>💻 Sin cuenta: solo este dispositivo</p>
        </div>
      </div>
    </div>
  );
}