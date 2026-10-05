import React from 'react';
import {
  Trophy,
  PlusCircle,
  History,
  FileText,
  Share2,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Code2,
  RotateCcw,
} from 'lucide-react';
import { Match } from '../types/cricket';

interface NavbarProps {
  match: Match;
  activeTab: 'scoring' | 'scorecard' | 'commentary' | 'analytics' | 'predictor' | 'flutter';
  setActiveTab: (tab: 'scoring' | 'scorecard' | 'commentary' | 'analytics' | 'predictor' | 'flutter') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  onNewMatchClick: () => void;
  onHistoryClick: () => void;
  onPdfClick: () => void;
  onShareClick: () => void;
  onUndoClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  match,
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  isMobileFrame,
  setIsMobileFrame,
  onNewMatchClick,
  onHistoryClick,
  onPdfClick,
  onShareClick,
  onUndoClick,
}) => {
  const currentInnings = match.innings[match.currentInningsIndex];
  const battingTeam = match.teamA.id === currentInnings.battingTeamId ? match.teamA : match.teamB;
  const bowlingTeam = match.teamA.id === currentInnings.bowlingTeamId ? match.teamA : match.teamB;

  const oversString = `${currentInnings.oversCompleted}.${currentInnings.ballsInCurrentOver}`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
      {/* Top Bar Zone: Brand, Live Ticker, Action buttons */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-slate-950 font-black text-lg">
            🏏
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                CricScore <span className="text-emerald-400">Pro</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block truncate max-w-[200px]">
              {match.title}
            </p>
          </div>
        </div>

        {/* Live Score Compact Strip */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white">{battingTeam.shortName}</span>
            <span className="font-black text-emerald-400 text-sm">
              {currentInnings.totalRuns}/{currentInnings.totalWickets}
            </span>
            <span className="text-slate-400">({oversString} ov)</span>
          </div>
          <span className="text-slate-500">vs</span>
          <span className="text-slate-400 font-medium">{bowlingTeam.shortName}</span>
          {match.currentInningsIndex === 1 && (
            <span className="text-amber-400 font-medium border-l border-slate-700 pl-2">
              Target: {match.innings[0].totalRuns + 1}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onUndoClick}
            title="Undo last delivery"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button
            onClick={onNewMatchClick}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Match</span>
          </button>

          <button
            onClick={onHistoryClick}
            title="Match History & Auto-Save"
            className="p-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            onClick={onPdfClick}
            title="Professional Match PDF Report"
            className="p-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            onClick={onShareClick}
            title="Share Score & JSON Backup"
            className="p-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? 'Switch to Full Desktop View' : 'Switch to Mobile Frame View'}
            className="hidden md:flex p-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Light / Dark Mode"
            className="p-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation (Cricbuzz Style) */}
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80">
        <button
          onClick={() => setActiveTab('scoring')}
          className={`px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'scoring'
              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Live Scoring
        </button>

        <button
          onClick={() => setActiveTab('scorecard')}
          className={`px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'scorecard'
              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Scorecard
        </button>

        <button
          onClick={() => setActiveTab('commentary')}
          className={`px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'commentary'
              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Ball-by-Ball
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'analytics'
              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Analytics & Graphs
        </button>

        <button
          onClick={() => setActiveTab('predictor')}
          className={`px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'predictor'
              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Score Predictor & Win %
        </button>

        <button
          onClick={() => setActiveTab('flutter')}
          className={`ml-auto flex items-center gap-1.5 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'flutter'
              ? 'text-cyan-400 border-cyan-400 bg-cyan-500/10'
              : 'text-slate-400 border-transparent hover:text-cyan-300'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          Flutter & Dart Code
        </button>
      </div>
    </header>
  );
};
