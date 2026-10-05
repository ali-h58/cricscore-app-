// Phase 3 - Live Scoring Screen in Flutter (Dart 3+ Null Safety)
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';
import '../services/cricket_scoring_engine.dart';
import 'scorecard_screen.dart';
import 'commentary_screen.dart';
import 'analytics_screen.dart';
import 'score_predictor_screen.dart';

class LiveScoringScreen extends StatefulWidget {
  final CricketMatch match;
  const LiveScoringScreen({super.key, required this.match});

  @override
  State<LiveScoringScreen> createState() => _LiveScoringScreenState();
}

class _LiveScoringScreenState extends State<LiveScoringScreen> {
  int _tabIndex = 0;

  void _onScoreRun(int runs) {
    setState(() {
      CricketScoringEngine.scoreBall(match: widget.match, runsBat: runs);
    });
    if (runs == 4 || runs == 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(runs == 6 ? 'MAXIMUM! 6 Runs!' : 'FOUR! Boundary!'),
          duration: const Duration(seconds: 1),
          backgroundColor: runs == 6 ? Colors.amber[800] : const Color(0xFF009270),
        ),
      );
    }
  }

  void _onScoreExtra(ExtraType type) {
    setState(() {
      CricketScoringEngine.scoreBall(
        match: widget.match,
        runsBat: 0,
        runsExtra: 1,
        extraType: type,
      );
    });
  }

  void _onWicketDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Record Wicket'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              title: const Text('Bowled'),
              onTap: () {
                Navigator.pop(ctx);
                _recordWicket(DismissalType.bowled);
              },
            ),
            ListTile(
              title: const Text('Caught'),
              onTap: () {
                Navigator.pop(ctx);
                _recordWicket(DismissalType.caught);
              },
            ),
            ListTile(
              title: const Text('LBW'),
              onTap: () {
                Navigator.pop(ctx);
                _recordWicket(DismissalType.lbw);
              },
            ),
            ListTile(
              title: const Text('Run Out'),
              onTap: () {
                Navigator.pop(ctx);
                _recordWicket(DismissalType.runOut);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _recordWicket(DismissalType type) {
    final inn = widget.match.innings[widget.match.currentInningsIndex];
    setState(() {
      CricketScoringEngine.scoreBall(
        match: widget.match,
        runsBat: 0,
        isWicket: true,
        dismissal: DismissalInfo(
          type: type,
          playerOutId: inn.currentStrikerId,
          description: type.name,
        ),
      );
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('WICKET!'), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    final inn = widget.match.innings[widget.match.currentInningsIndex];
    final striker = inn.battingStats[inn.currentStrikerId];
    final nonStriker = inn.battingStats[inn.currentStrikerId == 'p4' ? 'p5' : 'p4'];
    final bowler = inn.bowlingStats[inn.currentBowlerId];

    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.match.teamA.shortName} vs ${widget.match.teamB.shortName}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        actions: [
          IconButton(
            icon: const Icon(Icons.swap_horiz),
            tooltip: 'Swap Strike',
            onPressed: () {
              setState(() {
                CricketScoringEngine.switchStrike(widget.match);
              });
            },
          ),
          IconButton(
            icon: const Icon(Icons.assessment),
            tooltip: 'Full Scorecard',
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => ScorecardScreen(match: widget.match)));
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Match Header Banner
          Container(
            padding: const EdgeInsets.all(16),
            color: Theme.of(context).cardColor,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${widget.match.teamA.shortName} ${inn.totalRuns}/${inn.totalWickets}', style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Color(0xFF009270))),
                    Text('Overs: ${inn.oversFormatted} / ${widget.match.totalOvers}', style: const TextStyle(fontSize: 13, color: Colors.grey)),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text('CRR: ${(inn.totalLegalBalls > 0 ? (inn.totalRuns / (inn.totalLegalBalls / 6)).toStringAsFixed(2) : "0.00")}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    const Text('Projected: 182', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                )
              ],
            ),
          ),
          const Divider(height: 1),

          // Batters & Bowler Card
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Batters Table Card
                Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: const [
                            Text('BATSMAN', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                            Text('R(B)  4s 6s  SR', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        if (striker != null)
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('${striker.playerName} *', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF009270))),
                              Text('${striker.runs} (${striker.balls})  ${striker.fours}   ${striker.sixes}  ${striker.strikeRate}'),
                            ],
                          ),
                        const SizedBox(height: 6),
                        if (nonStriker != null)
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(nonStriker.playerName, style: const TextStyle(fontWeight: FontWeight.w500)),
                              Text('${nonStriker.runs} (${nonStriker.balls})  ${nonStriker.fours}   ${nonStriker.sixes}  ${nonStriker.strikeRate}'),
                            ],
                          ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Bowler Card
                Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Bowler: ${bowler?.playerName ?? "Bowler"}', style: const TextStyle(fontWeight: FontWeight.bold)),
                        Text('${bowler?.oversString ?? "0.0"} ov · ${bowler?.wickets ?? 0}/${bowler?.runs ?? 0} (Eco ${bowler?.economy ?? 0.0})'),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Navigation to features
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    ActionChip(
                      avatar: const Icon(Icons.analytics, size: 16),
                      label: const Text('Analytics & Worm'),
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => AnalyticsScreen(match: widget.match)));
                      },
                    ),
                    ActionChip(
                      avatar: const Icon(Icons.online_prediction, size: 16),
                      label: const Text('Score Predictor & Win %'),
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => ScorePredictorScreen(match: widget.match)));
                      },
                    ),
                    ActionChip(
                      avatar: const Icon(Icons.comment, size: 16),
                      label: const Text('Ball-by-Ball Commentary'),
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => CommentaryScreen(match: widget.match)));
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Phase 3 Keypad
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, -2))],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Runs Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [0, 1, 2, 3, 4, 5, 6].map((num) {
                    final isBoundary = num == 4 || num == 6;
                    return SizedBox(
                      width: 44,
                      height: 44,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.zero,
                          backgroundColor: isBoundary ? (num == 6 ? Colors.amber[800] : const Color(0xFF009270)) : Colors.grey[800],
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () => _onScoreRun(num),
                        child: Text('$num', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 10),
                // Extras & Wicket Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    OutlinedButton(onPressed: () => _onScoreExtra(ExtraType.wide), child: const Text('Wide')),
                    OutlinedButton(onPressed: () => _onScoreExtra(ExtraType.noBall), child: const Text('No Ball')),
                    OutlinedButton(onPressed: () => _onScoreExtra(ExtraType.bye), child: const Text('Bye')),
                    OutlinedButton(onPressed: () => _onScoreExtra(ExtraType.legBye), child: const Text('Leg Bye')),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
                      onPressed: _onWicketDialog,
                      child: const Text('WICKET', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
