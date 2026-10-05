import React, { useState } from 'react';
import { Match } from '../types/cricket';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

interface AnalyticsTabProps {
  match: Match;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ match }) => {
  const [activeChart, setActiveChart] = useState<'worm' | 'runRate' | 'manhattan' | 'partnerships'>('worm');
  const inn1 = match.innings[0];
  const inn2 = match.innings[1];

  const totalBalls = inn1.totalLegalBalls;
  const legalOvers = totalBalls / 6;
  const crr = legalOvers > 0 ? (inn1.totalRuns / legalOvers).toFixed(2) : '0.00';

  // Boundaries & Dots stats
  const dotBalls = inn1.balls.filter((b) => b.runsBat === 0 && !b.extraType).length;
  const dotPct = inn1.balls.length > 0 ? Math.round((dotBalls / inn1.balls.length) * 100) : 0;

  const fourCount = inn1.balls.filter((b) => b.runsBat === 4).length;
  const sixCount = inn1.balls.filter((b) => b.runsBat === 6).length;
  const boundaryRuns = fourCount * 4 + sixCount * 6;
  const boundaryPct = inn1.totalRuns > 0 ? Math.round((boundaryRuns / inn1.totalRuns) * 100) : 0;

  // Phase Stats: Powerplay (1-6), Middle (7-15), Death (16-20)
  const ppBalls = inn1.balls.filter((b) => b.overNumber < 6);
  const ppRuns = ppBalls.reduce((s, b) => s + b.runsBat + b.runsExtra, 0);
  const ppWkts = ppBalls.filter((b) => b.isWicket).length;

  const midBalls = inn1.balls.filter((b) => b.overNumber >= 6 && b.overNumber < 15);
  const midRuns = midBalls.reduce((s, b) => s + b.runsBat + b.runsExtra, 0);
  const midWkts = midBalls.filter((b) => b.isWicket).length;

  const deathBalls = inn1.balls.filter((b) => b.overNumber >= 15);
  const deathRuns = deathBalls.reduce((s, b) => s + b.runsBat + b.runsExtra, 0);
  const deathWkts = deathBalls.filter((b) => b.isWicket).length;

  // Build over-by-over data for graphs
  const oversData = inn1.overs.length > 0 ? inn1.overs : [
    { overNumber: 1, runsInOver: 8, cumulativeRuns: 8, wicketsInOver: 0, cumulativeWickets: 0 },
    { overNumber: 2, runsInOver: 6, cumulativeRuns: 14, wicketsInOver: 0, cumulativeWickets: 0 },
    { overNumber: 3, runsInOver: 15, cumulativeRuns: 29, wicketsInOver: 0, cumulativeWickets: 0 },
    { overNumber: 4, runsInOver: 7, cumulativeRuns: 36, wicketsInOver: 0, cumulativeWickets: 0 },
    { overNumber: 5, runsInOver: 9, cumulativeRuns: 45, wicketsInOver: 0, cumulativeWickets: 0 },
    { overNumber: 6, runsInOver: 6, cumulativeRuns: 51, wicketsInOver: 1, cumulativeWickets: 1 },
    { overNumber: 7, runsInOver: 10, cumulativeRuns: 61, wicketsInOver: 0, cumulativeWickets: 1 },
    { overNumber: 8, runsInOver: 10, cumulativeRuns: 71, wicketsInOver: 0, cumulativeWickets: 1 },
    { overNumber: 9, runsInOver: 8, cumulativeRuns: 79, wicketsInOver: 0, cumulativeWickets: 1 },
    { overNumber: 10, runsInOver: 7, cumulativeRuns: 86, wicketsInOver: 0, cumulativeWickets: 1 },
    { overNumber: 11, runsInOver: 7, cumulativeRuns: 93, wicketsInOver: 1, cumulativeWickets: 2 },
    { overNumber: 12, runsInOver: 7, cumulativeRuns: 100, wicketsInOver: 0, cumulativeWickets: 2 },
    { overNumber: 13, runsInOver: 15, cumulativeRuns: 115, wicketsInOver: 0, cumulativeWickets: 2 },
    { overNumber: 14, runsInOver: 8, cumulativeRuns: 123, wicketsInOver: 0, cumulativeWickets: 2 },
    { overNumber: 15, runsInOver: 10, cumulativeRuns: 133, wicketsInOver: 1, cumulativeWickets: 3 },
    { overNumber: 16, runsInOver: 14, cumulativeRuns: 147, wicketsInOver: 0, cumulativeWickets: 3 },
  ];

  const maxCumulative = Math.max(160, ...oversData.map((o) => o.cumulativeRuns));
  const maxOverRuns = Math.max(16, ...oversData.map((o) => o.runsInOver));

  return (
    <div className="w-full space-y-4">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Run Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">{crr}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Runs per over</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Boundary %</span>
            <PieChart className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">{boundaryPct}%</div>
          <p className="text-[10px] text-slate-500 mt-0.5">{boundaryRuns} runs from 4s & 6s</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Dot Balls</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-300">
            {dotBalls} <span className="text-xs text-slate-500">({dotPct}%)</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Scoring control</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Partnership</span>
            <BarChart3 className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-300">
            {inn1.currentPartnership.totalRuns}{' '}
            <span className="text-xs text-slate-500">({inn1.currentPartnership.totalBalls}b)</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Active stand</p>
        </div>
      </div>

      {/* Phase Overs Breakdown */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
          Match Phase Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[11px] font-sans font-semibold">Powerplay (Overs 1-6)</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              {ppRuns}/{ppWkts}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              RR: {(ppRuns / 6).toFixed(2)}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[11px] font-sans font-semibold">Middle Overs (7-15)</div>
            <div className="text-lg font-bold text-amber-400 mt-1">
              {midRuns}/{midWkts}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              RR: {(midRuns / 9).toFixed(2)}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[11px] font-sans font-semibold">Death Overs (16-20)</div>
            <div className="text-lg font-bold text-rose-400 mt-1">
              {deathRuns}/{deathWkts}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {deathBalls.length > 0 ? `RR: ${(deathRuns / Math.max(0.1, deathBalls.length / 6)).toFixed(2)}` : 'Upcoming'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Graphs */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Match Visual Graphs
          </span>
          {/* Segmented graph selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveChart('worm')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                activeChart === 'worm' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Worm Graph
            </button>
            <button
              onClick={() => setActiveChart('manhattan')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                activeChart === 'manhattan' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Runs / Over
            </button>
            <button
              onClick={() => setActiveChart('runRate')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                activeChart === 'runRate' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Run Rate
            </button>
            <button
              onClick={() => setActiveChart('partnerships')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                activeChart === 'partnerships' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Partnerships
            </button>
          </div>
        </div>

        {/* WORM GRAPH */}
        {activeChart === 'worm' && (
          <div className="w-full">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>Runs vs Overs</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-0.5 bg-emerald-400 inline-block" /> {match.teamA.shortName}
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Wicket
                </span>
              </div>
            </div>

            <div className="relative h-64 w-full bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                {[0, 50, 100, 150, 200].map((level) => {
                  const y = 180 - (level / 200) * 160;
                  return (
                    <g key={level}>
                      <line x1="0" y1={y} x2="600" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                      <text x="5" y={y - 4} fill="#64748b" fontSize="10" fontFamily="monospace">
                        {level}
                      </text>
                    </g>
                  );
                })}

                {/* Team A Line */}
                <path
                  d={
                    `M 0 180 ` +
                    oversData
                      .map((d, i) => {
                        const x = ((d.overNumber) / 20) * 580;
                        const y = 180 - (d.cumulativeRuns / 200) * 160;
                        return `L ${x} ${y}`;
                      })
                      .join(' ')
                  }
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Wicket dots */}
                {oversData.map((d) => {
                  if (d.wicketsInOver > 0) {
                    const x = (d.overNumber / 20) * 580;
                    const y = 180 - (d.cumulativeRuns / 200) * 160;
                    return (
                      <g key={d.overNumber}>
                        <circle cx={x} cy={y} r="5" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />
                        <text x={x - 6} y={y - 8} fill="#f43f5e" fontSize="10" fontWeight="bold">
                          W
                        </text>
                      </g>
                    );
                  }
                  return null;
                })}
              </svg>
            </div>
          </div>
        )}

        {/* RUNS PER OVER (MANHATTAN) */}
        {activeChart === 'manhattan' && (
          <div className="w-full">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>Runs Scored in Each Over</span>
              <span className="text-emerald-400 font-semibold">Max: {maxOverRuns} runs</span>
            </div>

            <div className="h-64 flex items-end justify-between gap-1.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 font-mono">
              {oversData.map((d) => {
                const heightPct = Math.round((d.runsInOver / maxOverRuns) * 100);
                return (
                  <div key={d.overNumber} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] text-slate-400 mb-1 group-hover:text-emerald-400">
                      {d.runsInOver}
                    </span>
                    <div
                      style={{ height: `${Math.max(8, heightPct)}%` }}
                      className={`w-full rounded-t-md transition-all ${
                        d.wicketsInOver > 0
                          ? 'bg-rose-500 hover:bg-rose-400'
                          : 'bg-emerald-500 hover:bg-emerald-400'
                      }`}
                    />
                    <span className="text-[9px] text-slate-500 mt-1 font-bold">
                      {d.overNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RUN RATE CHART */}
        {activeChart === 'runRate' && (
          <div className="w-full">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>Over-by-Over Run Rate Progress</span>
              <span className="text-amber-400 font-semibold">Current RR: {crr}</span>
            </div>

            <div className="relative h-64 w-full bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                <line x1="0" y1="100" x2="600" y2="100" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="1.5" />
                <path
                  d={
                    `M 0 180 ` +
                    oversData
                      .map((d, i) => {
                        const rr = d.cumulativeRuns / d.overNumber;
                        const x = (d.overNumber / 20) * 580;
                        const y = 200 - (rr / 14) * 180;
                        return `L ${x} ${y}`;
                      })
                      .join(' ')
                  }
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>
        )}

        {/* PARTNERSHIPS */}
        {activeChart === 'partnerships' && (
          <div className="space-y-3">
            {inn1.partnerships.map((p, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="font-bold text-white">
                    Wicket {p.wicketNumber}: {p.batter1Name} & {p.batter2Name}
                  </span>
                  <span className="font-bold text-emerald-400">
                    {p.totalRuns} runs ({p.totalBalls}b)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden flex">
                  <div
                    style={{ width: `${p.totalRuns > 0 ? (p.batter1Runs / p.totalRuns) * 100 : 50}%` }}
                    className="bg-emerald-500 h-full"
                    title={`${p.batter1Name}: ${p.batter1Runs}`}
                  />
                  <div
                    style={{ width: `${p.totalRuns > 0 ? (p.batter2Runs / p.totalRuns) * 100 : 50}%` }}
                    className="bg-cyan-500 h-full"
                    title={`${p.batter2Name}: ${p.batter2Runs}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
