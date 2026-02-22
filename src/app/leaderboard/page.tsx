'use client';

import { useState, useEffect, useMemo } from 'react';
import { useHub, HubLeaderboardEntry } from '@/hooks/useHub';
import { hubPointsToFractura, fracturaShort, fracturaName } from '@/hooks/useHubSync';
import { STORAGE_KEYS } from '@/lib/constants';
import Link from 'next/link';

type SortMode = 'points' | 'balance' | 'newest';
type FracturaFilter = 'all' | '0' | '1' | '2' | '3' | '4';

export default function LeaderboardPage() {
  const [allEntries, setAllEntries] = useState<HubLeaderboardEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('points');
  const [fracturaFilter, setFracturaFilter] = useState<FracturaFilter>('all');
  const [myHubId, setMyHubId] = useState<string | null>(null);

  const { getLeaderboard } = useHub();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMyHubId(localStorage.getItem(STORAGE_KEYS.HUB_REGENMON_ID));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    // Fetch more to allow client-side filtering
    getLeaderboard(page, 10).then(res => {
      if (res?.data) {
        setAllEntries(res.data);
        setTotalPages(res.pagination?.totalPages ?? 1);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  }, [page, getLeaderboard]);

  const entries = useMemo(() => {
    let filtered = [...allEntries];

    // Filter by fractura (derived from HUB points)
    if (fracturaFilter !== 'all') {
      const targetFractura = parseInt(fracturaFilter);
      filtered = filtered.filter(e => hubPointsToFractura(e.totalPoints) === targetFractura);
    }

    // Sort
    if (sortMode === 'points') {
      filtered.sort((a, b) => b.totalPoints - a.totalPoints);
    } else if (sortMode === 'balance') {
      filtered.sort((a, b) => b.balance - a.balance);
    }
    // 'newest' keeps API order (already sorted by registration)

    return filtered;
  }, [allEntries, sortMode, fracturaFilter]);

  const rankIcon = (idx: number) => {
    if (idx === 0) return '🥇';
    if (idx === 1) return '🥈';
    if (idx === 2) return '🥉';
    return `#${idx + 1}`;
  };

  // Override body overflow:hidden for this page
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'hidden'; };
  }, []);

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-page__header">
        <Link href="/" className="leaderboard-page__back">← Volver</Link>
        <h1 className="leaderboard-page__title">🏆 Regeneración Global</h1>
      </div>

      {/* Filters & Sort (Level 4 I) */}
      <div className="leaderboard-page__filters">
        <div className="leaderboard-page__sort">
          {(['points', 'balance', 'newest'] as SortMode[]).map(mode => (
            <button
              key={mode}
              className={`leaderboard-page__filter-btn ${sortMode === mode ? 'leaderboard-page__filter-btn--active' : ''}`}
              onClick={() => setSortMode(mode)}
            >
              {mode === 'points' ? '⭐ Progreso' : mode === 'balance' ? '💠 Fragmentos' : '🆕 Nuevos'}
            </button>
          ))}
        </div>
        <div className="leaderboard-page__stage-filter">
          {(['all', '0', '1', '2', '3', '4'] as FracturaFilter[]).map(sf => (
            <button
              key={sf}
              className={`leaderboard-page__filter-btn ${fracturaFilter === sf ? 'leaderboard-page__filter-btn--active' : ''}`}
              onClick={() => setFracturaFilter(sf)}
            >
              {sf === 'all' ? 'Todos' : `F${sf}`}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <p className="leaderboard-page__loading">Cargando ranking...</p>
      )}

      {error && (
        <p className="leaderboard-page__error">El HUB está descansando, intenta después 🍎</p>
      )}

      {!loading && !error && (
        <>
          {entries.length === 0 && (
            <p className="leaderboard-page__loading">No hay Regenmons en esta etapa.</p>
          )}

          <div className="leaderboard-page__list">
            {entries.map((entry, idx) => (
              <Link
                key={entry.id}
                href={`/regenmon/${entry.id}`}
                className={`leaderboard-card ${entry.id === myHubId ? 'leaderboard-card--me' : ''}`}
              >
                <span className="leaderboard-card__rank">{rankIcon(idx)}</span>
                <img
                  src={entry.sprite}
                  alt={entry.name}
                  className="leaderboard-card__sprite"
                  width={48}
                  height={48}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/sprites/rayo-base.webp'; }}
                />
                <div className="leaderboard-card__info">
                  <span className="leaderboard-card__name">
                    {entry.name}
                    {entry.id === myHubId && <span className="leaderboard-card__me-tag"> (tú)</span>}
                  </span>
                  <span className="leaderboard-card__owner">by {entry.ownerName}</span>
                  <span className="leaderboard-card__stage">{fracturaShort(hubPointsToFractura(entry.totalPoints))}</span>
                </div>
                <div className="leaderboard-card__stats">
                  <span className="leaderboard-card__points">⭐ {Math.round(entry.totalPoints / 2.5)}</span>
                  <span className="leaderboard-card__balance">💠 {entry.balance}</span>
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
