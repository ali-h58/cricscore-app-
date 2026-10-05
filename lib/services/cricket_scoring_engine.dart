// Professional Cricket Scoring Engine in Dart with Null Safety
// Handles legal ball calculation, overs, strike rotation, commentary, win predictor, and fall of wickets

import 'dart:math';
import '../models/cricket_models.dart';

class CricketScoringEngine {
  /// Score a ball in the match
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

    final strikerPlayer = battingTeam.squad.firstWhere(
      (p) => p.id == innings.currentStrikerId,
      orElse: () => Player(id: '', name: 'Striker', role: PlayerRole.batsman),
    );
    final bowlerPlayer = bowlingTeam.squad.firstWhere(
      (p) => p.id == innings.currentBowlerId,
      orElse: () => Player(id: '', name: 'Bowler', role: PlayerRole.bowler),
    );

    // Generate Commentary
    final commentary = _generateCommentary(
      bowlerName: bowlerPlayer.name,
      batterName: strikerPlayer.name,
      runsBat: runsBat,
      runsExtra: runsExtra,
      extraType: extraType,
      isWicket: isWicket,
      dismissal: dismissal,
    );

    final ballEvent = BallEvent(
      id: 'ball_${DateTime.now().millisecondsSinceEpoch}',
      overNumber: innings.oversCompleted,
      ballNumberInOver: innings.balls.where((b) => b.overNumber == innings.oversCompleted).length + 1,
      legalBallNumberInOver: isLegal ? innings.ballsInCurrentOver + 1 : innings.ballsInCurrentOver,
      strikerId: innings.currentStrikerId,
      nonStrikerId: innings.currentNonStrikerId,
      bowlerId: innings.currentBowlerId,
      runsBat: runsBat,
      runsExtra: runsExtra,
      extraType: extraType,
      isLegal: isLegal,
      isWicket: isWicket,
      dismissal: dismissal,
      commentary: commentary,
      timestamp: DateTime.now().millisecondsSinceEpoch,
    );

    innings.balls.add(ballEvent);
    final int totalBallRuns = runsBat + runsExtra;
    innings.totalRuns += totalBallRuns;

    // Extras
    if (extraType != null) {
      switch (extraType) {
        case ExtraType.wide:
          innings.wides += runsExtra;
          break;
        case ExtraType.noBall:
          innings.noBalls += runsExtra;
          break;
        case ExtraType.bye:
          innings.byes += runsExtra;
          break;
        case ExtraType.legBye:
          innings.legByes += runsExtra;
          break;
        case ExtraType.penalty:
          break;
      }
    }

    // Update Batting Stats
    final strikerStat = innings.battingStats[innings.currentStrikerId];
    if (strikerStat != null) {
      if (extraType != ExtraType.wide) {
        strikerStat.balls += 1;
      }
      strikerStat.runs += runsBat;
      if (runsBat == 4) strikerStat.fours += 1;
      if (runsBat == 6) strikerStat.sixes += 1;
      strikerStat.strikeRate = strikerStat.balls > 0
          ? double.parse(((strikerStat.runs / strikerStat.balls) * 100).toStringAsFixed(1))
          : 0.0;
    }

    // Update Bowling Stats
    final bowlerStat = innings.bowlingStats[innings.currentBowlerId];
    if (bowlerStat != null) {
      if (isLegal) {
        bowlerStat.legalBalls += 1;
        bowlerStat.oversString = '${bowlerStat.legalBalls ~/ 6}.${bowlerStat.legalBalls % 6}';
      }
      int runsCharged = runsBat;
      if (extraType == ExtraType.wide || extraType == ExtraType.noBall) {
        runsCharged += runsExtra;
      }
      bowlerStat.runs += runsCharged;

      if (runsBat == 0 && extraType == null) bowlerStat.dots += 1;
      if (extraType == ExtraType.wide) bowlerStat.wides += runsExtra;
      if (extraType == ExtraType.noBall) bowlerStat.noBalls += 1;

      final double bowlerOvers = bowlerStat.legalBalls / 6;
      bowlerStat.economy = bowlerOvers > 0
          ? double.parse((bowlerStat.runs / bowlerOvers).toStringAsFixed(2))
          : 0.0;
    }

