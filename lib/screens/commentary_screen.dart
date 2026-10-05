// Phase 4 - Ball-by-Ball Commentary Screen (Flutter & Dart Null Safety)
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';

class CommentaryScreen extends StatelessWidget {
  final CricketMatch match;
  const CommentaryScreen({super.key, required this.match});

  @override
  Widget build(BuildContext context) {
    final inn = match.innings[match.currentInningsIndex];
    final balls = inn.balls.reversed.toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Ball-by-Ball Commentary')),
      body: balls.isEmpty
          ? const Center(child: Text('No commentary available yet.'))
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: balls.length,
              separatorBuilder: (_, __) => const Divider(height: 1),
              itemBuilder: (context, index) {
                final b = balls[index];
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: b.isWicket
                              ? Colors.red
                              : (b.runsBat == 6
                                  ? Colors.amber[800]
                                  : (b.runsBat == 4 ? const Color(0xFF009270) : Colors.grey[800])),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          b.isWicket ? 'W' : '${b.runsBat}',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('${b.overNumber}.${b.legalBallNumberInOver}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
                            const SizedBox(height: 2),
                            Text(b.commentary, style: const TextStyle(fontSize: 13)),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
