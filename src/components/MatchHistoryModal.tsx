import React, { useState } from 'react';
import { Match } from '../types/cricket';
import {
  getMatchHistory,
  deleteMatchFromHistory,
  duplicateMatch,
  saveCurrentMatch,
} from '../services/storage';
import { History, Play, Trash2, Copy, Filter } from 'lucide-react';

interface MatchHistoryModalProps {
  currentMatch: Match;
  onClose: () => void;
  onResumeMatch: (match: Match) => void;
}

export const MatchHistoryModal: React.FC<MatchHistoryModalProps> = ({
  currentMatch,
  onClose,
  onResumeMatch,
}) => {
  const [history, setHistory] = useState<Match[]>(getMatchHistory());
  const [filter, setFilter] = useState<'all' | 'live' | 'completed'>('all');

  const filtered = history.filter((m) => {
    if (filter === 'live') return m.status === 'live';
    if (filter === 'completed') return m.status === 'completed';
    return true;
  });

  const handleDelete = (id: string) => {
    if (id === currentMatch.id) {
      alert('Cannot delete the currently active match. Resume another match first.');
      return;
    }
    deleteMatchFromHistory(id);
    setHistory(getMatchHistory());
  };

  const handleDuplicate = (match: Match) => {
    const copy = duplicateMatch(match);
    setHistory(getMatchHistory());
    onResumeMatch(copy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Auto-Saved Matches & History</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                filter === 'all' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilter('live')}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                filter === 'live' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live / Unfinished
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                filter === 'completed' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed
            </button>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Auto-saved each ball</span>
        </div>

        {/* Matches List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matches found in this category.
            </div>
          ) : (
            filtered.map((m) => {
              const inn1 = m.innings[0];
              const isCurrent = m.id === currentMatch.id;

              return (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{m.title}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.status === 'completed'
                              ? 'bg-slate-700 text-slate-300'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {m.status}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">
                            (Active)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-mono">
                        {m.teamA.shortName} {inn1.totalRuns}/{inn1.totalWickets} ({inn1.oversCompleted}.{inn1.ballsInCurrentOver} ov)
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {m.venue} · {m.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onResumeMatch(m);
                          onClose();
                        }}
                        title="Resume match"
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(m)}
                        title="Duplicate match"
                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(m.id)}
                        title="Delete match"
                        className="p-2 rounded-lg bg-slate-700 hover:bg-rose-600 text-slate-200 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
