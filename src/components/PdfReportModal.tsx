import React from 'react';
import { Match } from '../types/cricket';
import { Printer, Download, X } from 'lucide-react';

interface PdfReportModalProps {
  match: Match;
  onClose: () => void;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({ match, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const inn1 = match.innings[0];
  const inn2 = match.innings[1];
  const team1 = match.teamA.id === inn1.battingTeamId ? match.teamA : match.teamB;
  const team2 = match.teamA.id === inn2.battingTeamId ? match.teamA : match.teamB;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 my-6 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <h2 className="text-base font-bold text-white">Professional Cricket Match Report</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Preview */}
        <div className="flex-1 overflow-y-auto pr-1 bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-inner font-sans text-xs">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🏏</span>
                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                  CRICKET SCORECARD REPORT
                </h1>
              </div>
              <p className="text-sm font-semibold text-slate-700 mt-1">{match.title}</p>
              <p className="text-xs text-slate-500">
                Format: {match.format} ({match.totalOvers} Overs) · Venue: {match.venue} · Date: {match.date}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-xs uppercase">
                {match.status === 'completed' ? 'FINAL' : 'LIVE REPORT'}
              </span>
              {match.result && (
                <p className="text-xs font-bold text-slate-900 mt-1.5 max-w-[200px]">
                  {match.result.summary}
                </p>
              )}
            </div>
          </div>

          {/* Toss & Teams Summary */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-100 rounded-lg mb-4 text-xs">
            <div>
              <span className="font-bold text-slate-700">Toss: </span>
              <span>
                {match.toss
                  ? `${match.toss.winnerTeamId === match.teamA.id ? match.teamA.name : match.teamB.name} won and elected to ${match.toss.decision}`
                  : 'N/A'}
              </span>
            </div>
            {match.result?.playerOfTheMatchName && (
              <div>
                <span className="font-bold text-slate-700">Player of the Match: </span>
                <span className="font-semibold text-emerald-700">{match.result.playerOfTheMatchName}</span>
              </div>
            )}
          </div>

          {/* INNINGS 1 SCORECARD */}
          <div className="mb-6">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-300 font-bold text-sm mb-2 text-slate-900">
              <span>
                1st Innings: {team1.name} Scorecard
              </span>
              <span className="font-mono text-emerald-700">
                {inn1.totalRuns}/{inn1.totalWickets} ({inn1.oversCompleted}.{inn1.ballsInCurrentOver} ov)
              </span>
            </div>

            {/* Batting table */}
            <table className="w-full text-left border-collapse text-[11px] mb-3 font-mono">
              <thead>
                <tr className="bg-slate-200 text-slate-700 font-sans font-bold">
                  <th className="p-1.5">Batter</th>
                  <th className="p-1.5">Dismissal</th>
                  <th className="p-1.5 text-right">R</th>
                  <th className="p-1.5 text-right">B</th>
                  <th className="p-1.5 text-right">4s</th>
                  <th className="p-1.5 text-right">6s</th>
                  <th className="p-1.5 text-right">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.values(inn1.battingStats)
                  .filter((b) => b.balls > 0 || b.isOut || b.playerId === inn1.currentStrikerId || b.playerId === inn1.currentNonStrikerId)
                  .map((b) => (
                    <tr key={b.playerId}>
                      <td className="p-1.5 font-bold font-sans">{b.playerName}</td>
                      <td className="p-1.5 text-slate-600 font-sans">{b.isOut ? (b.dismissalText || 'out') : 'not out'}</td>
                      <td className="p-1.5 text-right font-bold">{b.runs}</td>
                      <td className="p-1.5 text-right">{b.balls}</td>
                      <td className="p-1.5 text-right">{b.fours}</td>
                      <td className="p-1.5 text-right">{b.sixes}</td>
                      <td className="p-1.5 text-right">{b.strikeRate}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="flex justify-between p-2 bg-slate-50 text-[11px] font-mono border-t border-slate-200">
              <span>Extras: {inn1.extras.total} (b {inn1.extras.byes}, lb {inn1.extras.legByes}, w {inn1.extras.wides}, nb {inn1.extras.noBalls})</span>
              <span className="font-bold">Total: {inn1.totalRuns}/{inn1.totalWickets}</span>
            </div>

            {/* Bowling table */}
            <table className="w-full text-left border-collapse text-[11px] mt-2 font-mono">
              <thead>
                <tr className="bg-slate-200 text-slate-700 font-sans font-bold">
                  <th className="p-1.5">Bowler</th>
                  <th className="p-1.5 text-right">O</th>
                  <th className="p-1.5 text-right">M</th>
                  <th className="p-1.5 text-right">R</th>
                  <th className="p-1.5 text-right">W</th>
                  <th className="p-1.5 text-right">ECO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.values(inn1.bowlingStats)
                  .filter((bw) => bw.legalBalls > 0 || bw.runs > 0)
                  .map((bw) => (
                    <tr key={bw.playerId}>
                      <td className="p-1.5 font-sans font-medium">{bw.playerName}</td>
                      <td className="p-1.5 text-right">{bw.oversString}</td>
                      <td className="p-1.5 text-right">{bw.maidens}</td>
                      <td className="p-1.5 text-right">{bw.runs}</td>
                      <td className="p-1.5 text-right font-bold text-red-600">{bw.wickets}</td>
                      <td className="p-1.5 text-right">{bw.economy}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Fall of Wickets */}
            {inn1.fallOfWickets.length > 0 && (
              <div className="mt-2 text-[10px] text-slate-600 font-mono">
                <span className="font-bold font-sans">Fall of Wickets: </span>
                {inn1.fallOfWickets.map((f) => `${f.wicketNumber}-${f.runs} (${f.playerOutName}, ${f.oversString} ov)`).join(', ')}
              </div>
            )}
          </div>

          <div className="border-t border-slate-300 pt-3 text-center text-[10px] text-slate-400">
            Generated with CricScore Pro Cricket Scoreboard System
          </div>
        </div>
      </div>
    </div>
  );
};
