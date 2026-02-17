'use client';

import React from 'react';
import RegenmonSVG from '@/components/regenmon/RegenmonSVG';
import GameBackground from '@/components/game/GameBackground';
import { RegenmonType, RegenmonStats } from '@/lib/types';

const TYPES: RegenmonType[] = ['rayo', 'flama', 'hielo'];
const TYPE_LABELS: Record<RegenmonType, string> = {
  rayo: '⚡ Rayo',
  flama: '🔥 Flama',
  hielo: '❄️ Hielo',
};

const STATES: { name: string; stats: Omit<RegenmonStats, 'fragmentos'> & { fragmentos?: number } }[] = [
  { name: 'Eufórico (avg≥90)', stats: { espiritu: 95, pulso: 95, esencia: 95 } },
  { name: 'Contento (avg≥70)', stats: { espiritu: 80, pulso: 75, esencia: 70 } },
  { name: 'Neutro (avg≥30)', stats: { espiritu: 50, pulso: 50, esencia: 50 } },
  { name: 'Decaído (avg≥10)', stats: { espiritu: 20, pulso: 15, esencia: 15 } },
  { name: 'Crítico (avg<10)', stats: { espiritu: 5, pulso: 5, esencia: 5 } },
  { name: 'Sin Esperanza (🔮<10)', stats: { espiritu: 5, pulso: 50, esencia: 50 } },
  { name: 'Sin Energía (💛<10)', stats: { espiritu: 50, pulso: 5, esencia: 50 } },
  { name: 'Sin Nutrición (🌱<10)', stats: { espiritu: 50, pulso: 50, esencia: 5 } },
];

export default function PreviewPage() {
  return (
    <div style={{ background: '#111', color: 'white', padding: '20px', fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
      <h1 style={{ fontSize: '16px', marginBottom: '30px', textAlign: 'center' }}>
        🎨 Sprite & Background Preview — Phase 40
      </h1>

      {/* SPRITES GRID */}
      <h2 style={{ fontSize: '14px', marginBottom: '20px', borderBottom: '2px solid #444', paddingBottom: '10px' }}>
        Sprites (8 estados × 3 tipos = 24)
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: `120px repeat(${TYPES.length}, 1fr)`, gap: '8px', marginBottom: '40px' }}>
        {/* Header row */}
        <div />
        {TYPES.map(t => (
          <div key={t} style={{ textAlign: 'center', padding: '8px', background: '#222', borderRadius: '4px' }}>
            {TYPE_LABELS[t]}
          </div>
        ))}
        
        {/* State rows */}
        {STATES.map(state => (
          <React.Fragment key={state.name}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '4px', background: '#1a1a2e', borderRadius: '4px', fontSize: '8px' }}>
              {state.name}
            </div>
            {TYPES.map(type => (
              <div key={`${type}-${state.name}`} style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                background: '#1a1a2e',
                borderRadius: '4px',
                padding: '10px',
                minHeight: '120px'
              }}>
                <RegenmonSVG 
                  type={type} 
                  stats={{ ...state.stats, fragmentos: 50 } as RegenmonStats} 
                  size={100} 
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* BACKGROUNDS */}
      <h2 style={{ fontSize: '14px', marginBottom: '20px', borderBottom: '2px solid #444', paddingBottom: '10px' }}>
        Backgrounds (Dark Theme)
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '30px' }}>
        {TYPES.map(type => (
          <div key={type}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>{TYPE_LABELS[type]}</div>
            {['Good', 'Neutral', 'Bad'].map((mood, i) => {
              const statsMap = [
                { espiritu: 90, pulso: 90, esencia: 90, fragmentos: 50 },
                { espiritu: 50, pulso: 50, esencia: 50, fragmentos: 50 },
                { espiritu: 10, pulso: 10, esencia: 10, fragmentos: 50 },
              ];
              return (
                <div key={mood} style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '8px', marginBottom: '4px' }}>{mood}</div>
                  <div style={{ position: 'relative', width: '100%', height: '150px', borderRadius: '4px', overflow: 'hidden', border: '2px solid #333' }}>
                    <GameBackground type={type} stats={statsMap[i] as RegenmonStats} theme="dark" />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* BACKGROUNDS LIGHT */}
      <h2 style={{ fontSize: '14px', marginBottom: '20px', borderBottom: '2px solid #444', paddingBottom: '10px' }}>
        Backgrounds (Light Theme — GBC)
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '30px' }}>
        {TYPES.map(type => (
          <div key={type}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>{TYPE_LABELS[type]}</div>
            {['Good', 'Neutral', 'Bad'].map((mood, i) => {
              const statsMap = [
                { espiritu: 90, pulso: 90, esencia: 90, fragmentos: 50 },
                { espiritu: 50, pulso: 50, esencia: 50, fragmentos: 50 },
                { espiritu: 10, pulso: 10, esencia: 10, fragmentos: 50 },
              ];
              return (
                <div key={mood} style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '8px', marginBottom: '4px' }}>{mood}</div>
                  <div style={{ position: 'relative', width: '100%', height: '150px', borderRadius: '4px', overflow: 'hidden', border: '2px solid #ccc' }}>
                    <GameBackground type={type} stats={statsMap[i] as RegenmonStats} theme="light" />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: '#666', marginTop: '30px' }}>
        Preview page — will be removed before deploy
      </p>
    </div>
  );
}
