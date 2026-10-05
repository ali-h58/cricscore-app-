// Phase 2 - Teams, Players & Toss Setup Screen (Flutter & Dart Null Safety)
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';

class MatchSetupScreen extends StatefulWidget {
  const MatchSetupScreen({super.key});

  @override
  State<MatchSetupScreen> createState() => _MatchSetupScreenState();
}

class _MatchSetupScreenState extends State<MatchSetupScreen> {
  String _teamAName = 'India';
  String _teamBName = 'Australia';
  MatchFormat _selectedFormat = MatchFormat.t20;
  int _overs = 20;
  String _tossWinner = 'teamA';
  String _tossDecision = 'bat';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('New Match Setup')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Teams Section
            const Text('TEAMS', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    TextFormField(
                      initialValue: _teamAName,
                      decoration: const InputDecoration(labelText: 'Team A Name', prefixIcon: Icon(Icons.shield)),
                      onChanged: (val) => _teamAName = val,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      initialValue: _teamBName,
                      decoration: const InputDecoration(labelText: 'Team B Name', prefixIcon: Icon(Icons.shield_outlined)),
                      onChanged: (val) => _teamBName = val,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Format & Overs
            const Text('MATCH FORMAT & OVERS', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    DropdownButtonFormField<MatchFormat>(
                      value: _selectedFormat,
                      decoration: const InputDecoration(labelText: 'Match Format'),
                      items: const [
                        DropdownMenuItem(value: MatchFormat.t20, child: Text('T20 (20 Overs)')),
                        DropdownMenuItem(value: MatchFormat.odi, child: Text('ODI (50 Overs)')),
                        DropdownMenuItem(value: MatchFormat.testMatch, child: Text('Test Match')),
                        DropdownMenuItem(value: MatchFormat.custom, child: Text('Custom Overs')),
                      ],
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedFormat = val);
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Toss Section
            const Text('TOSS SELECTION', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Who won the toss?'),
                    Row(
                      children: [
                        Expanded(
                          child: RadioListTile<String>(
                            title: Text(_teamAName),
                            value: 'teamA',
                            groupValue: _tossWinner,
                            onChanged: (v) => setState(() => _tossWinner = v!),
                          ),
                        ),
                        Expanded(
                          child: RadioListTile<String>(
                            title: Text(_teamBName),
                            value: 'teamB',
                            groupValue: _tossWinner,
                            onChanged: (v) => setState(() => _tossWinner = v!),
                          ),
                        ),
                      ],
                    ),
                    const Divider(),
                    const Text('Elected to:'),
                    Row(
                      children: [
                        Expanded(
                          child: RadioListTile<String>(
                            title: const Text('Bat'),
                            value: 'bat',
                            groupValue: _tossDecision,
                            onChanged: (v) => setState(() => _tossDecision = v!),
                          ),
                        ),
                        Expanded(
                          child: RadioListTile<String>(
                            title: const Text('Bowl'),
                            value: 'bowl',
                            groupValue: _tossDecision,
                            onChanged: (v) => setState(() => _tossDecision = v!),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF009270),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () {
                  Navigator.pop(context);
                },
                child: const Text('Start Match & Scoring', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
