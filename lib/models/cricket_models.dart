// Cricket Scoreboard Pro - Complete Data Models (Phase 15 Engine)
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

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'role': role.name,
    'isCaptain': isCaptain,
    'isViceCaptain': isViceCaptain,
    'isWicketkeeper': isWicketkeeper,
    'avatar': avatar,
    'country': country,
  };

  factory Player.fromJson(Map<String, dynamic> json) => Player(
    id: json['id'] as String,
    name: json['name'] as String,
    role: PlayerRole.values.firstWhere((e) => e.name == json['role'], orElse: () => PlayerRole.batsman),
    isCaptain: json['isCaptain'] as bool? ?? false,
    isViceCaptain: json['isViceCaptain'] as bool? ?? false,
    isWicketkeeper: json['isWicketkeeper'] as bool? ?? false,
    avatar: json['avatar'] as String?,
    country: json['country'] as String? ?? '',
  );
}

class Team {
  final String id;
  String name;
  String shortName;
  int colorHex;
  List<Player> squad;
  List<String> playingXI; // Player IDs

  Team({
    required this.id,
    required this.name,
    required this.shortName,
    required this.colorHex,
    required this.squad,
    required this.playingXI,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'shortName': shortName,
    'colorHex': colorHex,
    'squad': squad.map((p) => p.toJson()).toList(),
    'playingXI': playingXI,
  };

  factory Team.fromJson(Map<String, dynamic> json) => Team(
    id: json['id'] as String,
    name: json['name'] as String,
    shortName: json['shortName'] as String,
    colorHex: json['colorHex'] as int? ?? 0xFF009270,
    squad: (json['squad'] as List<dynamic>).map((e) => Player.fromJson(e as Map<String, dynamic>)).toList(),
    playingXI: (json['playingXI'] as List<dynamic>).map((e) => e as String).toList(),
  );
}

class DismissalInfo {
  final DismissalType type;
  final String playerOutId;
  final String? bowlerId;
  final String? fielderId;
  final String description;

  DismissalInfo({
    required this.type,
    required this.playerOutId,
    this.bowlerId,
    this.fielderId,
    required this.description,
  });

  Map<String, dynamic> toJson() => {
    'type': type.name,
    'playerOutId': playerOutId,
    'bowlerId': bowlerId,
    'fielderId': fielderId,
    'description': description,
  };

  factory DismissalInfo.fromJson(Map<String, dynamic> json) => DismissalInfo(
    type: DismissalType.values.firstWhere((e) => e.name == json['type'], orElse: () => DismissalType.caught),
    playerOutId: json['playerOutId'] as String,
    bowlerId: json['bowlerId'] as String?,
    fielderId: json['fielderId'] as String?,
    description: json['description'] as String? ?? '',
  );
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

  Map<String, dynamic> toJson() => {
    'id': id,
    'overNumber': overNumber,
    'ballNumberInOver': ballNumberInOver,
    'legalBallNumberInOver': legalBallNumberInOver,
    'strikerId': strikerId,
    'nonStrikerId': nonStrikerId,
    'bowlerId': bowlerId,
    'runsBat': runsBat,
    'runsExtra': runsExtra,
    'extraType': extraType?.name,
    'isLegal': isLegal,
    'isWicket': isWicket,
    'dismissal': dismissal?.toJson(),
    'commentary': commentary,
    'timestamp': timestamp,
  };

  factory BallEvent.fromJson(Map<String, dynamic> json) => BallEvent(
    id: json['id'] as String,
    overNumber: json['overNumber'] as int,
    ballNumberInOver: json['ballNumberInOver'] as int,
    legalBallNumberInOver: json['legalBallNumberInOver'] as int,
    strikerId: json['strikerId'] as String,
    nonStrikerId: json['nonStrikerId'] as String,
    bowlerId: json['bowlerId'] as String,
    runsBat: json['runsBat'] as int,
    runsExtra: json['runsExtra'] as int? ?? 0,
    extraType: json['extraType'] != null ? ExtraType.values.firstWhere((e) => e.name == json['extraType']) : null,
    isLegal: json['isLegal'] as bool,
    isWicket: json['isWicket'] as bool? ?? false,
    dismissal: json['dismissal'] != null ? DismissalInfo.fromJson(json['dismissal'] as Map<String, dynamic>) : null,
    commentary: json['commentary'] as String,
    timestamp: json['timestamp'] as int,
  );
}

class BattingStat {
  final String playerId;
  final String playerName;
  int runs;
  int balls;
  int fours;
  int sixes;
  double strikeRate;
  bool isOut;
  String? dismissalText;
  int battingPosition;

