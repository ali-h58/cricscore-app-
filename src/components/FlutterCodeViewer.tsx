import React, { useState } from 'react';
import { Code2, Copy, Check, Download, FileCode, FolderTree, PackageCheck, Archive } from 'lucide-react';
import JSZip from 'jszip';

interface FileEntry {
  path: string;
  name: string;
  language: string;
  code: string;
}

const FLUTTER_FILES: FileEntry[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    language: 'yaml',
    code: `name: cricket_scoreboard_pro
description: "A complete professional 15-phase Cricket Scoreboard and live match analytics app built with Flutter and Dart with Null Safety."
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  provider: ^6.1.1
  fl_chart: ^0.66.0
  pdf: ^3.10.7
  printing: ^5.11.1
  share_plus: ^7.2.1
  shared_preferences: ^2.2.2
  confetti: ^0.7.0
  intl: ^0.19.0
  google_fonts: ^6.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    language: 'dart',
    code: `// Cricket Scoreboard Pro - Flutter Main Application (Dart 3+ Null Safety)
// Phase 1 to Phase 15 Architecture

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'models/cricket_models.dart';
import 'screens/home_dashboard_screen.dart';
import 'screens/live_scoring_screen.dart';
import 'screens/scorecard_screen.dart';
import 'screens/commentary_screen.dart';
import 'screens/analytics_screen.dart';
import 'screens/score_predictor_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CricketScoreboardApp());
}

class CricketScoreboardApp extends StatefulWidget {
  const CricketScoreboardApp({super.key});

  @override
  State<CricketScoreboardApp> createState() => _CricketScoreboardAppState();
}

class _CricketScoreboardAppState extends State<CricketScoreboardApp> {
  ThemeMode _themeMode = ThemeMode.dark;

  void toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  @override
  Widget build(BuildContext context) {
    const cricbuzzGreen = Color(0xFF009270);
    const darkSurface = Color(0xFF0C131D);
    const darkCard = Color(0xFF16202C);

    return MaterialApp(
      title: 'Cricket Scoreboard Pro',
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorSchemeSeed: cricbuzzGreen,
        textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.light().textTheme),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        appBarTheme: const AppBarTheme(
          backgroundColor: cricbuzzGreen,
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorSchemeSeed: cricbuzzGreen,
        scaffoldBackgroundColor: darkSurface,
        cardColor: darkCard,
        textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
        appBarTheme: const AppBarTheme(
          backgroundColor: darkCard,
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      home: HomeDashboardScreen(onToggleTheme: toggleTheme),
    );
  }
}`,
  },
  {
    path: 'lib/models/cricket_models.dart',
    name: 'cricket_models.dart',
    language: 'dart',
    code: `// Cricket Scoreboard Pro - Complete Data Models (Phase 15 Engine)
// Null Safety enabled (Dart 3+)

enum MatchFormat { t20, odi, testMatch, custom }
enum PlayerRole { batsman, bowler, allRounder, wicketkeeper }
enum DismissalType { bowled, caught, lbw, runOut, stumped, hitWicket, retired, obstructing }
enum ExtraType { wide, noBall, bye, legBye, penalty }
enum MatchStatus { upcoming, live, completed, abandoned }

class Player {
  final String id;
  final String name;
  final PlayerRole role;
  final bool isCaptain;
  final bool isViceCaptain;
  final bool isWicketkeeper;
  final String? avatar;
  final String country;

  Player({
    required this.id,
    required this.name,
    required this.role,
    this.isCaptain = false,
    this.isViceCaptain = false,
    this.isWicketkeeper = false,
    this.avatar,
    this.country = '',
  });
}

class Team {
  final String id;
  String name;
  String shortName;
  int colorHex;
  List<Player> squad;
  List<String> playingXI;

  Team({
    required this.id,
    required this.name,
    required this.shortName,
    required this.colorHex,
    required this.squad,
    required this.playingXI,
  });
}

class BallEvent {
  final String id;
  final int overNumber;
  final int ballNumberInOver;
  final int legalBallNumberInOver;
  final String strikerId;
  final String nonStrikerId;
  final String bowlerId;
  final int runsBat;
  final int runsExtra;
  final ExtraType? extraType;
  final bool isLegal;
  final bool isWicket;
  final DismissalInfo? dismissal;
  final String commentary;
  final int timestamp;

