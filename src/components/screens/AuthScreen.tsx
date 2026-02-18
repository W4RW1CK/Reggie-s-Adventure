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
    <div className="auth-screen fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black" style={{ padding: '3vh 5vw', zIndex: 75 }}>
      <h1 className="text-white text-center" style={{ fontSize: 'clamp(14px, 3.5vw, 22px)', marginBottom: '2vh' }}>🌟 ¡La Conexión!</h1>
      <p className="text-gray-300 text-center leading-relaxed" style={{ fontSize: 'clamp(9px, 1.8vw, 13px)', marginBottom: '3vh', maxWidth: '80vw' }}>
        Para sincronizar tu aventura entre dispositivos, inicia sesión. 
        O continúa sin cuenta para jugar solo en este navegador.
      </p>

      <div className="w-full flex flex-col items-center" style={{ gap: '2vh', maxWidth: '80vw' }}>
        <button
          onClick={handleLogin}
          className="nes-btn is-success w-full"
          style={{ fontSize: 'clamp(10px, 2vw, 14px)', padding: '1.5vh 3vw' }}
        >
          🔗 Iniciar Sesión
        </button>
        
        <span className="text-gray-400" style={{ fontSize: 'clamp(8px, 1.5vw, 11px)' }}>↕️ Progreso sincronizado</span>

        <button
          onClick={onContinueWithoutAccount}
          className="nes-btn w-full"
          style={{ fontSize: 'clamp(10px, 2vw, 14px)', padding: '1.5vh 3vw' }}
        >
          Continuar sin cuenta
        </button>
      </div>

      <div className="text-center text-gray-500" style={{ marginTop: '3vh', fontSize: 'clamp(7px, 1.3vw, 10px)' }}>
        <p>🌐 Con cuenta: datos en la nube</p>
        <p>💻 Sin cuenta: solo este dispositivo</p>
      </div>
    </div>
  );
}