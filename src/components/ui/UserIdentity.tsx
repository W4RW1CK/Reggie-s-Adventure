'use client';

interface UserIdentityProps {
  isLoggedIn: boolean;
  email?: string;
  playerName?: string;
}

export default function UserIdentity({ isLoggedIn, email, playerName }: UserIdentityProps) {
  if (!isLoggedIn) return null;

  const truncateEmail = (e: string, max = 15) => {
    if (e.length <= max) return e;
    const atIndex = e.indexOf('@');
    if (atIndex > 0) {
      const local = e.substring(0, Math.min(atIndex, max - 4));
      return `${local}@...`;
    }
    return e.substring(0, max - 1) + '…';
  };

  const displayName = playerName || (email ? truncateEmail(email) : null);
  if (!displayName) return null;

  return (
    <span
      className="text-xs px-2 py-1 inline-block transition-opacity duration-700"
      style={{ color: 'var(--theme-text-secondary, rgba(255,255,255,0.7))', backgroundColor: 'var(--theme-overlay-light)', fontFamily: 'var(--font-press-start, monospace)', fontSize: '0.6rem' }}
      key={playerName ? 'player' : 'email'}
    >
      {displayName}
    </span>
  );
}
