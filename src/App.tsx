/**
 * CricScore Pro - 15-Phase Professional Cricket Scoreboard App
 * Built with full Flutter & Dart source files and live interactive simulation
 */

import React, { useState, useEffect } from 'react';
import { Match } from './types/cricket';
import { getStoredCurrentMatch, saveCurrentMatch } from './services/storage';
import { undoLastBall } from './services/cricketEngine';
import { Navbar } from './components/Navbar';
import { LiveScoringTab } from './components/LiveScoringTab';
import { ScorecardTab } from './components/ScorecardTab';
import { CommentaryTab } from './components/CommentaryTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { PredictorTab } from './components/PredictorTab';
import { FlutterCodeViewer } from './components/FlutterCodeViewer';
import { CelebrationOverlay } from './components/CelebrationOverlay';
import { ResultModal } from './components/ResultModal';
import { MatchSetupModal } from './components/MatchSetupModal';
import { MatchHistoryModal } from './components/MatchHistoryModal';
import { PdfReportModal } from './components/PdfReportModal';
import { ShareBackupModal } from './components/ShareBackupModal';

export default function App() {
  const [match, setMatch] = useState<Match>(() => getStoredCurrentMatch());
  const [activeTab, setActiveTab] = useState<
    'scoring' | 'scorecard' | 'commentary' | 'analytics' | 'predictor' | 'flutter'
  >('scoring');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Modals state
  const [showResultModal, setShowResultModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Celebration overlay state
  const [celebration, setCelebration] = useState<{
    type: 'four' | 'six' | 'wicket' | 'fifty' | 'hundred' | 'match_won' | 'over_completed' | null;
    text?: string;
  }>({ type: null });

  // Auto-save to localStorage whenever match changes (Phase 11)
  useEffect(() => {
    saveCurrentMatch(match);
  }, [match]);

  const triggerCelebration = (
    type: 'four' | 'six' | 'wicket' | 'fifty' | 'hundred' | 'match_won' | 'over_completed',
    text?: string
  ) => {
    setCelebration({ type, text });
  };

  const handleUndo = () => {
    const reverted = undoLastBall(match);
    setMatch(reverted);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Navbar Contract */}
      <Navbar
        match={match}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        onNewMatchClick={() => setShowSetupModal(true)}
        onHistoryClick={() => setShowHistoryModal(true)}
        onPdfClick={() => setShowPdfModal(true)}
        onShareClick={() => setShowShareModal(true)}
        onUndoClick={handleUndo}
      />

      {/* Main Body with Responsive / Mobile Frame Toggle */}
      <main className="max-w-7xl mx-auto px-4 py-5">
        {isMobileFrame ? (
          // Mobile Phone Shell Preview
          <div className="flex justify-center items-center py-4">
            <div className="w-[410px] max-w-full bg-slate-900 border-[10px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden ring-1 ring-slate-700/60 flex flex-col">
              {/* Speaker / Camera Notch */}
              <div className="w-full h-6 bg-slate-800 flex items-center justify-center">
                <div className="w-16 h-3.5 bg-slate-900 rounded-full" />
              </div>

              {/* Mobile Content Screen */}
              <div className="p-4 max-h-[750px] overflow-y-auto no-scrollbar">
                {activeTab === 'scoring' && (
                  <LiveScoringTab
                    match={match}
                    setMatch={setMatch}
                    triggerCelebration={triggerCelebration}
                    onOpenResultModal={() => setShowResultModal(true)}
                  />
                )}
                {activeTab === 'scorecard' && <ScorecardTab match={match} />}
                {activeTab === 'commentary' && <CommentaryTab match={match} />}
                {activeTab === 'analytics' && <AnalyticsTab match={match} />}
                {activeTab === 'predictor' && <PredictorTab match={match} />}
                {activeTab === 'flutter' && <FlutterCodeViewer />}
              </div>

              {/* Home indicator bar */}
              <div className="w-full h-4 bg-slate-900 flex items-center justify-center pb-1">
                <div className="w-28 h-1 bg-slate-700 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          // Full Desktop Grid Layout
          <div className="w-full">
            {activeTab === 'scoring' && (
              <LiveScoringTab
                match={match}
                setMatch={setMatch}
                triggerCelebration={triggerCelebration}
                onOpenResultModal={() => setShowResultModal(true)}
              />
            )}
            {activeTab === 'scorecard' && <ScorecardTab match={match} />}
            {activeTab === 'commentary' && <CommentaryTab match={match} />}
            {activeTab === 'analytics' && <AnalyticsTab match={match} />}
            {activeTab === 'predictor' && <PredictorTab match={match} />}
            {activeTab === 'flutter' && <FlutterCodeViewer />}
          </div>
        )}
      </main>

      {/* Celebration Overlay (Phase 14) */}
      <CelebrationOverlay
        type={celebration.type}
        text={celebration.text}
        onClose={() => setCelebration({ type: null })}
      />

      {/* Result Modal (Phase 10) */}
      {showResultModal && (
        <ResultModal
          match={match}
          onClose={() => setShowResultModal(false)}
          onPdfClick={() => setShowPdfModal(true)}
          onShareClick={() => setShowShareModal(true)}
          onNewMatchClick={() => setShowSetupModal(true)}
        />
      )}

      {/* Match Setup & Toss Modal (Phase 1 & Phase 2) */}
      {showSetupModal && (
        <MatchSetupModal
          onClose={() => setShowSetupModal(false)}
          onMatchCreated={(newMatch) => {
            setMatch(newMatch);
            setActiveTab('scoring');
          }}
        />
      )}

      {/* Match History Modal (Phase 11) */}
      {showHistoryModal && (
        <MatchHistoryModal
          currentMatch={match}
          onClose={() => setShowHistoryModal(false)}
          onResumeMatch={(resumedMatch) => {
            setMatch(resumedMatch);
            setActiveTab('scoring');
          }}
        />
      )}

      {/* Professional PDF Report Modal (Phase 12) */}
      {showPdfModal && (
        <PdfReportModal match={match} onClose={() => setShowPdfModal(false)} />
      )}

      {/* Share & Backup Modal (Phase 13) */}
      {showShareModal && (
        <ShareBackupModal
          match={match}
          onClose={() => setShowShareModal(false)}
          onMatchImported={(importedMatch) => {
            setMatch(importedMatch);
            setActiveTab('scoring');
          }}
        />
      )}
    </div>
  );
}
