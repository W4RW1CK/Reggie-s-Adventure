'use client';

import { useState, useEffect } from 'react';
import { useHub, HubLeaderboardEntry } from '@/hooks/useHub';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<HubLeaderboardEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { getLeaderboard } = useHub();

  useEffect(() => {
    setLoading(true);
    setError(false);
    getLeaderboard(page, 10).then(res => {
      if (res?.data) {
        setEntries(res.data);
        setTotalPages(res.pagination?.totalPages ?? 1);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  }, [page, getLeaderboard]);

  const rankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-page__header">
        <Link href="/" className="leaderboard-page__back">← Volver</Link>
        <h1 className="leaderboard-page__title">🏆 Regeneración Global</h1>
      </div>

      {loading && (
        <p className="leaderboard-page__loading">Cargando ranking...</p>
      )}

      {error && (
        <p className="leaderboard-page__error">El HUB está descansando, intenta después 🍎</p>
      )}

      {!loading && !error && (
        <>
          <div className="leaderboard-page__list">
            {entries.map(entry => (
              <Link
                key={entry.id}
                href={`/regenmon/${entry.id}`}
                className="leaderboard-card"
              >
                <span className="leaderboard-card__rank">{rankIcon(entry.rank)}</span>
                <img
                  src={entry.sprite}
                  alt={entry.name}
                  className="leaderboard-card__sprite"
                  width={48}
                  height={48}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/sprites/rayo-base.webp'; }}
                />
                <div className="leaderboard-card__info">
                  <span className="leaderboard-card__name">{entry.name}</span>
                  <span className="leaderboard-card__owner">by {entry.ownerName}</span>
                </div>
                <div className="leaderboard-card__stats">
                  <span className="leaderboard-card__points">⭐ {entry.totalPoints}</span>
                  <span className="leaderboard-card__balance">🍊 {entry.balance}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="leaderboard-page__pagination">
            <button
              className="leaderboard-page__page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              ← Anterior
            </button>
            <span className="leaderboard-page__page-info">{page} / {totalPages}</span>
            <button
              className="leaderboard-page__page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
