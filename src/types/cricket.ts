export type MatchFormat = 'T20' | 'ODI' | 'TEST' | 'CUSTOM';

export type PlayerRole = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  isWicketkeeper?: boolean;
  avatar?: string;
  country?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  textColor?: string;
  squad: Player[];
  playingXI: string[]; // player IDs
}

export type DismissalType =
  | 'bowled'
  | 'caught'
  | 'lbw'
  | 'run_out'
  | 'stumped'
  | 'hit_wicket'
  | 'retired'
  | 'obstructing';

export interface DismissalInfo {
  type: DismissalType;
  playerOutId: string;
  bowlerId?: string;
  fielderId?: string;
  desc: string;
}

export type ExtraType = 'wide' | 'no_ball' | 'bye' | 'leg_bye' | 'penalty';

export interface BallEvent {
  id: string;
  ballNumberInOver: number; // 1..n (including illegal)
  legalBallNumberInOver: number; // 1..6
  overNumber: number; // 0-indexed (e.g. 0 is 1st over)
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  runsBat: number; // 0,1,2,3,4,6
  runsExtra: number;
  extraType?: ExtraType;
  isLegal: boolean;
  isWicket: boolean;
  dismissal?: DismissalInfo;
  commentary: string;
  timestamp: number;
}

export interface BattingStat {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalText?: string;
  battingPosition: number;
}

export interface BowlingStat {
  playerId: string;
  playerName: string;
  oversString: string; // e.g. "3.4"
  legalBalls: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  dots: number;
  fours: number;
  sixes: number;
  wides: number;
  noBalls: number;
}

export interface ExtrasBreakdown {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalty: number;
  total: number;
}

export interface FallOfWicket {
  wicketNumber: number;
  runs: number;
  oversString: string;
  playerOutName: string;
  playerOutId: string;
}

export interface Partnership {
  wicketNumber: number;
  batter1Id: string;
  batter1Name: string;
  batter1Runs: number;
  batter1Balls: number;
  batter2Id: string;
  batter2Name: string;
  batter2Runs: number;
  batter2Balls: number;
  totalRuns: number;
  totalBalls: number;
}

export interface OverSummary {
  overNumber: number;
  bowlerId: string;
  bowlerName: string;
  runsInOver: number;
  wicketsInOver: number;
  balls: BallEvent[];
  cumulativeRuns: number;
  cumulativeWickets: number;
}

export interface Innings {
  inningsNumber: 1 | 2;
  battingTeamId: string;
  bowlingTeamId: string;
  totalRuns: number;
  totalWickets: number;
  totalLegalBalls: number;
  oversCompleted: number; // integer overs
  ballsInCurrentOver: number; // 0..5
  balls: BallEvent[];
  overs: OverSummary[];
  battingStats: Record<string, BattingStat>;
  bowlingStats: Record<string, BowlingStat>;
  currentStrikerId: string;
  currentNonStrikerId: string;
  currentBowlerId: string;
  extras: ExtrasBreakdown;
  fallOfWickets: FallOfWicket[];
  partnerships: Partnership[];
  currentPartnership: Partnership;
  isCompleted: boolean;
}

export interface Toss {
  winnerTeamId: string;
  decision: 'bat' | 'bowl';
}

export interface MatchResult {
  winnerTeamId?: string;
  winMargin?: string;
  resultType: 'won_by_runs' | 'won_by_wickets' | 'tie' | 'super_over' | 'no_result' | 'draw';
  summary: string;
  playerOfTheMatchId?: string;
  playerOfTheMatchName?: string;
  reason?: string;
}

export interface Match {
  id: string;
  title: string;
  format: MatchFormat;
  totalOvers: number;
  date: string;
  time: string;
  venue: string;
  teamA: Team;
  teamB: Team;
  toss?: Toss;
  status: 'upcoming' | 'live' | 'completed' | 'abandoned';
  currentInningsIndex: 0 | 1;
  innings: [Innings, Innings];
  result?: MatchResult;
  createdAt: number;
  updatedAt: number;
}

export interface WinProbabilityEstimate {
  teamAPercentage: number;
  teamBPercentage: number;
  teamAName: string;
  teamBName: string;
  projectedScore: number;
  currentRunRate: number;
  requiredRunRate: number;
  targetRuns?: number;
  runsRemaining?: number;
  ballsRemaining?: number;
  keyFactors: string[];
}
