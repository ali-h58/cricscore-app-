// Phase 7 & 8 - Score Predictor & Live Win Probability in Flutter
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';

class ScorePredictorScreen extends StatelessWidget {
  final CricketMatch match;
  const ScorePredictorScreen({super.key, required this.match});

  @override
  Widget build(BuildContext context) {
    const teamAWinPct = 68;
    const teamBWinPct = 32;

    return Scaffold(
      appBar: AppBar(title: const Text('Score Predictor & Win Probability')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Win Probability Card (Phase 8)
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const Text('LIVE WIN PROBABILITY', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1.2, color: Colors.grey)),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(
                        children: [
                          Text('${match.teamA.shortName}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          const SizedBox(height: 4),
                          const Text('$teamAWinPct%', style: TextStyle(fontSize: 32, fontWeight: FontWeight.black, color: Color(0xFF009270))),
                        ],
                      ),
                      Container(width: 1, height: 50, color: Colors.grey.withOpacity(0.3)),
                      Column(
                        children: [
                          Text('${match.teamB.shortName}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          const SizedBox(height: 4),
                          const Text('$teamBWinPct%', style: TextStyle(fontSize: 32, fontWeight: FontWeight.black, color: Colors.amber)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: teamAWinPct / 100.0,
                      minHeight: 10,
                      backgroundColor: Colors.amber,
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF009270)),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Score Predictor Table (Phase 7)
          const Text('1ST INNINGS PROJECTED SCORE', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _buildProjectionRow('Current Run Rate (9.12 RPO)', '182'),
                  const Divider(),
                  _buildProjectionRow('At 6.00 Runs Per Over', '172'),
                  const Divider(),
                  _buildProjectionRow('At 8.00 Runs Per Over', '178'),
                  const Divider(),
                  _buildProjectionRow('At 10.00 Runs Per Over', '185'),
                  const Divider(),
                  _buildProjectionRow('At 12.00 Runs Per Over', '192'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Key Match Factors
          const Text('MATCH SITUATION FACTORS', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  ListTile(
                    leading: Icon(Icons.check_circle, color: Color(0xFF009270)),
                    title: Text('High run-rate acceleration in middle overs (9.12 RPO).'),
                  ),
                  ListTile(
                    leading: Icon(Icons.check_circle, color: Color(0xFF009270)),
                    title: Text('7 wickets in hand entering death overs with set finishers.'),
                  ),
                  ListTile(
                    leading: Icon(Icons.warning, color: Colors.amber),
                    title: Text('Starc and Cummins have 2 death overs remaining.'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectionRow(String scenario, String score) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(scenario, style: const TextStyle(fontSize: 13)),
          Text(score, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF009270))),
        ],
      ),
    );
  }
}
