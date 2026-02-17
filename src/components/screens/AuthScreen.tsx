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
    <div className="auth-screen min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="nes-container is-dark max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-xl mb-4 text-white">🌟 ¡La Conexión!</h1>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
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