import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationOverlayProps {
  type: 'four' | 'six' | 'wicket' | 'fifty' | 'hundred' | 'match_won' | 'over_completed' | null;
  text?: string;
  subtext?: string;
  onClose: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  type,
  text,
  subtext,
  onClose,
}) => {
  useEffect(() => {
    if (!type) return;

    if (type === 'six' || type === 'fifty' || type === 'hundred' || type === 'match_won') {
      try {
        confetti({
          particleCount: type === 'match_won' ? 120 : 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00b875', '#ffbb00', '#00529b', '#ffffff', '#ff4d4d'],
        });
      } catch (e) {
        // graceful fallback if canvas-confetti fails
      }
    }

    const timer = setTimeout(() => {
      onClose();
    }, type === 'match_won' ? 3500 : 1800);

    return () => clearTimeout(timer);
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer transition-opacity animate-fade-in"
    >
      <div className="relative flex flex-col items-center justify-center p-8 text-center transform scale-100 transition-transform">
        {type === 'six' && (
          <div className="flex flex-col items-center">
            <div className="relative mb-3 flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-2xl shadow-yellow-500/50 ring-4 ring-yellow-300 animate-bounce">
              <span className="text-6xl font-black text-slate-950 tracking-tighter">6</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-wider text-yellow-400 drop-shadow-md">
              MAXIMUM!
            </h2>
            <p className="text-sm font-medium text-amber-200 mt-1">Out of the stadium!</p>
          </div>
        )}

        {type === 'four' && (
          <div className="flex flex-col items-center">
            <div className="relative mb-3 flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-300 shadow-2xl shadow-emerald-500/50 ring-4 ring-emerald-300 animate-pulse">
              <span className="text-6xl font-black text-slate-950 tracking-tighter">4</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-wider text-emerald-400 drop-shadow-md">
              FOUR!
            </h2>
            <p className="text-sm font-medium text-emerald-200 mt-1">Cracking boundary to the rope!</p>
          </div>
        )}

        {type === 'wicket' && (
          <div className="flex flex-col items-center">
            <div className="relative mb-3 flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-red-700 via-rose-600 to-red-400 shadow-2xl shadow-red-500/60 ring-4 ring-rose-400 animate-pulse">
              <span className="text-4xl font-black text-white tracking-widest">W</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-wider text-rose-500 drop-shadow-md">
              WICKET!
            </h2>
            <p className="text-sm font-medium text-rose-200 mt-1">{text || 'Big breakthrough for the bowling side!'}</p>
          </div>
        )}

        {type === 'fifty' && (
          <div className="flex flex-col items-center">
            <div className="relative mb-3 flex items-center justify-center px-6 py-4 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-blue-400 shadow-2xl shadow-indigo-500/50 ring-4 ring-indigo-300 animate-bounce">
              <span className="text-5xl font-black text-white tracking-tight">50</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-wider text-indigo-300 drop-shadow-md">
              HALF CENTURY!
            </h2>
            <p className="text-sm font-medium text-indigo-100 mt-1">{text || 'Superb knock under pressure!'}</p>
          </div>
        )}

        {type === 'hundred' && (
          <div className="flex flex-col items-center">
            <div className="relative mb-3 flex items-center justify-center px-8 py-5 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 shadow-2xl shadow-amber-400/60 ring-4 ring-yellow-200 animate-bounce">
              <span className="text-5xl font-black text-slate-950 tracking-tight">100</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-wider text-yellow-300 drop-shadow-md">
              MAGNIFICENT CENTURY!
            </h2>
            <p className="text-sm font-medium text-yellow-100 mt-1">{text || 'Raise your bat to a masterclass!'}</p>
          </div>
        )}

        {type === 'over_completed' && (
          <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Over Complete</span>
            <h2 className="text-2xl font-bold text-white mt-1">{text || 'Change of bowling end'}</h2>
            <p className="text-xs text-slate-400 mt-1">Rotate strike and select next bowler</p>
          </div>
        )}

        {type === 'match_won' && (
          <div className="flex flex-col items-center">
            <div className="mb-4 text-6xl">🏆</div>
            <h2 className="text-4xl font-black tracking-tight text-white drop-shadow-lg">
              {text || 'MATCH WON!'}
            </h2>
            <p className="text-base font-semibold text-emerald-400 mt-2">{subtext}</p>
          </div>
        )}
      </div>
    </div>
  );
};
