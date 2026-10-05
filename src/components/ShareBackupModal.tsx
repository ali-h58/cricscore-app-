import React, { useState } from 'react';
import { Match } from '../types/cricket';
import { exportMatchToJson, importMatchFromJson } from '../services/storage';
import { Share2, Download, Upload, Copy, Check } from 'lucide-react';

interface ShareBackupModalProps {
  match: Match;
  onClose: () => void;
  onMatchImported: (match: Match) => void;
}

export const ShareBackupModal: React.FC<ShareBackupModalProps> = ({
  match,
  onClose,
  onMatchImported,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');

  const inn1 = match.innings[0];
  const inn2 = match.innings[1];
  const battingTeam = match.teamA.id === match.innings[match.currentInningsIndex].battingTeamId ? match.teamA : match.teamB;
  const currentInn = match.innings[match.currentInningsIndex];

  // Text summary for WhatsApp / Telegram
  const summaryText = `🏏 *${match.title}*
Format: ${match.format} | Venue: ${match.venue}
Score: *${battingTeam.shortName} ${currentInn.totalRuns}/${currentInn.totalWickets}* (${currentInn.oversCompleted}.${currentInn.ballsInCurrentOver} ov)
${match.result ? `🏆 Result: ${match.result.summary}` : '⚡ Live match in progress'}
Tracked via CricScore Pro!`;

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (e) {}
  };

  const handleDownloadJson = () => {
    const jsonStr = exportMatchToJson(match);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${match.teamA.shortName}_vs_${match.teamB.shortName}_scorecard.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    try {
      setImportError('');
      if (!importJsonText.trim()) return;
      const imported = importMatchFromJson(importJsonText);
      onMatchImported(imported);
      onClose();
    } catch (err: any) {
      setImportError('Failed to parse match JSON. Ensure format is valid.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Share Match & JSON Backup</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        {/* Share Quick Summary (WhatsApp / Social) */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Share Match Update
          </span>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 font-mono text-xs text-slate-200 whitespace-pre-line">
            {summaryText}
          </div>
          <button
            onClick={handleCopySummary}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400" />}
            {copiedText ? 'Copied to Clipboard!' : 'Copy Summary to Share'}
          </button>
        </div>

        {/* JSON Export / Import */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Backup & Transfer (JSON)
          </span>

          <button
            onClick={handleDownloadJson}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Match Data (Download .JSON)
          </button>

          {/* Import JSON field */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] text-slate-400 block font-semibold">
              Restore / Import Match from JSON:
            </label>
            <textarea
              rows={3}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste exported Match JSON here to restore..."
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none font-mono"
            />
            {importError && <p className="text-xs text-rose-400 font-semibold">{importError}</p>}
            <button
              onClick={handleImportJson}
              disabled={!importJsonText.trim()}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              Restore & Open Match
            </button>
          </div>
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
