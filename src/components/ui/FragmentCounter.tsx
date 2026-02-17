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
    <div className={`fragment-counter bg-black/60 border-2 border-white/25 px-3 py-1 inline-flex items-center gap-1 ${className}`}>
      <span className="text-lg">💠</span>
      <span className="font-mono text-sm text-white">
        {displayValue} Fragmentos
      </span>
    </div>
  );
}