// Phase 5 - Complete Scorecard Screen (Flutter & Dart Null Safety)
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';

class ScorecardScreen extends StatelessWidget {
  final CricketMatch match;
  const ScorecardScreen({super.key, required this.match});

  @override
  Widget build(BuildContext context) {
    final inn = match.innings[0];
    final battingStats = inn.battingStats.values.toList();
    final bowlingStats = inn.bowlingStats.values.toList();

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Complete Match Scorecard'),
          bottom: TabBar(
            tabs: [
              Tab(text: '${match.teamA.shortName} Innings'),
              Tab(text: '${match.teamB.shortName} Innings'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // 1st Innings
            ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Innings Score Header
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('${match.teamA.name}: ${inn.totalRuns}/${inn.totalWickets}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF009270))),
                      Text('(${inn.oversFormatted} ov)'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                const Text('BATTING', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
                const SizedBox(height: 8),

                // Batting Table
                Table(
                  columnWidths: const {
                    0: FlexColumnWidth(4),
                    1: FlexColumnWidth(1),
                    2: FlexColumnWidth(1),
                    3: FlexColumnWidth(1),
                    4: FlexColumnWidth(1),
                    5: FlexColumnWidth(2),
                  },
                  children: [
                    TableRow(
                      decoration: BoxDecoration(color: Colors.grey.withOpacity(0.1)),
                      children: const [
                        Padding(padding: EdgeInsets.all(8), child: Text('Batter', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                        Padding(padding: EdgeInsets.all(8), child: Text('R', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                        Padding(padding: EdgeInsets.all(8), child: Text('B', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                        Padding(padding: EdgeInsets.all(8), child: Text('4s', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                        Padding(padding: EdgeInsets.all(8), child: Text('6s', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                        Padding(padding: EdgeInsets.all(8), child: Text('SR', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                      ],
                    ),
                    ...battingStats.map((b) => TableRow(
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(8),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(b.playerName, style: const TextStyle(fontWeight: FontWeight.w600)),
                              Text(b.isOut ? (b.dismissalText ?? 'out') : 'not out', style: TextStyle(fontSize: 10, color: b.isOut ? Colors.grey : const Color(0xFF009270))),
                            ],
                          ),
                        ),
                        Padding(padding: const EdgeInsets.all(8), child: Text('${b.runs}', style: const TextStyle(fontWeight: FontWeight.bold))),
                        Padding(padding: const EdgeInsets.all(8), child: Text('${b.balls}')),
                        Padding(padding: const EdgeInsets.all(8), child: Text('${b.fours}')),
                        Padding(padding: const EdgeInsets.all(8), child: Text('${b.sixes}')),
                        Padding(padding: const EdgeInsets.all(8), child: Text('${b.strikeRate}')),
                      ],
                    )),
                  ],
                ),
                const SizedBox(height: 12),
                Text('Extras: ${inn.totalExtras} (b ${inn.byes}, lb ${inn.legByes}, w ${inn.wides}, nb ${inn.noBalls})', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                const SizedBox(height: 20),

                const Text('BOWLING', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
                const SizedBox(height: 8),

                // Bowling Table
                Table(
                  columnWidths: const {
                    0: FlexColumnWidth(4),
                    1: FlexColumnWidth(1.2),
                    2: FlexColumnWidth(1),
                    3: FlexColumnWidth(1),
                    4: FlexColumnWidth(1),
                    5: FlexColumnWidth(1.5),
                  },
                  children: [
                    TableRow(
                      decoration: BoxDecoration(color: Colors.grey.withOpacity(0.1)),
                      children: const [
                        Padding(padding: EdgeInsets.all(8), child: Text('Bowler', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                        Padding(padding: EdgeInsets.all(8), child: Text('O', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                        Padding(padding: EdgeInsets.all(8), child: Text('M', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                        Padding(padding: EdgeInsets.all(8), child: Text('R', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                        Padding(padding: EdgeInsets.all(8), child: Text('W', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                        Padding(padding: EdgeInsets.all(8), child: Text('ECO', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                      ],
                    ),
                    ...bowlingStats.map((bw) => TableRow(
                      children: [
                        Padding(padding: const EdgeInsets.all(8), child: Text(bw.playerName, style: const TextStyle(fontWeight: FontWeight.w600))),
                        Padding(padding: const EdgeInsets.all(8), child: Text(bw.oversString)),
                        Padding(padding: const EdgeInsets.all(8), child: Text('${bw.maidens}')),
                        Padding(padding: const EdgeInsets.all(8), child: Text('${bw.runs}')),
                        Padding(padding: const EdgeInsets.all(8), child: Text('${bw.wickets}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.red))),
                        Padding(padding: const EdgeInsets.all(8), child: Text('${bw.economy}')),
                      ],
                    )),
                  ],
                ),
                const SizedBox(height: 20),

                // Fall of Wickets
                const Text('FALL OF WICKETS', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: inn.fallOfWickets.map((f) => Chip(
                    label: Text('${f.wicketNumber}-${f.runs} (${f.playerOutName}, ${f.oversString} ov)', style: const TextStyle(fontSize: 11)),
                  )).toList(),
                ),
              ],
            ),

            // 2nd Innings
            const Center(child: Text('2nd Innings yet to start / in progress')),
          ],
        ),
      ),
    );
  }
}
