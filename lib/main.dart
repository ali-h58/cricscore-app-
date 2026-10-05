// Cricket Scoreboard Pro - Flutter Main Application (Dart 3+ Null Safety)
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
}
