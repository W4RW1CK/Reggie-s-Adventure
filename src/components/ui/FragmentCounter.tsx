'use client';

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
  const displayValue = isLoggedIn ? fragmentos : '---';
  
  return (
    <div className={`fragment-counter border-2 px-3 py-1 inline-flex items-center gap-1 ${className}`} style={{ backgroundColor: 'var(--theme-overlay)', borderColor: 'var(--theme-border-subtle)' }}>
      <span className="text-lg">💠</span>
      <span className="font-mono text-sm" style={{ color: 'var(--theme-text)' }}>
        {displayValue} Fragmentos
      </span>
    </div>
  );
}