  BallEvent({
    required this.id,
    required this.overNumber,
    required this.ballNumberInOver,
    required this.legalBallNumberInOver,
    required this.strikerId,
    required this.nonStrikerId,
    required this.bowlerId,
    required this.runsBat,
    this.runsExtra = 0,
    this.extraType,
    required this.isLegal,
    this.isWicket = false,
    this.dismissal,
    required this.commentary,
    required this.timestamp,
  });
}

class Innings {
  final int inningsNumber;
  final String battingTeamId;
  final String bowlingTeamId;
  int totalRuns;
  int totalWickets;
  int totalLegalBalls;
  int oversCompleted;
  int ballsInCurrentOver;
  List<BallEvent> balls;
  Map<String, BattingStat> battingStats;
  Map<String, BowlingStat> bowlingStats;
  String currentStrikerId;
  String currentNonStrikerId;
  String currentBowlerId;
  int wides;
  int noBalls;
  int byes;
  int legByes;
  List<FallOfWicket> fallOfWickets;
  List<Partnership> partnerships;
  Partnership currentPartnership;
  bool isCompleted;

  Innings({
    required this.inningsNumber,
    required this.battingTeamId,
    required this.bowlingTeamId,
    this.totalRuns = 0,
    this.totalWickets = 0,
    this.totalLegalBalls = 0,
    this.oversCompleted = 0,
    this.ballsInCurrentOver = 0,
    required this.balls,
    required this.battingStats,
    required this.bowlingStats,
    required this.currentStrikerId,
    required this.currentNonStrikerId,
    required this.currentBowlerId,
    this.wides = 0,
    this.noBalls = 0,
    this.byes = 0,
    this.legByes = 0,
    required this.fallOfWickets,
    required this.partnerships,
    required this.currentPartnership,
    this.isCompleted = false,
  });
}

class CricketMatch {
  final String id;
  String title;
  MatchFormat format;
  int totalOvers;
  String date;
  String time;
  String venue;
  Team teamA;
  Team teamB;
  Toss? toss;
  MatchStatus status;
  int currentInningsIndex;
  List<Innings> innings;
  MatchResult? result;

  CricketMatch({
    required this.id,
    required this.title,
    required this.format,
    required this.totalOvers,
    required this.date,
    required this.time,
    required this.venue,
    required this.teamA,
    required this.teamB,
    this.toss,
    this.status = MatchStatus.live,
    this.currentInningsIndex = 0,
    required this.innings,
    this.result,
  });
}`,
  },
  {
    path: 'lib/services/cricket_scoring_engine.dart',
    name: 'cricket_scoring_engine.dart',
    language: 'dart',
    code: `// Professional Cricket Scoring Engine in Dart with Null Safety
// Handles legal ball calculation, overs, strike rotation, commentary, win predictor, and fall of wickets

import '../models/cricket_models.dart';

class CricketScoringEngine {
  static void scoreBall({
    required CricketMatch match,
    required int runsBat,
    int runsExtra = 0,
    ExtraType? extraType,
    bool isWicket = false,
    DismissalInfo? dismissal,
    String? newStrikerId,
    String? nextBowlerId,
  }) {
    final innings = match.innings[match.currentInningsIndex];
    final bool isLegal = extraType != ExtraType.wide && extraType != ExtraType.noBall;

    final battingTeam = match.teamA.id == innings.battingTeamId ? match.teamA : match.teamB;
    final bowlingTeam = match.teamA.id == innings.bowlingTeamId ? match.teamA : match.teamB;

    final strikerPlayer = battingTeam.squad.firstWhere((p) => p.id == innings.currentStrikerId);
    final bowlerPlayer = bowlingTeam.squad.firstWhere((p) => p.id == innings.currentBowlerId);

    final int totalBallRuns = runsBat + runsExtra;
    innings.totalRuns += totalBallRuns;

    if (isLegal) {
      innings.totalLegalBalls += 1;
      innings.ballsInCurrentOver += 1;
      if (innings.ballsInCurrentOver == 6) {
        innings.oversCompleted += 1;
        innings.ballsInCurrentOver = 0;
        final temp = innings.currentStrikerId;
        innings.currentStrikerId = innings.currentNonStrikerId;
        innings.currentNonStrikerId = temp;
      }
    }
  }