    // Update Partnership
    innings.currentPartnership.totalRuns += totalBallRuns;
    if (extraType != ExtraType.wide) innings.currentPartnership.totalBalls += 1;
    if (innings.currentStrikerId == innings.currentPartnership.batter1Id) {
      innings.currentPartnership.batter1Runs += runsBat;
      if (extraType != ExtraType.wide) innings.currentPartnership.batter1Balls += 1;
    } else {
      innings.currentPartnership.batter2Runs += runsBat;
      if (extraType != ExtraType.wide) innings.currentPartnership.batter2Balls += 1;
    }

    // Wicket handling
    if (isWicket && dismissal != null) {
      innings.totalWickets += 1;
      final outStat = innings.battingStats[dismissal.playerOutId];
      if (outStat != null) {
        outStat.isOut = true;
        outStat.dismissalText = dismissal.description.isNotEmpty
            ? dismissal.description
            : '${dismissal.type.name} b ${bowlerPlayer.name}';
      }

      if (dismissal.type != DismissalType.runOut && bowlerStat != null) {
        bowlerStat.wickets += 1;
      }

      // Record Fall of Wicket
      final int curBalls = innings.totalLegalBalls + (isLegal ? 1 : 0);
      innings.fallOfWickets.add(FallOfWicket(
        wicketNumber: innings.totalWickets,
        runs: innings.totalRuns,
        oversString: '${curBalls ~/ 6}.${curBalls % 6}',
        playerOutName: strikerPlayer.name,
        playerOutId: dismissal.playerOutId,
      ));

      innings.partnerships.add(Partnership.fromJson(innings.currentPartnership.toJson()));

      // Assign new batter
      if (newStrikerId != null && newStrikerId.isNotEmpty) {
        innings.currentStrikerId = newStrikerId;
      } else {
        final used = innings.battingStats.values.where((b) => b.balls > 0 || b.isOut).map((b) => b.playerId).toSet();
        used.add(innings.currentStrikerId);
        used.add(innings.currentNonStrikerId);
        final next = battingTeam.playingXI.firstWhere((id) => !used.contains(id), orElse: () => '');
        if (next.isNotEmpty) {
          innings.currentStrikerId = next;
        }
      }

      final newP1 = battingTeam.squad.firstWhere((p) => p.id == innings.currentStrikerId, orElse: () => strikerPlayer);
      final newP2 = battingTeam.squad.firstWhere((p) => p.id == innings.currentNonStrikerId, orElse: () => strikerPlayer);
      innings.currentPartnership = Partnership(
        wicketNumber: innings.totalWickets + 1,
        batter1Id: innings.currentStrikerId,
        batter1Name: newP1.name,
        batter2Id: innings.currentNonStrikerId,
        batter2Name: newP2.name,
      );
    }

    // Legal ball & over progression
    bool overEnded = false;
    if (isLegal) {
      innings.totalLegalBalls += 1;
      innings.ballsInCurrentOver += 1;

      if (innings.ballsInCurrentOver == 6) {
        overEnded = true;
        innings.oversCompleted += 1;
        innings.ballsInCurrentOver = 0;

        // Check maiden
        final overBalls = innings.balls.where((b) => b.overNumber == innings.oversCompleted - 1 && b.bowlerId == bowlerPlayer.id);
        final overRuns = overBalls.fold<int>(0, (sum, b) => sum + b.runsBat + (b.extraType == ExtraType.wide || b.extraType == ExtraType.noBall ? b.runsExtra : 0));
        if (overRuns == 0 && bowlerStat != null) {
          bowlerStat.maidens += 1;
        }

        // Rotate strike at over end
        final temp = innings.currentStrikerId;
        innings.currentStrikerId = innings.currentNonStrikerId;
        innings.currentNonStrikerId = temp;

        if (nextBowlerId != null && nextBowlerId.isNotEmpty) {
          innings.currentBowlerId = nextBowlerId;
        }
      }
    }

