import React, { useState } from 'react';
import { Match, BallEvent } from '../types/cricket';
import { Clock, Filter } from 'lucide-react';

interface CommentaryTabProps {
  match: Match;
}

export const CommentaryTab: React.FC<CommentaryTabProps> = ({ match }) => {
  const [filter, setFilter] = useState<'all' | 'boundaries' | 'wickets'>('all');
  const currentInnings = match.innings[match.currentInningsIndex];
  const allBalls = [...currentInnings.balls].reverse();

  const filteredBalls = allBalls.filter((b) => {
    if (filter === 'boundaries') return b.runsBat === 4 || b.runsBat === 6;
    if (filter === 'wickets') return b.isWicket;
    return true;
  });

  return (
    <div className="w-full space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Ball-by-Ball Commentary
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
              filter === 'all' ? 'bg-emerald-600 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Balls
          </button>
          <button
            onClick={() => setFilter('boundaries')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
              filter === 'boundaries' ? 'bg-emerald-600 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            4s & 6s
          </button>
          <button
            onClick={() => setFilter('wickets')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
              filter === 'wickets' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Wickets
          </button>
        </div>
      </div>

      {/* Commentary Feed */}
      <div className="space-y-2">
        {filteredBalls.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-sm">
            No deliveries match this filter yet.
          </div>
        ) : (
          filteredBalls.map((b) => {
            const isFour = b.runsBat === 4;
            const isSix = b.runsBat === 6;
            const isWkt = b.isWicket;

            let badgeBg = 'bg-slate-800 text-slate-200 border-slate-700';
            let label = `${b.runsBat}`;

            if (isWkt) {
              badgeBg = 'bg-rose-600 text-white border-rose-500 font-bold';
              label = 'W';
            } else if (isSix) {
              badgeBg = 'bg-amber-500 text-slate-950 font-black border-amber-400';
              label = '6';
            } else if (isFour) {
              badgeBg = 'bg-emerald-500 text-slate-950 font-black border-emerald-400';
              label = '4';
            } else if (b.extraType === 'wide') {
              badgeBg = 'bg-indigo-900/80 text-indigo-300 border-indigo-700';
              label = `${b.runsExtra}Wd`;
            } else if (b.extraType === 'no_ball') {
              badgeBg = 'bg-yellow-900/80 text-yellow-300 border-yellow-700';
              label = `Nb`;
            }

            return (
              <div
                key={b.id}
                className={`p-3 rounded-xl border transition-all ${
                  isWkt
                    ? 'bg-rose-950/20 border-rose-800/60'
                    : isSix
                    ? 'bg-amber-950/20 border-amber-800/60'
                    : isFour
                    ? 'bg-emerald-950/20 border-emerald-800/60'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Delivery Pill */}
                  <div className="flex flex-col items-center shrink-0 w-12">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {b.overNumber}.{b.legalBallNumberInOver}
                    </span>
                    <span
                      className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border ${badgeBg}`}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Prose Commentary */}
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      {b.commentary}
                    </p>
                    {isWkt && b.dismissal && (
                      <span className="inline-block mt-1 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        Dismissal: {b.dismissal.desc}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
