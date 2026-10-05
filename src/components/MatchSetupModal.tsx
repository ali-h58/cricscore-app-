import React, { useState } from 'react';
import { Match, MatchFormat, Team } from '../types/cricket';
import { DEFAULT_TEAMS } from '../data/defaultTeams';
import { createEmptyInnings } from '../services/cricketEngine';
import { Shield, Coins } from 'lucide-react';

interface MatchSetupModalProps {
  onClose: () => void;
  onMatchCreated: (match: Match) => void;
}

export const MatchSetupModal: React.FC<MatchSetupModalProps> = ({
  onClose,
  onMatchCreated,
}) => {
  const [selectedTeamAId, setSelectedTeamAId] = useState<string>(DEFAULT_TEAMS[0].id);
  const [selectedTeamBId, setSelectedTeamBId] = useState<string>(DEFAULT_TEAMS[1].id);
  const [format, setFormat] = useState<MatchFormat>('T20');
  const [customOvers, setCustomOvers] = useState<number>(20);
  const [venue, setVenue] = useState<string>('Kensington Oval, Barbados');
  const [tossWinnerTeam, setTossWinnerTeam] = useState<'teamA' | 'teamB'>('teamB');
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl'>('bowl');

  const teamA = DEFAULT_TEAMS.find((t) => t.id === selectedTeamAId) || DEFAULT_TEAMS[0];
  const teamB = DEFAULT_TEAMS.find((t) => t.id === selectedTeamBId) || DEFAULT_TEAMS[1];

  const handleStartMatch = (e: React.FormEvent) => {
    e.preventDefault();

    const overs = format === 'T20' ? 20 : format === 'ODI' ? 50 : customOvers;
    const tossWinnerId = tossWinnerTeam === 'teamA' ? teamA.id : teamB.id;

    // Batting first team
    let battingFirstTeam = teamA;
    let bowlingFirstTeam = teamB;

    if (
      (tossWinnerTeam === 'teamA' && tossDecision === 'bowl') ||
      (tossWinnerTeam === 'teamB' && tossDecision === 'bat')
    ) {
      battingFirstTeam = teamB;
      bowlingFirstTeam = teamA;
    }

    const inn1 = createEmptyInnings(
      1,
      battingFirstTeam.id,
      bowlingFirstTeam.id,
      battingFirstTeam.squad.filter((p) => battingFirstTeam.playingXI.includes(p.id)),
      bowlingFirstTeam.squad.filter((p) => bowlingFirstTeam.playingXI.includes(p.id))
    );

    const inn2 = createEmptyInnings(
      2,
      bowlingFirstTeam.id,
      battingFirstTeam.id,
      bowlingFirstTeam.squad.filter((p) => bowlingFirstTeam.playingXI.includes(p.id)),
      battingFirstTeam.squad.filter((p) => battingFirstTeam.playingXI.includes(p.id))
    );

    const newMatch: Match = {
      id: `match-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: `${teamA.name} vs ${teamB.name}`,
      format,
      totalOvers: overs,
      date: new Date().toISOString().split('T')[0],
      time: '19:30',
      venue,
      teamA,
      teamB,
      toss: {
        winnerTeamId: tossWinnerId,
        decision: tossDecision,
      },
      status: 'live',
      currentInningsIndex: 0,
      innings: [inn1, inn2],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onMatchCreated(newMatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Create New Match & Toss</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        <form onSubmit={handleStartMatch} className="space-y-4 text-left">
          {/* Teams Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Team A
              </label>
              <select
                value={selectedTeamAId}
                onChange={(e) => setSelectedTeamAId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
              >
                {DEFAULT_TEAMS.map((t) => (
                  <option key={t.id} value={t.id} disabled={t.id === selectedTeamBId}>
                    {t.name} ({t.shortName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Team B
              </label>
              <select
                value={selectedTeamBId}
                onChange={(e) => setSelectedTeamBId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
              >
                {DEFAULT_TEAMS.map((t) => (
                  <option key={t.id} value={t.id} disabled={t.id === selectedTeamAId}>
                    {t.name} ({t.shortName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Format & Overs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Match Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as MatchFormat)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
              >
                <option value="T20">T20 (20 Overs)</option>
                <option value="ODI">ODI (50 Overs)</option>
                <option value="CUSTOM">Custom Overs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Total Overs
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={format === 'T20' ? 20 : format === 'ODI' ? 50 : customOvers}
                disabled={format !== 'CUSTOM'}
                onChange={(e) => setCustomOvers(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none disabled:opacity-60"
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Venue / Stadium
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Melbourne Cricket Ground"
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Toss (Phase 2) */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Coins className="w-4 h-4" />
              <span>Toss Result & Decision</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Toss Winner:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTossWinnerTeam('teamA')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border ${
                    tossWinnerTeam === 'teamA'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {teamA.name}
                </button>
                <button
                  type="button"
                  onClick={() => setTossWinnerTeam('teamB')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border ${
                    tossWinnerTeam === 'teamB'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {teamB.name}
                </button>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Elected to:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTossDecision('bat')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border ${
                    tossDecision === 'bat'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  Bat First
                </button>
                <button
                  type="button"
                  onClick={() => setTossDecision('bowl')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border ${
                    tossDecision === 'bowl'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  Bowl First
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              Start Match & Scorecard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
