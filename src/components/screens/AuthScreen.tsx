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
    <div className="auth-screen fixed inset-0 flex flex-col items-center justify-center" style={{ padding: '3vh 5vw', zIndex: 75, backgroundColor: '#1a1a2e' }}>
      {/* Scanlines */}
      <div className="creation-screen__scanlines" />

      <h1 className="text-white text-center" style={{ fontSize: 'clamp(18px, 4vw, 28px)', marginBottom: '2vh', fontFamily: 'var(--font-press-start-2p)', zIndex: 2 }}>🌟 ¡La Conexión!</h1>
      <p className="text-gray-300 text-center leading-relaxed" style={{ fontSize: 'clamp(9px, 1.8vw, 14px)', marginBottom: '4vh', maxWidth: '500px', fontFamily: 'var(--font-press-start-2p)', lineHeight: 1.6, zIndex: 2 }}>
        Para sincronizar tu aventura entre dispositivos, inicia sesión. 
        O continúa sin cuenta para jugar solo en este navegador.
      </p>

      <div className="flex flex-col items-center" style={{ gap: '2vh', maxWidth: '400px', width: '100%', zIndex: 2 }}>
        <button
          onClick={handleLogin}
          className="nes-btn is-success w-full"
          style={{ fontSize: 'clamp(10px, 2vw, 14px)', padding: 'clamp(10px, 2vh, 18px) clamp(16px, 3vw, 32px)' }}
        >
          🔗 Iniciar Sesión
        </button>
        
        <span className="text-gray-400" style={{ fontSize: 'clamp(8px, 1.5vw, 11px)', fontFamily: 'var(--font-press-start-2p)' }}>↕️ Progreso sincronizado</span>

        <button
          onClick={onContinueWithoutAccount}
          className="nes-btn w-full"
          style={{ fontSize: 'clamp(10px, 2vw, 14px)', padding: 'clamp(10px, 2vh, 18px) clamp(16px, 3vw, 32px)' }}
        >
          Continuar sin cuenta
        </button>
      </div>

      <div className="text-center text-gray-500" style={{ marginTop: '4vh', fontSize: 'clamp(7px, 1.3vw, 10px)', fontFamily: 'var(--font-press-start-2p)', zIndex: 2 }}>
        <p>🌐 Con cuenta: datos en la nube</p>
        <p style={{ marginTop: '0.5vh' }}>💻 Sin cuenta: solo este dispositivo</p>
      </div>
    </div>
  );
}