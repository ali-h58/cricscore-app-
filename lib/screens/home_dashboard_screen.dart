// Phase 1 - Home Dashboard Screen (Flutter & Dart Null Safety)
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
  CricketMatch? _currentMatch;

  @override
  void initState() {
    super.initState();
    _initSampleMatch();
  }

  void _initSampleMatch() {
    final teamInd = Team(
      id: 'team_ind',
      name: 'India',
      shortName: 'IND',
      colorHex: 0xFF00529B,
      squad: [
        Player(id: 'p1', name: 'Rohit Sharma', role: PlayerRole.batsman, isCaptain: true),
        Player(id: 'p2', name: 'Virat Kohli', role: PlayerRole.batsman),
        Player(id: 'p3', name: 'Shubman Gill', role: PlayerRole.batsman, isViceCaptain: true),
        Player(id: 'p4', name: 'KL Rahul', role: PlayerRole.wicketkeeper, isWicketkeeper: true),
        Player(id: 'p5', name: 'Hardik Pandya', role: PlayerRole.allRounder),
        Player(id: 'p6', name: 'Ravindra Jadeja', role: PlayerRole.allRounder),
        Player(id: 'p7', name: 'Jasprit Bumrah', role: PlayerRole.bowler),
        Player(id: 'p8', name: 'Mohammed Siraj', role: PlayerRole.bowler),
        Player(id: 'p9', name: 'Kuldeep Yadav', role: PlayerRole.bowler),
        Player(id: 'p10', name: 'Arshdeep Singh', role: PlayerRole.bowler),
        Player(id: 'p11', name: 'Axar Patel', role: PlayerRole.allRounder),
      ],
      playingXI: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11'],
    );

    final teamAus = Team(
      id: 'team_aus',
      name: 'Australia',
      shortName: 'AUS',
      colorHex: 0xFFFFCD00,
      squad: [
        Player(id: 'a1', name: 'Travis Head', role: PlayerRole.batsman),
        Player(id: 'a2', name: 'David Warner', role: PlayerRole.batsman),
        Player(id: 'a3', name: 'Mitchell Marsh', role: PlayerRole.allRounder, isCaptain: true),
        Player(id: 'a4', name: 'Glenn Maxwell', role: PlayerRole.allRounder),
        Player(id: 'a5', name: 'Marcus Stoinis', role: PlayerRole.allRounder),
        Player(id: 'a6', name: 'Tim David', role: PlayerRole.batsman),
        Player(id: 'a7', name: 'Matthew Wade', role: PlayerRole.wicketkeeper, isWicketkeeper: true),
        Player(id: 'a8', name: 'Pat Cummins', role: PlayerRole.bowler, isViceCaptain: true),
        Player(id: 'a9', name: 'Mitchell Starc', role: PlayerRole.bowler),
        Player(id: 'a10', name: 'Adam Zampa', role: PlayerRole.bowler),
        Player(id: 'a11', name: 'Josh Hazlewood', role: PlayerRole.bowler),
      ],
      playingXI: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11'],
    );

    final inn1 = Innings(
      inningsNumber: 1,
      battingTeamId: teamInd.id,
      bowlingTeamId: teamAus.id,
      totalRuns: 152,
      totalWickets: 3,
      totalLegalBalls: 100, // 16.4 overs
      oversCompleted: 16,
      ballsInCurrentOver: 4,
      balls: [],
      battingStats: {
        'p1': BattingStat(playerId: 'p1', playerName: 'Rohit Sharma', runs: 72, balls: 48, fours: 7, sixes: 3, strikeRate: 150.0, isOut: true, dismissalText: 'c Wade b Zampa', battingPosition: 1),
        'p2': BattingStat(playerId: 'p2', playerName: 'Virat Kohli', runs: 31, balls: 25, fours: 4, sixes: 1, strikeRate: 124.0, isOut: true, dismissalText: 'lbw b Cummins', battingPosition: 2),
        'p3': BattingStat(playerId: 'p3', playerName: 'Shubman Gill', runs: 18, balls: 12, fours: 2, sixes: 1, strikeRate: 150.0, isOut: true, dismissalText: 'b Starc', battingPosition: 3),
        'p4': BattingStat(playerId: 'p4', playerName: 'KL Rahul', runs: 12, balls: 10, fours: 1, sixes: 0, strikeRate: 120.0, isOut: false, battingPosition: 4),
        'p5': BattingStat(playerId: 'p5', playerName: 'Hardik Pandya', runs: 8, balls: 6, fours: 1, sixes: 0, strikeRate: 133.3, isOut: false, battingPosition: 5),
      },
      bowlingStats: {
        'a9': BowlingStat(playerId: 'a9', playerName: 'Mitchell Starc', oversString: '4.0', maidens: 0, runs: 28, wickets: 1, economy: 7.0),
        'a10': BowlingStat(playerId: 'a10', playerName: 'Adam Zampa', oversString: '3.4', maidens: 0, runs: 32, wickets: 2, economy: 8.7),
      },
      currentStrikerId: 'p4',
      currentNonStrikerId: 'p5',
      currentBowlerId: 'a10',
      wides: 2,
      noBalls: 2,
      byes: 4,
      legByes: 3,
      fallOfWickets: [
        FallOfWicket(wicketNumber: 1, runs: 45, oversString: '5.2', playerOutName: 'Rohit Sharma', playerOutId: 'p1'),
        FallOfWicket(wicketNumber: 2, runs: 87, oversString: '10.4', playerOutName: 'Shubman Gill', playerOutId: 'p3'),
        FallOfWicket(wicketNumber: 3, runs: 124, oversString: '14.2', playerOutName: 'Virat Kohli', playerOutId: 'p2'),
      ],
      partnerships: [],
      currentPartnership: Partnership(wicketNumber: 4, batter1Id: 'p4', batter1Name: 'KL Rahul', batter1Runs: 12, batter1Balls: 10, batter2Id: 'p5', batter2Name: 'Hardik Pandya', batter2Runs: 8, batter2Balls: 6, totalRuns: 28, totalBalls: 16),
    );

    final inn2 = Innings(
      inningsNumber: 2,
      battingTeamId: teamAus.id,
      bowlingTeamId: teamInd.id,
      balls: [],
      battingStats: {},
      bowlingStats: {},
      currentStrikerId: 'a1',
      currentNonStrikerId: 'a2',
      currentBowlerId: 'p7',
      fallOfWickets: [],
      partnerships: [],
      currentPartnership: Partnership(wicketNumber: 1, batter1Id: 'a1', batter1Name: 'Travis Head', batter2Id: 'a2', batter2Name: 'David Warner'),
    );

    _currentMatch = CricketMatch(
      id: 'match_super8_ind_aus',
      title: 'IND vs AUS, T20 World Cup',
      format: MatchFormat.t20,
      totalOvers: 20,
      date: '2026-10-04',
      time: '19:30',
      venue: 'Kensington Oval, Barbados',
      teamA: teamInd,
      teamB: teamAus,
      toss: Toss(winnerTeamId: teamAus.id, decision: 'bowl'),
      status: MatchStatus.live,
      currentInningsIndex: 0,
      innings: [inn1, inn2],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cricket Scoreboard Pro', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.brightness_6),
            onPressed: widget.onToggleTheme,
            tooltip: 'Toggle Theme',
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {},
            tooltip: 'Settings',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Quick Action Grid (Phase 1)
            Row(
              children: [
                Expanded(
                  child: _buildActionCard(
                    context,
                    title: 'New Match',
                    subtitle: 'T20, ODI, Test',
                    icon: Icons.add_circle,
                    color: const Color(0xFF009270),
                    onTap: () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const MatchSetupScreen()));
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionCard(
                    context,
                    title: 'Resume Match',
                    subtitle: 'IND vs AUS (Live)',
                    icon: Icons.play_circle_fill,
                    color: Colors.amber[700]!,
                    onTap: () {
                      if (_currentMatch != null) {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => LiveScoringScreen(match: _currentMatch!)));
                      }
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildActionCard(
                    context,
                    title: 'Match History',
                    subtitle: 'Completed & Saved',
                    icon: Icons.history,
                    color: Colors.blueAccent,
                    onTap: () {},
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionCard(
                    context,
                    title: 'Live Matches',
                    subtitle: 'Real-time Ticker',
                    icon: Icons.sports_cricket,
                    color: Colors.deepPurpleAccent,
                    onTap: () {},
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Live Match Showcase Card
            const Text(
              'LIVE & RECENT MATCH',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: Colors.grey),
            ),
            const SizedBox(height: 10),
            if (_currentMatch != null) _buildLiveMatchCard(context, _currentMatch!),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CircleAvatar(
              backgroundColor: color.withOpacity(0.2),
              foregroundColor: color,
              radius: 20,
              child: Icon(icon, size: 22),
            ),
            const SizedBox(height: 12),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            const SizedBox(height: 4),
            Text(subtitle, style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  Widget _buildLiveMatchCard(BuildContext context, CricketMatch match) {
    final inn = match.innings[match.currentInningsIndex];
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF009270).withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text('${match.format.name.toUpperCase()} · ${match.venue}', style: const TextStyle(color: Color(0xFF009270), fontWeight: FontWeight.bold, fontSize: 11)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: Colors.red.withOpacity(0.2), borderRadius: BorderRadius.circular(4)),
                child: const Text('LIVE', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 10)),
              )
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('${match.teamA.shortName}: ${inn.totalRuns}/${inn.totalWickets} (${inn.oversFormatted} ov)', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              Text('vs ${match.teamB.shortName}', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Colors.grey)),
            ],
          ),
          const SizedBox(height: 8),
          const Text('Toss: AUS won toss & chose to bowl', style: TextStyle(fontSize: 12, color: Colors.grey)),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF009270),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            icon: const Icon(Icons.sports_cricket, size: 18),
            label: const Text('Open Live Scoring Screen'),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => LiveScoringScreen(match: match)));
            },
          ),
        ],
      ),
    );
  }
}
