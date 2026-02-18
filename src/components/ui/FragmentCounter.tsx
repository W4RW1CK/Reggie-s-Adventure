'use client';

import { useEffect, useRef, useState } from 'react';

interface FragmentCounterProps {
  fragmentos: number;
  isLoggedIn?: boolean;
  className?: string;
}

export default function FragmentCounter({ 
  fragmentos, 
  isLoggedIn = true, 
  className = '' 
}: FragmentCounterProps) {
  const displayValue = fragmentos ?? 0;
  const prevRef = useRef(fragmentos);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (prevRef.current !== fragmentos) {
      prevRef.current = fragmentos;
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 400);
      return () => clearTimeout(t);
    }
  }, [fragmentos]);
  
  return (
    <div className={`fragment-counter border-2 px-3 py-1 inline-flex items-center gap-1 ${pulse ? 'fragment-counter--pulse' : ''} ${className}`} style={{ backgroundColor: 'var(--theme-overlay)', borderColor: 'var(--theme-border-subtle)' }}>
      <span className="text-lg">💠</span>
      <span className="font-mono text-sm" style={{ color: 'var(--theme-text)' }}>
        {displayValue} Fragmentos
      </span>
    </div>
  );
}