import React, { useEffect } from 'react';
import { Match } from '../types/cricket';
import { Award, Trophy, Share2, FileText, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultModalProps {
  match: Match;
  onClose: () => void;
  onPdfClick: () => void;
  onShareClick: () => void;
  onNewMatchClick: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  match,
  onClose,
  onPdfClick,
  onShareClick,
  onNewMatchClick,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (e) {}
  }, []);

  const result = match.result || {
    summary: 'Match Concluded',
    winMargin: '',
    resultType: 'won_by_runs',
    playerOfTheMatchName: 'Player of the Match',
    reason: 'Outstanding all-round performance',
  };

  const inn1 = match.innings[0];
  const inn2 = match.innings[1];
  const team1 = match.teamA.id === inn1.battingTeamId ? match.teamA : match.teamB;
  const team2 = match.teamA.id === inn2.battingTeamId ? match.teamA : match.teamB;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
        {/* Trophy & Victory Headline (Phase 10) */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-3xl shadow-lg shadow-yellow-500/30 mb-2">
            🏆
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Official Match Result
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            {result.summary}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {match.venue} · {match.date}
          </p>
        </div>

        {/* Scores Card */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 grid grid-cols-2 gap-4 font-mono text-left">
          <div className="border-r border-slate-700 pr-2">
            <span className="text-[11px] font-sans font-semibold text-slate-400 block">{team1.name}</span>
            <span className="text-xl font-black text-white block mt-0.5">
              {inn1.totalRuns}/{inn1.totalWickets}
            </span>
            <span className="text-[11px] text-slate-400 block">({inn1.oversCompleted}.{inn1.ballsInCurrentOver} ov)</span>
          </div>

          <div className="pl-2">
            <span className="text-[11px] font-sans font-semibold text-slate-400 block">{team2.name}</span>
            <span className="text-xl font-black text-white block mt-0.5">
              {inn2.totalRuns}/{inn2.totalWickets}
            </span>
            <span className="text-[11px] text-slate-400 block">({inn2.oversCompleted}.{inn2.ballsInCurrentOver} ov)</span>
          </div>
        </div>

        {/* Player of the Match Spotlight */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-800/80 to-emerald-950/40 border border-emerald-500/30 flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Player of the Match
            </span>
            <h4 className="text-base font-bold text-white">
              {result.playerOfTheMatchName || 'Virat Kohli'}
            </h4>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              {result.reason || '82 (51b, 6x4, 4x6)'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onPdfClick();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            PDF Report
          </button>

          <button
            onClick={() => {
              onClose();
              onShareClick();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            Share Scorecard
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              onClose();
              onNewMatchClick();
            }}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            Start New Match
          </button>
        </div>
      </div>
    </div>
  );
};