  BattingStat({
    required this.playerId,
    required this.playerName,
    this.runs = 0,
    this.balls = 0,
    this.fours = 0,
    this.sixes = 0,
    this.strikeRate = 0.0,
    this.isOut = false,
    this.dismissalText,
    required this.battingPosition,
  });

  Map<String, dynamic> toJson() => {
    'playerId': playerId,
    'playerName': playerName,
    'runs': runs,
    'balls': balls,
    'fours': fours,
    'sixes': sixes,
    'strikeRate': strikeRate,
    'isOut': isOut,
    'dismissalText': dismissalText,
    'battingPosition': battingPosition,
  };

  factory BattingStat.fromJson(Map<String, dynamic> json) => BattingStat(
    playerId: json['playerId'] as String,
    playerName: json['playerName'] as String,
    runs: json['runs'] as int? ?? 0,
    balls: json['balls'] as int? ?? 0,
    fours: json['fours'] as int? ?? 0,
    sixes: json['sixes'] as int? ?? 0,
    strikeRate: (json['strikeRate'] as num?)?.toDouble() ?? 0.0,
    isOut: json['isOut'] as bool? ?? false,
    dismissalText: json['dismissalText'] as String?,
    battingPosition: json['battingPosition'] as int? ?? 1,
  );
}

class BowlingStat {
  final String playerId;
  final String playerName;
  String oversString;
  int legalBalls;
  int maidens;
  int runs;
  int wickets;
  double economy;
  int dots;
  int wides;
  int noBalls;

  BowlingStat({
    required this.playerId,
    required this.playerName,
    this.oversString = '0.0',
    this.legalBalls = 0,
    this.maidens = 0,
    this.runs = 0,
    this.wickets = 0,
    this.economy = 0.0,
    this.dots = 0,
    this.wides = 0,
    this.noBalls = 0,
  });

  Map<String, dynamic> toJson() => {
    'playerId': playerId,
    'playerName': playerName,
    'oversString': oversString,
    'legalBalls': legalBalls,
    'maidens': maidens,
    'runs': runs,
    'wickets': wickets,
    'economy': economy,
    'dots': dots,
    'wides': wides,
    'noBalls': noBalls,
  };

  factory BowlingStat.fromJson(Map<String, dynamic> json) => BowlingStat(
    playerId: json['playerId'] as String,
    playerName: json['playerName'] as String,
    oversString: json['oversString'] as String? ?? '0.0',
    legalBalls: json['legalBalls'] as int? ?? 0,
    maidens: json['maidens'] as int? ?? 0,
    runs: json['runs'] as int? ?? 0,
    wickets: json['wickets'] as int? ?? 0,
    economy: (json['economy'] as num?)?.toDouble() ?? 0.0,
    dots: json['dots'] as int? ?? 0,
    wides: json['wides'] as int? ?? 0,
    noBalls: json['noBalls'] as int? ?? 0,
  );
}

class FallOfWicket {
  final int wicketNumber;
  final int runs;
  final String oversString;
  final String playerOutName;
  final String playerOutId;

  FallOfWicket({
    required this.wicketNumber,
    required this.runs,
    required this.oversString,
    required this.playerOutName,
    required this.playerOutId,
  });

  Map<String, dynamic> toJson() => {
    'wicketNumber': wicketNumber,
    'runs': runs,
    'oversString': oversString,
    'playerOutName': playerOutName,
    'playerOutId': playerOutId,
  };

  factory FallOfWicket.fromJson(Map<String, dynamic> json) => FallOfWicket(
    wicketNumber: json['wicketNumber'] as int,
    runs: json['runs'] as int,
    oversString: json['oversString'] as String,
    playerOutName: json['playerOutName'] as String,
    playerOutId: json['playerOutId'] as String,
  );
}

class Partnership {
  final int wicketNumber;
  String batter1Id;
  String batter1Name;
  int batter1Runs;
  int batter1Balls;
  String batter2Id;
  String batter2Name;
  int batter2Runs;
  int batter2Balls;
  int totalRuns;
  int totalBalls;

