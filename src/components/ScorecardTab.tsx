import React, { useState } from 'react';
import { Match } from '../types/cricket';

interface ScorecardTabProps {
  match: Match;
}

export const ScorecardTab: React.FC<ScorecardTabProps> = ({ match }) => {
  const [selectedInningsIdx, setSelectedInningsIdx] = useState<0 | 1>(match.currentInningsIndex);

  const innings = match.innings[selectedInningsIdx];
  const battingTeam = match.teamA.id === innings.battingTeamId ? match.teamA : match.teamB;
  const bowlingTeam = match.teamA.id === innings.bowlingTeamId ? match.teamA : match.teamB;

  const totalOvers = (innings.totalLegalBalls / 6).toFixed(1);
  const runRate = innings.totalLegalBalls > 0 ? (innings.totalRuns / (innings.totalLegalBalls / 6)).toFixed(2) : '0.00';

  // Batting stats ordered by position or balls faced
  const battingList = Object.values(innings.battingStats).sort(
    (a, b) => a.battingPosition - b.battingPosition
  );

  const didNotBat = battingList.filter(
    (b) => !b.isOut && b.playerId !== innings.currentStrikerId && b.playerId !== innings.currentNonStrikerId && b.balls === 0
  );

  const activeBatters = battingList.filter(
    (b) => b.isOut || b.playerId === innings.currentStrikerId || b.playerId === innings.currentNonStrikerId || b.balls > 0
  );

  // Bowling stats (only bowlers who have bowled at least 1 legal ball or conceded runs)
  const activeBowlers = Object.values(innings.bowlingStats).filter(
    (bw) => bw.legalBalls > 0 || bw.runs > 0 || bw.playerId === innings.currentBowlerId
  );

  return (
    <div className="w-full space-y-4">
      {/* Innings Selector Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => setSelectedInningsIdx(0)}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
            selectedInningsIdx === 0
              ? 'bg-emerald-600 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {match.teamA.id === match.innings[0].battingTeamId ? match.teamA.shortName : match.teamB.shortName}{' '}
          Innings ({match.innings[0].totalRuns}/{match.innings[0].totalWickets})
        </button>

        <button
          onClick={() => setSelectedInningsIdx(1)}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
            selectedInningsIdx === 1
              ? 'bg-emerald-600 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {match.teamA.id === match.innings[1].battingTeamId ? match.teamA.shortName : match.teamB.shortName}{' '}
          Innings ({match.innings[1].totalRuns}/{match.innings[1].totalWickets})
        </button>
      </div>

      {/* Innings Summary Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
            {selectedInningsIdx === 0 ? '1st Innings' : '2nd Innings'} · {battingTeam.name}
          </span>
          <h2 className="text-2xl font-black text-white font-mono mt-0.5">
            {innings.totalRuns}/{innings.totalWickets}{' '}
            <span className="text-sm font-normal text-slate-400">
              ({innings.oversCompleted}.{innings.ballsInCurrentOver} ov · RR: {runRate})
            </span>
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block font-mono">Extras: {innings.extras.total}</span>
          <span className="text-xs text-slate-400 block font-mono">Boundaries: {innings.balls.filter(b => b.runsBat === 4).length}x4, {innings.balls.filter(b => b.runsBat === 6).length}x6</span>
        </div>
      </div>

      {/* BATTING SCORECARD */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
        <div className="p-3 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Batting</span>
          <span className="text-[11px] font-mono text-slate-400">SR: Strike Rate</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                <th className="py-2.5 px-3">Batter</th>
                <th className="py-2.5 px-3">Dismissal</th>
                <th className="py-2.5 px-2 text-right">R</th>
                <th className="py-2.5 px-2 text-right">B</th>
                <th className="py-2.5 px-2 text-right">4s</th>
                <th className="py-2.5 px-2 text-right">6s</th>
                <th className="py-2.5 px-3 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {activeBatters.map((stat) => {
                const isStriker = stat.playerId === innings.currentStrikerId && !stat.isOut;
                const isNonStriker = stat.playerId === innings.currentNonStrikerId && !stat.isOut;

                return (
                  <tr
                    key={stat.playerId}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isStriker ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans font-medium text-white flex items-center gap-1.5">
                      <span className="truncate max-w-[140px] sm:max-w-none">
                        {stat.playerName}
                      </span>
                      {isStriker && <span className="text-emerald-400 font-bold">*</span>}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px] truncate max-w-[160px]">
                      {stat.isOut ? (
                        stat.dismissalText || 'out'
                      ) : (
                        <span className="text-emerald-400 font-semibold">not out</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-white text-sm">
                      {stat.runs}
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-400">{stat.balls}</td>
                    <td className="py-2.5 px-2 text-right text-slate-300">{stat.fours}</td>
                    <td className="py-2.5 px-2 text-right text-slate-300">{stat.sixes}</td>
                    <td className="py-2.5 px-3 text-right text-slate-200 font-semibold">
                      {stat.strikeRate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Extras & Total Summary Lines */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80 space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-300">
            <span>Extras</span>
            <span className="font-semibold text-white">
              {innings.extras.total}{' '}
              <span className="text-[11px] text-slate-400">
                (b {innings.extras.byes}, lb {innings.extras.legByes}, w {innings.extras.wides}, nb{' '}
                {innings.extras.noBalls})
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-sm font-bold text-white">
            <span>Total</span>
            <span className="text-emerald-400">
              {innings.totalRuns}/{innings.totalWickets}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({innings.oversCompleted}.{innings.ballsInCurrentOver} Ov, RR: {runRate})
              </span>
            </span>
          </div>
        </div>

        {/* Did Not Bat */}
        {didNotBat.length > 0 && (
          <div className="p-3 border-t border-slate-800/80 bg-slate-900 text-xs">
            <span className="font-semibold text-slate-400">Yet to bat: </span>
            <span className="text-slate-300">
              {didNotBat.map((d) => d.playerName).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* BOWLING SCORECARD */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
        <div className="p-3 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Bowling</span>
          <span className="text-[11px] font-mono text-slate-400">ECO: Economy Rate</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                <th className="py-2.5 px-3">Bowler</th>
                <th className="py-2.5 px-2 text-right">O</th>
                <th className="py-2.5 px-2 text-right">M</th>
                <th className="py-2.5 px-2 text-right">R</th>
                <th className="py-2.5 px-2 text-right">W</th>
                <th className="py-2.5 px-3 text-right">ECO</th>
                <th className="py-2.5 px-2 text-right hidden sm:table-cell">Dots</th>
                <th className="py-2.5 px-2 text-right hidden sm:table-cell">Wd</th>
                <th className="py-2.5 px-2 text-right hidden sm:table-cell">Nb</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {activeBowlers.map((stat) => (
                <tr key={stat.playerId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">
                    {stat.playerName}
                    {stat.playerId === innings.currentBowlerId && (
                      <span className="ml-1 text-rose-400 font-bold">*</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-300">{stat.oversString}</td>
                  <td className="py-2.5 px-2 text-right text-slate-400">{stat.maidens}</td>
                  <td className="py-2.5 px-2 text-right text-slate-200 font-semibold">
                    {stat.runs}
                  </td>
                  <td className="py-2.5 px-2 text-right font-black text-rose-400 text-sm">
                    {stat.wickets}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-300 font-semibold">
                    {stat.economy}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400 hidden sm:table-cell">
                    {stat.dots}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400 hidden sm:table-cell">
                    {stat.wides}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400 hidden sm:table-cell">
                    {stat.noBalls}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FALL OF WICKETS */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Fall of Wickets
        </h3>
        {innings.fallOfWickets.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No wickets have fallen in this innings yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {innings.fallOfWickets.map((fow) => (
              <span
                key={fow.wicketNumber}
                className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300"
              >
                <strong className="text-rose-400">{fow.wicketNumber}-{fow.runs}</strong>{' '}
                <span className="text-slate-400">({fow.playerOutName}, {fow.oversString} ov)</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* PARTNERSHIPS */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Partnerships
        </h3>
        <div className="space-y-2">
          {innings.partnerships.map((p, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs font-mono"
            >
              <div>
                <span className="text-slate-400">Wicket {p.wicketNumber}: </span>
                <span className="font-bold text-white">
                  {p.batter1Name} ({p.batter1Runs}) & {p.batter2Name} ({p.batter2Runs})
                </span>
              </div>
              <span className="font-bold text-emerald-400">
                {p.totalRuns} runs <span className="text-slate-400 font-normal">({p.totalBalls} balls)</span>
              </span>
            </div>
          ))}

          {/* Current Partnership */}
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-emerald-400 font-semibold">Current Stand: </span>
              <span className="font-bold text-white">
                {innings.currentPartnership.batter1Name} ({innings.currentPartnership.batter1Runs}) &{' '}
                {innings.currentPartnership.batter2Name} ({innings.currentPartnership.batter2Runs})
              </span>
            </div>
            <span className="font-black text-emerald-300">
              {innings.currentPartnership.totalRuns} runs{' '}
              <span className="text-slate-400 font-normal">
                ({innings.currentPartnership.totalBalls} balls)
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
