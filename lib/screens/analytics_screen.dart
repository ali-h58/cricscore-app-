// Phase 6 & 9 - Advanced Cricket Analytics & Graphs in Flutter
import 'package:flutter/material.dart';
import '../models/cricket_models.dart';

class AnalyticsScreen extends StatelessWidget {
  final CricketMatch match;
  const AnalyticsScreen({super.key, required this.match});

  @override
  Widget build(BuildContext context) {
    final inn = match.innings[0];
    final legalOvers = inn.totalLegalBalls / 6;
    final crr = legalOvers > 0 ? (inn.totalRuns / legalOvers).toStringAsFixed(2) : '0.00';

    return Scaffold(
      appBar: AppBar(title: const Text('Cricket Analytics & Graphs')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Stat Overview Cards
          Row(
            children: [
              Expanded(
                child: _buildMetricTile(context, 'CURRENT RR', crr, Icons.trending_up, Colors.green),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricTile(context, 'PROJECTED', '182', Icons.flag, Colors.blue),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildMetricTile(context, 'BOUNDARY %', '56.4%', Icons.pie_chart, Colors.amber),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricTile(context, 'DOT BALLS', '38', Icons.radio_button_checked, Colors.purple),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Worm Graph Section
          const Text('WORM GRAPH (CUMULATIVE RUNS)', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
          const SizedBox(height: 8),
          Container(
            height: 180,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white12),
            ),
            child: CustomPaint(
              painter: WormGraphPainter(),
              child: Container(),
            ),
          ),
          const SizedBox(height: 20),

          // Manhattan Bars
          const Text('RUNS PER OVER (MANHATTAN)', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
          const SizedBox(height: 8),
          Container(
            height: 160,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white12),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [8, 6, 15, 7, 9, 6, 10, 10, 8, 7, 7, 7, 15, 8, 10, 14, 5].map((runs) {
                final height = (runs / 16.0) * 120.0;
                return Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text('$runs', style: const TextStyle(fontSize: 9, color: Colors.grey)),
                    const SizedBox(height: 2),
                    Container(
                      width: 12,
                      height: height,
                      decoration: BoxDecoration(
                        color: const Color(0xFF009270),
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                  ],
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 20),

          // Phase Stats
          const Text('PHASE BREAKDOWN', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: const [
                  ListTile(
                    leading: CircleAvatar(child: Text('PP')),
                    title: Text('Powerplay (Overs 1 - 6)'),
                    trailing: Text('51/1 (RR 8.50)', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  Divider(),
                  ListTile(
                    leading: CircleAvatar(child: Text('MO')),
                    title: Text('Middle Overs (Overs 7 - 15)'),
                    trailing: Text('82/2 (RR 9.11)', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  Divider(),
                  ListTile(
                    leading: CircleAvatar(child: Text('DO')),
                    title: Text('Death Overs (Overs 16 - 20)'),
                    trailing: Text('19/0 (In Progress)', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricTile(BuildContext context, String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
              Icon(icon, size: 16, color: color),
            ],
          ),
          const SizedBox(height: 6),
          Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

class WormGraphPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paintLine = Paint()
      ..color = const Color(0xFF009270)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final path = Path();
    final points = [
      Offset(0, size.height),
      Offset(size.width * 0.1, size.height * 0.9),
      Offset(size.width * 0.25, size.height * 0.75),
      Offset(size.width * 0.45, size.height * 0.60),
      Offset(size.width * 0.70, size.height * 0.35),
      Offset(size.width * 0.85, size.height * 0.15),
    ];

    path.moveTo(points[0].dx, points[0].dy);
    for (int i = 1; i < points.length; i++) {
      path.lineTo(points[i].dx, points[i].dy);
    }

    canvas.drawPath(path, paintLine);

    // Draw Wickets
    final wicketPaint = Paint()..color = Colors.red;
    canvas.drawCircle(points[2], 5, wicketPaint);
    canvas.drawCircle(points[4], 5, wicketPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