  Partnership({
    required this.wicketNumber,
    required this.batter1Id,
    required this.batter1Name,
    this.batter1Runs = 0,
    this.batter1Balls = 0,
    required this.batter2Id,
    required this.batter2Name,
    this.batter2Runs = 0,
    this.batter2Balls = 0,
    this.totalRuns = 0,
    this.totalBalls = 0,
  });

  Map<String, dynamic> toJson() => {
    'wicketNumber': wicketNumber,
    'batter1Id': batter1Id,
    'batter1Name': batter1Name,
    'batter1Runs': batter1Runs,
    'batter1Balls': batter1Balls,
    'batter2Id': batter2Id,
    'batter2Name': batter2Name,
    'batter2Runs': batter2Runs,
    'batter2Balls': batter2Balls,
    'totalRuns': totalRuns,
    'totalBalls': totalBalls,
  };

  factory Partnership.fromJson(Map<String, dynamic> json) => Partnership(
    wicketNumber: json['wicketNumber'] as int,
    batter1Id: json['batter1Id'] as String,
    batter1Name: json['batter1Name'] as String,
    batter1Runs: json['batter1Runs'] as int? ?? 0,
    batter1Balls: json['batter1Balls'] as int? ?? 0,
    batter2Id: json['batter2Id'] as String,
    batter2Name: json['batter2Name'] as String,
    batter2Runs: json['batter2Runs'] as int? ?? 0,
    batter2Balls: json['batter2Balls'] as int? ?? 0,
    totalRuns: json['totalRuns'] as int? ?? 0,
    totalBalls: json['totalBalls'] as int? ?? 0,
  );
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

  int get totalExtras => wides + noBalls + byes + legByes;
  String get oversFormatted => '$oversCompleted.$ballsInCurrentOver';

  Map<String, dynamic> toJson() => {
    'inningsNumber': inningsNumber,
    'battingTeamId': battingTeamId,
    'bowlingTeamId': bowlingTeamId,
    'totalRuns': totalRuns,
    'totalWickets': totalWickets,
    'totalLegalBalls': totalLegalBalls,
    'oversCompleted': oversCompleted,
    'ballsInCurrentOver': ballsInCurrentOver,
    'balls': balls.map((b) => b.toJson()).toList(),
    'battingStats': battingStats.map((k, v) => MapEntry(k, v.toJson())),
    'bowlingStats': bowlingStats.map((k, v) => MapEntry(k, v.toJson())),
    'currentStrikerId': currentStrikerId,
    'currentNonStrikerId': currentNonStrikerId,
    'currentBowlerId': currentBowlerId,
    'wides': wides,
    'noBalls': noBalls,
    'byes': byes,
    'legByes': legByes,
    'fallOfWickets': fallOfWickets.map((f) => f.toJson()).toList(),
    'partnerships': partnerships.map((p) => p.toJson()).toList(),
    'currentPartnership': currentPartnership.toJson(),
    'isCompleted': isCompleted,
  };
}

class Toss {
  final String winnerTeamId;
  final String decision; // 'bat' or 'bowl'

  Toss({required this.winnerTeamId, required this.decision});

  Map<String, dynamic> toJson() => {'winnerTeamId': winnerTeamId, 'decision': decision};
  factory Toss.fromJson(Map<String, dynamic> json) => Toss(
    winnerTeamId: json['winnerTeamId'] as String,
    decision: json['decision'] as String,
  );
}

class MatchResult {
  final String? winnerTeamId;
  final String winMargin;
  final String resultType;
  final String summary;
  final String? playerOfTheMatchId;
  final String? playerOfTheMatchName;
  final String? reason;

  MatchResult({
    this.winnerTeamId,
    required this.winMargin,
    required this.resultType,
    required this.summary,
    this.playerOfTheMatchId,
    this.playerOfTheMatchName,
    this.reason,
  });

  Map<String, dynamic> toJson() => {
    'winnerTeamId': winnerTeamId,
    'winMargin': winMargin,
    'resultType': resultType,
    'summary': summary,
    'playerOfTheMatchId': playerOfTheMatchId,
    'playerOfTheMatchName': playerOfTheMatchName,
    'reason': reason,
  };
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
}