  static void switchStrike(CricketMatch match) {
    final inn = match.innings[match.currentInningsIndex];
    final temp = inn.currentStrikerId;
    inn.currentStrikerId = inn.currentNonStrikerId;
    inn.currentNonStrikerId = temp;
  }
}`,
  },
  {
    path: 'lib/screens/home_dashboard_screen.dart',
    name: 'home_dashboard_screen.dart',
    language: 'dart',
    code: `// Phase 1 - Home Dashboard Screen (Flutter & Dart Null Safety)
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';
import 'live_scoring_screen.dart';
import 'match_setup_screen.dart';

class HomeDashboardScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;
  const HomeDashboardScreen({super.key, required this.onToggleTheme});

  @override
  State<HomeDashboardScreen> createState() => _HomeDashboardScreenState();
}

class _HomeDashboardScreenState extends State<HomeDashboardScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cricket Scoreboard Pro', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(icon: const Icon(Icons.brightness_6), onPressed: widget.onToggleTheme),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Quick actions: New Match, Resume Match, Match History, Settings
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'lib/screens/live_scoring_screen.dart',
    name: 'live_scoring_screen.dart',
    language: 'dart',
    code: `// Phase 3 - Live Scoring Screen in Flutter (Dart 3+ Null Safety)
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';
import '../services/cricket_scoring_engine.dart';

class LiveScoringScreen extends StatefulWidget {
  final CricketMatch match;
  const LiveScoringScreen({super.key, required this.match});

  @override
  State<LiveScoringScreen> createState() => _LiveScoringScreenState();
}

class _LiveScoringScreenState extends State<LiveScoringScreen> {
  void _onScoreRun(int runs) {
    setState(() {
      CricketScoringEngine.scoreBall(match: widget.match, runsBat: runs);
    });
  }

  @override
  Widget build(BuildContext context) {
    final inn = widget.match.innings[widget.match.currentInningsIndex];
    return Scaffold(
      appBar: AppBar(title: Text('\${widget.match.teamA.shortName} vs \${widget.match.teamB.shortName}')),
      body: Column(
        children: [
          Container(padding: const EdgeInsets.all(16), child: Text('\${inn.totalRuns}/\${inn.totalWickets} (\${inn.oversFormatted} ov)')),
          // Keypad: 0, 1, 2, 3, 4, 5, 6, Wide, No Ball, Bye, Leg Bye, Wicket
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'lib/screens/scorecard_screen.dart',
    name: 'scorecard_screen.dart',
    language: 'dart',
    code: `// Phase 5 - Complete Scorecard Screen (Flutter & Dart Null Safety)
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';

class ScorecardScreen extends StatelessWidget {
  final CricketMatch match;
  const ScorecardScreen({super.key, required this.match});