    // Rotate strike on odd runs if over didn't end
    final runsToRotate = runsBat + (extraType == ExtraType.bye || extraType == ExtraType.legBye ? runsExtra : 0);
    if (runsToRotate % 2 != 0 && !overEnded) {
      final temp = innings.currentStrikerId;
      innings.currentStrikerId = innings.currentNonStrikerId;
      innings.currentNonStrikerId = temp;
    }

    // Check Match Completion
    _checkMatchCompletion(match);
  }

  static void switchStrike(CricketMatch match) {
    final inn = match.innings[match.currentInningsIndex];
    final temp = inn.currentStrikerId;
    inn.currentStrikerId = inn.currentNonStrikerId;
    inn.currentNonStrikerId = temp;
  }

  static void _checkMatchCompletion(CricketMatch match) {
    final inn = match.innings[match.currentInningsIndex];
    final battingTeam = match.teamA.id == inn.battingTeamId ? match.teamA : match.teamB;
    final bowlingTeam = match.teamA.id == inn.bowlingTeamId ? match.teamA : match.teamB;

    if (match.currentInningsIndex == 1) {
      final target = match.innings[0].totalRuns + 1;
      if (inn.totalRuns >= target) {
        match.status = MatchStatus.completed;
        final wicketsLeft = 10 - inn.totalWickets;
        match.result = MatchResult(
          winnerTeamId: battingTeam.id,
          resultType: 'won_by_wickets',
          winMargin: '$wicketsLeft wickets',
          summary: '${battingTeam.name} won by $wicketsLeft wickets',
        );
      } else if (inn.totalWickets >= 10 || inn.oversCompleted >= match.totalOvers) {
        match.status = MatchStatus.completed;
        if (inn.totalRuns == match.innings[0].totalRuns) {
          match.result = MatchResult(
            resultType: 'tie',
            winMargin: 'Scores level',
            summary: 'Match Tied! (Super Over needed)',
          );
        } else {
          final runMargin = match.innings[0].totalRuns - inn.totalRuns;
          match.result = MatchResult(
            winnerTeamId: bowlingTeam.id,
            resultType: 'won_by_runs',
            winMargin: '$runMargin runs',
            summary: '${bowlingTeam.name} won by $runMargin runs',
          );
        }
      }
    } else if (match.currentInningsIndex == 0) {
      if (inn.totalWickets >= 10 || inn.oversCompleted >= match.totalOvers) {
        inn.isCompleted = true;
      }
    }
  }

  static String _generateCommentary({
    required String bowlerName,
    required String batterName,
    required int runsBat,
    required int runsExtra,
    ExtraType? extraType,
    bool isWicket = false,
    DismissalInfo? dismissal,
  }) {
    if (isWicket) {
      return '$bowlerName to $batterName, OUT! Stumps rattle or edge carried! Massive breakthrough!';
    }
    if (runsBat == 6) {
      return '$bowlerName to $batterName, SIX! Massive hit over deep mid-wicket into the stands!';
    }
    if (runsBat == 4) {
      return '$bowlerName to $batterName, FOUR! Pierces the gap with sheer precision!';
    }
    if (extraType == ExtraType.wide) {
      return '$bowlerName to $batterName, Wide ball! Straying down leg side.';
    }
    if (runsBat == 1) {
      return '$bowlerName to $batterName, 1 run. Tucked away gently for a single.';
    }
    return '$bowlerName to $batterName, no run. Solidly defended back to the bowler.';
  }
}
