import React from 'react';
import { Match } from '../types/cricket';
import { calculateWinProbability } from '../services/winProbability';
import { Target, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

interface PredictorTabProps {
  match: Match;
}

export const PredictorTab: React.FC<PredictorTabProps> = ({ match }) => {
  const winProb = calculateWinProbability(match);
  const inn = match.innings[match.currentInningsIndex];
  const legalOvers = inn.totalLegalBalls / 6;
  const crr = legalOvers > 0 ? (inn.totalRuns / legalOvers) : 0;
  const remainingOvers = Math.max(0, match.totalOvers - legalOvers);

  // Projected score calculations
  const projectedAtCurrent = Math.round(inn.totalRuns + crr * remainingOvers);
  const projectedAt6 = Math.round(inn.totalRuns + 6 * remainingOvers);
  const projectedAt8 = Math.round(inn.totalRuns + 8 * remainingOvers);
  const projectedAt10 = Math.round(inn.totalRuns + 10 * remainingOvers);
  const projectedAt12 = Math.round(inn.totalRuns + 12 * remainingOvers);

  return (
    <div className="w-full space-y-4">
      {/* PHASE 8: WIN PROBABILITY DISPLAY */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/80 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Win Probability
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Match Situation Model</span>
        </div>

        {/* Dual Percentage Bar */}
        <div className="flex items-center justify-between mb-2 font-mono">
          <div className="text-left">
            <span className="text-xs font-bold text-white block">{winProb.teamAName}</span>
            <span className="text-3xl font-black text-emerald-400">
              {winProb.teamAPercentage}%
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-white block">{winProb.teamBName}</span>
            <span className="text-3xl font-black text-amber-400">
              {winProb.teamBPercentage}%
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${winProb.teamAPercentage}%` }}
            className="bg-emerald-500 h-full transition-all duration-700 shadow-sm shadow-emerald-500/50"
          />
          <div
            style={{ width: `${winProb.teamBPercentage}%` }}
            className="bg-amber-500 h-full transition-all duration-700 shadow-sm shadow-amber-500/50"
          />
        </div>

        {/* Key Match Factors */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Key Situation Factors
          </span>
          <div className="space-y-1.5">
            {winProb.keyFactors.map((factor, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PHASE 7: SCORE PREDICTOR */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
          <Target className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Score Predictor & Chase Calculator
          </h2>
        </div>

        {match.currentInningsIndex === 0 ? (
          // 1st Innings Projected Score Scenarios
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
                  Projected Score (Current RR: {crr.toFixed(2)})
                </span>
                <span className="text-2xl font-black text-white font-mono mt-0.5 block">
                  {projectedAtCurrent} Runs
                </span>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-sans uppercase">
                    <th className="py-2">Rate Scenario</th>
                    <th className="py-2 text-right">Runs to Add</th>
                    <th className="py-2 text-right">Projected Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="py-2 text-slate-300">At 6.00 RPO</td>
                    <td className="py-2 text-right text-slate-400">+{Math.round(6 * remainingOvers)}</td>
                    <td className="py-2 text-right font-bold text-white">{projectedAt6}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">At 8.00 RPO</td>
                    <td className="py-2 text-right text-slate-400">+{Math.round(8 * remainingOvers)}</td>
                    <td className="py-2 text-right font-bold text-white">{projectedAt8}</td>
                  </tr>
                  <tr className="bg-emerald-500/5">
                    <td className="py-2 text-emerald-300 font-bold">At 10.00 RPO (Accelerated)</td>
                    <td className="py-2 text-right text-slate-300">+{Math.round(10 * remainingOvers)}</td>
                    <td className="py-2 text-right font-bold text-emerald-400">{projectedAt10}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">At 12.00 RPO (Death Overs Blitz)</td>
                    <td className="py-2 text-right text-slate-400">+{Math.round(12 * remainingOvers)}</td>
                    <td className="py-2 text-right font-bold text-amber-400">{projectedAt12}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // 2nd Innings Chase Calculator
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-sans uppercase">Target</span>
              <span className="text-xl font-bold text-white mt-1 block">{winProb.targetRuns}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-sans uppercase">Runs Needed</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">{winProb.runsRemaining}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-sans uppercase">Balls Left</span>
              <span className="text-xl font-bold text-cyan-400 mt-1 block">{winProb.ballsRemaining}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-sans uppercase">Required RR</span>
              <span className="text-xl font-bold text-rose-400 mt-1 block">{winProb.requiredRunRate}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