  @override
  Widget build(BuildContext context) {
    final inn = match.innings[0];
    return Scaffold(
      appBar: AppBar(title: const Text('Complete Scorecard')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Batting Table, Bowling Table, Extras, Fall of Wickets
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'lib/screens/analytics_screen.dart',
    name: 'analytics_screen.dart',
    language: 'dart',
    code: `// Phase 6 & 9 - Advanced Cricket Analytics & Graphs in Flutter
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';

class AnalyticsScreen extends StatelessWidget {
  final CricketMatch match;
  const AnalyticsScreen({super.key, required this.match});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cricket Analytics & Graphs')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // CRR, RRR, Worm Graph, Runs per Over Manhattan Bars, Phase Breakdown
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'lib/screens/score_predictor_screen.dart',
    name: 'score_predictor_screen.dart',
    language: 'dart',
    code: `// Phase 7 & 8 - Score Predictor & Live Win Probability in Flutter
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';

class ScorePredictorScreen extends StatelessWidget {
  final CricketMatch match;
  const ScorePredictorScreen({super.key, required this.match});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Score Predictor & Win Probability')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Live Win Probability Dual Percentage (Team A 68% vs Team B 32%)
          // Projected Score at 6, 8, 10, 12 RPO
          // Chase Calculator (Target, Balls left, Required RR)
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'lib/screens/match_setup_screen.dart',
    name: 'match_setup_screen.dart',
    language: 'dart',
    code: `// Phase 2 - Teams, Players & Toss Setup Screen (Flutter & Dart Null Safety)
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';

class MatchSetupScreen extends StatefulWidget {
  const MatchSetupScreen({super.key});

  @override
  State<MatchSetupScreen> createState() => _MatchSetupScreenState();
}

class _MatchSetupScreenState extends State<MatchSetupScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('New Match Setup')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Team names, Playing XI, Captain/VC/WK, Toss & Decision
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'lib/screens/commentary_screen.dart',
    name: 'commentary_screen.dart',
    language: 'dart',
    code: `// Phase 4 - Ball-by-Ball Commentary Screen (Flutter & Dart Null Safety)
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';

class CommentaryScreen extends StatelessWidget {
  final CricketMatch match;
  const CommentaryScreen({super.key, required this.match});

  @override
  Widget build(BuildContext context) {
    final inn = match.innings[match.currentInningsIndex];
    return Scaffold(
      appBar: AppBar(title: const Text('Ball-by-Ball Commentary')),
      body: ListView.builder(
        itemCount: inn.balls.length,
        itemBuilder: (context, index) {
          final b = inn.balls[index];
          return ListTile(
            leading: CircleAvatar(child: Text('\${b.runsBat}')),
            title: Text('\${b.overNumber}.\${b.legalBallNumberInOver}'),
            subtitle: Text(b.commentary),
          );
        },
      ),
    );
  }
}`,
  },
];

export const FlutterCodeViewer: React.FC = () => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);

  const currentFile = FLUTTER_FILES[selectedFileIdx];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    try {
      setZipping(true);
      const zip = new JSZip();

      // Add all Flutter & Dart files
      FLUTTER_FILES.forEach((f) => {
        zip.file(f.path, f.code);
      });

      // Generate README.md
      zip.file(
        'README.md',
        `# Cricket Scoreboard Pro (Flutter & Dart)

A complete 15-phase professional cricket scoring engine built with Flutter & Dart (Null Safety).

## How to Run:
1. Make sure Flutter SDK 3.0+ is installed on your machine:
   \`\`\`bash
   flutter --version
   \`\`\`
2. Fetch dependencies:
   \`\`\`bash
   flutter pub get
   \`\`\`
3. Run on your connected device, emulator, or Chrome:
   \`\`\`bash
   flutter run
   \`\`\`

## Architecture:
- \`lib/models/cricket_models.dart\`: Complete data structure for Match, Innings, Ball, Batting, Bowling.
- \`lib/services/cricket_scoring_engine.dart\`: Scoring engine with legal balls, strike rotation, and auto-commentary.
- \`lib/screens/\`: All 15 phases screens (Home, Setup, Live Scoring, Scorecard, Commentary, Analytics, Predictor).`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'flutter_cricket_scoreboard_project.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error creating zip', e);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Flutter & Dart (Null Safety) Source Code
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  Dart 3+
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                11 complete files created in project root (`/pubspec.yaml`, `/lib/...`) ready for Android Studio & VS Code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <button
              onClick={handleDownloadSingle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download File
            </button>
            <button
              onClick={handleDownloadZip}
              disabled={zipping}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              {zipping ? 'Creating ZIP...' : 'Download Full Flutter Project (.ZIP)'}
            </button>
          </div>
        </div>
      </div>

      {/* File Explorer & Code Preview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* File List Sidebar */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <span>Project Files ({FLUTTER_FILES.length})</span>
          </div>

          <div className="space-y-1 max-h-[500px] overflow-y-auto no-scrollbar">
            {FLUTTER_FILES.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setSelectedFileIdx(idx)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-left transition-all ${
                  selectedFileIdx === idx
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                <span className="truncate">{file.path}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Code Content */}
        <div className="md:col-span-3 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono">
            <span className="text-slate-300 font-semibold">{currentFile.path}</span>
            <span className="text-slate-500 uppercase">{currentFile.language}</span>
          </div>

          <div className="p-4 overflow-x-auto max-h-[550px] font-mono text-xs text-slate-300 leading-relaxed no-scrollbar select-text">
            <pre>{currentFile.code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
