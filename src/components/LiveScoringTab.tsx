import React, { useState } from 'react';
import {
  Match,
  DismissalType,
  ExtraType,
} from '../types/cricket';
import {
  scoreBall,
  switchStriker,
  changeBowler,
  startSecondInnings,
} from '../services/cricketEngine';
import { ArrowLeftRight, UserCheck, ShieldAlert, Award, ChevronRight } from 'lucide-react';

interface LiveScoringTabProps {
  match: Match;
  setMatch: React.Dispatch<React.SetStateAction<Match>>;
  triggerCelebration: (type: 'four' | 'six' | 'wicket' | 'fifty' | 'hundred' | 'match_won' | 'over_completed', text?: string) => void;
  onOpenResultModal: () => void;
}

export const LiveScoringTab: React.FC<LiveScoringTabProps> = ({
  match,
  setMatch,
  triggerCelebration,
  onOpenResultModal,
}) => {
  const currentInnings = match.innings[match.currentInningsIndex];
  const battingTeam = match.teamA.id === currentInnings.battingTeamId ? match.teamA : match.teamB;
  const bowlingTeam = match.teamA.id === currentInnings.bowlingTeamId ? match.teamA : match.teamB;

  // Wicket modal state
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [dismissalType, setDismissalType] = useState<DismissalType>('caught');
  const [playerOutId, setPlayerOutId] = useState<string>(currentInnings.currentStrikerId);
  const [fielderId, setFielderId] = useState<string>('');
  const [newBatterId, setNewBatterId] = useState<string>('');

  // Bowler change modal
  const [showBowlerModal, setShowBowlerModal] = useState(false);

  // Extras modal (custom extras or runs with bye/leg-bye)
  const [extraTypeSelected, setExtraTypeSelected] = useState<ExtraType | null>(null);

  // Striker & non-striker players
  const strikerStat = currentInnings.battingStats[currentInnings.currentStrikerId] || {
    playerName: 'Striker',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strikeRate: 0,
  };
  const nonStrikerStat = currentInnings.battingStats[currentInnings.currentNonStrikerId] || {
    playerName: 'Non-Striker',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strikeRate: 0,
  };
  const bowlerStat = currentInnings.bowlingStats[currentInnings.currentBowlerId] || {
    playerName: 'Bowler',
    oversString: '0.0',
    maidens: 0,
    runs: 0,
    wickets: 0,
    economy: 0,
  };

  // Run rates
  const legalOvers = currentInnings.totalLegalBalls / 6;
  const crr = legalOvers > 0 ? (currentInnings.totalRuns / legalOvers).toFixed(2) : '0.00';

  let rrr = '0.00';
  let target = 0;
  let runsNeeded = 0;
  let ballsRemaining = 0;

  if (match.currentInningsIndex === 1) {
    target = match.innings[0].totalRuns + 1;
    runsNeeded = Math.max(0, target - currentInnings.totalRuns);
    ballsRemaining = Math.max(0, match.totalOvers * 6 - currentInnings.totalLegalBalls);
    rrr = ballsRemaining > 0 ? ((runsNeeded / (ballsRemaining / 6))).toFixed(2) : '0.00';
  }

  // Handle runs scoring
  const handleScoreRuns = (runs: number) => {
    if (match.status === 'completed') {
      onOpenResultModal();
      return;
    }

    const prevStrikerRuns = strikerStat.runs;
    const res = scoreBall(match, { runsBat: runs });
    setMatch(res.match);

    // Celebrations
    if (runs === 6) {
      triggerCelebration('six');
    } else if (runs === 4) {
      triggerCelebration('four');
    }

    const updatedStriker = res.match.innings[res.match.currentInningsIndex].battingStats[currentInnings.currentStrikerId];
    if (updatedStriker) {
      if (prevStrikerRuns < 50 && updatedStriker.runs >= 50 && updatedStriker.runs < 100) {
        triggerCelebration('fifty', `${updatedStriker.playerName} brings up fifty!`);
      } else if (prevStrikerRuns < 100 && updatedStriker.runs >= 100) {
        triggerCelebration('hundred', `${updatedStriker.playerName} hits a sensational century!`);
      }
    }

    if (res.matchEnded) {
      triggerCelebration('match_won', res.match.result?.summary);
      setTimeout(() => onOpenResultModal(), 1800);
    } else if (res.overCompleted) {
      triggerCelebration('over_completed');
      setShowBowlerModal(true);
    }
  };

  // Handle Extras button click
  const handleExtraClick = (type: ExtraType) => {
    if (match.status === 'completed') return;

    if (type === 'wide') {
      const res = scoreBall(match, { runsBat: 0, runsExtra: 1, extraType: 'wide' });
      setMatch(res.match);
      if (res.matchEnded) {
        triggerCelebration('match_won', res.match.result?.summary);
        setTimeout(() => onOpenResultModal(), 1800);
      }
    } else if (type === 'no_ball') {
      // 1 run extra for no ball
      const res = scoreBall(match, { runsBat: 0, runsExtra: 1, extraType: 'no_ball' });
      setMatch(res.match);
      if (res.matchEnded) {
        triggerCelebration('match_won', res.match.result?.summary);
        setTimeout(() => onOpenResultModal(), 1800);
      }
    } else {
      // Bye or Leg bye
      setExtraTypeSelected(type);
    }
  };

  // Handle Bye / Leg Bye run confirmation
  const handleScoreByeRuns = (byeRuns: number) => {
    if (!extraTypeSelected) return;
    const res = scoreBall(match, {
      runsBat: 0,
      runsExtra: byeRuns,
      extraType: extraTypeSelected,
    });
    setMatch(res.match);
    setExtraTypeSelected(null);

    if (res.matchEnded) {
      triggerCelebration('match_won', res.match.result?.summary);
      setTimeout(() => onOpenResultModal(), 1800);
    } else if (res.overCompleted) {
      triggerCelebration('over_completed');
      setShowBowlerModal(true);
    }
  };

  // Confirm Wicket
  const handleConfirmWicket = () => {
    const res = scoreBall(match, {
      runsBat: 0,
      isWicket: true,
      dismissal: {
        type: dismissalType,
        playerOutId,
        fielderId: fielderId || undefined,
        bowlerId: currentInnings.currentBowlerId,
        desc: `${dismissalType}`,
      },
      newStrikerId: newBatterId || undefined,
    });

    setMatch(res.match);
    setShowWicketModal(false);
    triggerCelebration('wicket', `Out! Dismissed (${dismissalType})`);

    if (res.matchEnded) {
      triggerCelebration('match_won', res.match.result?.summary);
      setTimeout(() => onOpenResultModal(), 1800);
    } else if (res.overCompleted) {
      triggerCelebration('over_completed');
      setShowBowlerModal(true);
    }
  };

  // Switch Strike
  const handleSwitchStrike = () => {
    setMatch(switchStriker(match));
  };

  // Change Bowler
  const handleSelectBowler = (bId: string) => {
    setMatch(changeBowler(match, bId));
    setShowBowlerModal(false);
  };

  // Get available batters who haven't batted yet
  const usedBatterIds = new Set(
    Object.values(currentInnings.battingStats)
      .filter((s) => s.balls > 0 || s.isOut)
      .map((s) => s.playerId)
  );
  usedBatterIds.add(currentInnings.currentStrikerId);
  usedBatterIds.add(currentInnings.currentNonStrikerId);

  const availableBatters = battingTeam.squad.filter(
    (p) => battingTeam.playingXI.includes(p.id) && !usedBatterIds.has(p.id)
  );

  // Available bowlers (cannot be current bowler)
  const availableBowlers = bowlingTeam.squad.filter(
    (p) => bowlingTeam.playingXI.includes(p.id) && p.id !== currentInnings.currentBowlerId
  );

  // Recent deliveries of the current innings (last 12)
  const recentBalls = currentInnings.balls.slice(-12);

  return (
    <div className="w-full space-y-4">
      {/* Top Main Scorecard Banner (Cricbuzz Hero Style) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Teams & Score */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {match.format} · {match.venue}
              </span>
              {match.status === 'completed' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-200">
                  COMPLETED
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                {battingTeam.shortName}{' '}
                <span className="text-emerald-400">
                  {currentInnings.totalRuns}/{currentInnings.totalWickets}
                </span>
              </h1>
              <span className="text-base sm:text-lg font-medium text-slate-400 font-mono">
                ({currentInnings.oversCompleted}.{currentInnings.ballsInCurrentOver} / {match.totalOvers} ov)
              </span>
            </div>

            {match.currentInningsIndex === 1 ? (
              <p className="text-xs sm:text-sm font-semibold text-amber-300 mt-1">
                Target: {target} · Need {runsNeeded} runs in {ballsRemaining} balls (RRR: {rrr})
              </p>
            ) : (
              <p className="text-xs font-medium text-slate-400 mt-1">
                CRR: <span className="font-mono text-slate-200">{crr}</span> · Projected:{' '}
                <span className="font-mono text-slate-200">
                  {Math.round(currentInnings.totalRuns + Number(crr) * (match.totalOvers - legalOvers))}
                </span>
              </p>
            )}
          </div>

          {/* Match Status or Innings 1 score */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
            {match.currentInningsIndex === 1 && (
              <div className="text-left sm:text-right font-mono">
                <span className="text-xs text-slate-400">1st Innings: </span>
                <span className="text-sm font-bold text-slate-200">
                  {bowlingTeam.shortName} {match.innings[0].totalRuns}/{match.innings[0].totalWickets}
                </span>
              </div>
            )}

            {match.status === 'completed' ? (
              <button
                onClick={onOpenResultModal}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
              >
                <Award className="w-3.5 h-3.5" />
                View Match Result
              </button>
            ) : match.currentInningsIndex === 0 && currentInnings.oversCompleted >= match.totalOvers ? (
              <button
                onClick={() => setMatch(startSecondInnings(match))}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Start 2nd Innings <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Current Deliveries Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            Recent:
          </span>
          <div className="flex items-center gap-1.5">
            {recentBalls.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No balls bowled yet</span>
            ) : (
              recentBalls.map((b) => {
                let badgeColor = 'bg-slate-800 text-slate-200 border-slate-700';
                let label = `${b.runsBat}`;

                if (b.isWicket) {
                  badgeColor = 'bg-rose-600 text-white border-rose-500 font-bold animate-pulse';
                  label = 'W';
                } else if (b.runsBat === 6) {
                  badgeColor = 'bg-amber-500 text-slate-950 font-black border-amber-400';
                  label = '6';
                } else if (b.runsBat === 4) {
                  badgeColor = 'bg-emerald-500 text-slate-950 font-black border-emerald-400';
                  label = '4';
                } else if (b.extraType === 'wide') {
                  badgeColor = 'bg-indigo-900/80 text-indigo-300 border-indigo-700';
                  label = `${b.runsExtra}Wd`;
                } else if (b.extraType === 'no_ball') {
                  badgeColor = 'bg-yellow-900/80 text-yellow-300 border-yellow-700';
                  label = `Nb`;
                }

                return (
                  <span
                    key={b.id}
                    title={b.commentary}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border shadow-sm ${badgeColor}`}
                  >
                    {label}
                  </span>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Live Batters & Bowler Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Batters on Crease */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-semibold text-slate-400">
            <span>BATTERS</span>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="w-8 text-right">R</span>
              <span className="w-8 text-right">B</span>
              <span className="w-6 text-right">4s</span>
              <span className="w-6 text-right">6s</span>
              <span className="w-12 text-right">SR</span>
            </div>
          </div>

          {/* Striker */}
          <div className="flex items-center justify-between py-1.5 font-mono text-xs text-white bg-emerald-500/10 px-2 rounded-lg border border-emerald-500/20 mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-emerald-300 truncate">
                {strikerStat.playerName} *
              </span>
            </div>
            <div className="flex items-center gap-4 shrink-0 font-mono">
              <span className="w-8 text-right font-bold text-white">{strikerStat.runs}</span>
              <span className="w-8 text-right text-slate-400">{strikerStat.balls}</span>
              <span className="w-6 text-right text-slate-300">{strikerStat.fours}</span>
              <span className="w-6 text-right text-slate-300">{strikerStat.sixes}</span>
              <span className="w-12 text-right text-emerald-300 font-bold">
                {strikerStat.strikeRate}
              </span>
            </div>
          </div>

          {/* Non-Striker */}
          <div className="flex items-center justify-between py-1.5 font-mono text-xs text-slate-300 px-2 rounded-lg">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              <span className="font-medium truncate">{nonStrikerStat.playerName}</span>
            </div>
            <div className="flex items-center gap-4 shrink-0 font-mono">
              <span className="w-8 text-right font-bold text-white">{nonStrikerStat.runs}</span>
              <span className="w-8 text-right text-slate-400">{nonStrikerStat.balls}</span>
              <span className="w-6 text-right text-slate-300">{nonStrikerStat.fours}</span>
              <span className="w-6 text-right text-slate-300">{nonStrikerStat.sixes}</span>
              <span className="w-12 text-right text-slate-300 font-bold">
                {nonStrikerStat.strikeRate}
              </span>
            </div>
          </div>

          {/* Crease Quick Control */}
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <button
              onClick={handleSwitchStrike}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
              Swap Striker
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              Partnership: {currentInnings.currentPartnership.totalRuns} (
              {currentInnings.currentPartnership.totalBalls}b)
            </span>
          </div>
        </div>

        {/* Current Bowler */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-semibold text-slate-400">
            <span>CURRENT BOWLER</span>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="w-8 text-right">O</span>
              <span className="w-6 text-right">M</span>
              <span className="w-8 text-right">R</span>
              <span className="w-6 text-right">W</span>
              <span className="w-12 text-right">ECO</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 font-mono text-xs text-white">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="font-bold text-white truncate">{bowlerStat.playerName}</span>
            </div>
            <div className="flex items-center gap-4 shrink-0 font-mono">
              <span className="w-8 text-right text-slate-300">{bowlerStat.oversString}</span>
              <span className="w-6 text-right text-slate-400">{bowlerStat.maidens}</span>
              <span className="w-8 text-right text-slate-200">{bowlerStat.runs}</span>
              <span className="w-6 text-right font-black text-rose-400">{bowlerStat.wickets}</span>
              <span className="w-12 text-right text-amber-300 font-bold">{bowlerStat.economy}</span>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <button
              onClick={() => setShowBowlerModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              Change Bowler
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              Dots: {bowlerStat.dots} · Extras: {bowlerStat.wides + bowlerStat.noBalls}
            </span>
          </div>
        </div>
      </div>

      {/* Phase 3 Professional Keypad */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Scoring Keypad
          </span>
          <span className="text-xs text-slate-500 font-mono">Legal Ball Calculation: Active</span>
        </div>

        {/* Primary Runs Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 mb-3">
          {[0, 1, 2, 3, 4, 5, 6].map((num) => {
            const isFour = num === 4;
            const isSix = num === 6;
            return (
              <button
                key={num}
                onClick={() => handleScoreRuns(num)}
                className={`min-h-[52px] rounded-xl font-mono text-xl font-bold transition-all transform active:scale-95 shadow-md flex items-center justify-center ${
                  isSix
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black ring-2 ring-yellow-400/40'
                    : isFour
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black ring-2 ring-emerald-400/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Extras & Wicket Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            onClick={() => handleExtraClick('wide')}
            className="min-h-[46px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-indigo-700/60 text-indigo-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1 active:scale-95"
          >
            <span>Wide (+1)</span>
          </button>

          <button
            onClick={() => handleExtraClick('no_ball')}
            className="min-h-[46px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-yellow-700/60 text-yellow-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1 active:scale-95"
          >
            <span>No Ball (+1)</span>
          </button>

          <button
            onClick={() => handleExtraClick('bye')}
            className="min-h-[46px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1 active:scale-95"
          >
            <span>Bye</span>
          </button>

          <button
            onClick={() => handleExtraClick('leg_bye')}
            className="min-h-[46px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1 active:scale-95"
          >
            <span>Leg Bye</span>
          </button>

          <button
            onClick={() => {
              setPlayerOutId(currentInnings.currentStrikerId);
              setShowWicketModal(true);
            }}
            className="col-span-2 sm:col-span-1 min-h-[46px] rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>WICKET</span>
          </button>
        </div>
      </div>

      {/* WICKET MODAL */}
      {showWicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-base font-bold text-white">Record Wicket Dismissal</h3>
              </div>
              <button
                onClick={() => setShowWicketModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Who is Out? */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Player Dismissed
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPlayerOutId(currentInnings.currentStrikerId)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold truncate ${
                    playerOutId === currentInnings.currentStrikerId
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  Striker: {strikerStat.playerName}
                </button>
                <button
                  type="button"
                  onClick={() => setPlayerOutId(currentInnings.currentNonStrikerId)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold truncate ${
                    playerOutId === currentInnings.currentNonStrikerId
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  Non-Striker: {nonStrikerStat.playerName}
                </button>
              </div>
            </div>

            {/* Dismissal Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Dismissal Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['caught', 'bowled', 'lbw', 'run_out', 'stumped', 'hit_wicket'] as DismissalType[]).map(
                  (dType) => (
                    <button
                      key={dType}
                      type="button"
                      onClick={() => setDismissalType(dType)}
                      className={`p-2 rounded-lg border text-xs font-semibold capitalize ${
                        dismissalType === dType
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {dType.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Fielder Selection (if caught / run out / stumped) */}
            {(dismissalType === 'caught' || dismissalType === 'run_out' || dismissalType === 'stumped') && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Fielder / Catcher
                </label>
                <select
                  value={fielderId}
                  onChange={(e) => setFielderId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select Fielder (optional)</option>
                  {bowlingTeam.squad
                    .filter((p) => bowlingTeam.playingXI.includes(p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.isWicketkeeper ? '(WK)' : ''}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Next Batter */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Next Batter In
              </label>
              <select
                value={newBatterId}
                onChange={(e) => setNewBatterId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Auto-assign next from Playing XI</option>
                {availableBatters.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWicketModal(false)}
                className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmWicket}
                className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
              >
                Confirm Wicket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOWLER SELECT MODAL */}
      {showBowlerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Select Next Bowler</h3>
              <button
                onClick={() => setShowBowlerModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {availableBowlers.map((p) => {
                const bStat = currentInnings.bowlingStats[p.id];
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectBowler(p.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">{p.name}</span>
                      <span className="text-[10px] text-slate-400">{p.role}</span>
                    </div>
                    {bStat && (
                      <span className="text-xs font-mono text-emerald-400 font-semibold">
                        {bStat.wickets}/{bStat.runs} ({bStat.oversString} ov)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BYE / LEG BYE RUNS PICKER */}
      {extraTypeSelected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-white capitalize">
              How many {extraTypeSelected.replace('_', ' ')}s?
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((r) => (
                <button
                  key={r}
                  onClick={() => handleScoreByeRuns(r)}
                  className="py-3 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white font-mono font-bold text-base transition-colors"
                >
                  +{r}
                </button>
              ))}
            </div>
            <button
              onClick={() => setExtraTypeSelected(null)}
              className="w-full py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
