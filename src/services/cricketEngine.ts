import {
  Match,
  Innings,
  BallEvent,
  BattingStat,
  BowlingStat,
  ExtraType,
  DismissalInfo,
  OverSummary,
  Player,
  MatchResult,
} from '../types/cricket';
import { generateCommentary } from './commentaryEngine';

export function createEmptyInnings(
  inningsNumber: 1 | 2,
  battingTeamId: string,
  bowlingTeamId: string,
  battingPlayers: Player[],
  bowlingPlayers: Player[]
): Innings {
  const battingStats: Record<string, BattingStat> = {};
  battingPlayers.forEach((p, idx) => {
    battingStats[p.id] = {
      playerId: p.id,
      playerName: p.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      battingPosition: idx + 1,
    };
  });

  const bowlingStats: Record<string, BowlingStat> = {};
  bowlingPlayers.forEach((p) => {
    bowlingStats[p.id] = {
      playerId: p.id,
      playerName: p.name,
      oversString: '0.0',
      legalBalls: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      economy: 0,
      dots: 0,
      fours: 0,
      sixes: 0,
      wides: 0,
      noBalls: 0,
    };
  });

  const striker = battingPlayers[0]?.id || '';
  const nonStriker = battingPlayers[1]?.id || '';
  const bowler = bowlingPlayers[bowlingPlayers.length - 1]?.id || bowlingPlayers[0]?.id || '';

  return {
    inningsNumber,
    battingTeamId,
    bowlingTeamId,
    totalRuns: 0,
    totalWickets: 0,
    totalLegalBalls: 0,
    oversCompleted: 0,
    ballsInCurrentOver: 0,
    balls: [],
    overs: [],
    battingStats,
    bowlingStats,
    currentStrikerId: striker,
    currentNonStrikerId: nonStriker,
    currentBowlerId: bowler,
    extras: {
      wides: 0,
      noBalls: 0,
      byes: 0,
      legByes: 0,
      penalty: 0,
      total: 0,
    },
    fallOfWickets: [],
    partnerships: [],
    currentPartnership: {
      wicketNumber: 1,
      batter1Id: striker,
      batter1Name: battingPlayers[0]?.name || 'Striker',
      batter1Runs: 0,
      batter1Balls: 0,
      batter2Id: nonStriker,
      batter2Name: battingPlayers[1]?.name || 'Non-Striker',
      batter2Runs: 0,
      batter2Balls: 0,
      totalRuns: 0,
      totalBalls: 0,
    },
    isCompleted: false,
  };
}

export interface ScoreBallInput {
  runsBat: number;
  runsExtra?: number;
  extraType?: ExtraType;
  isWicket?: boolean;
  dismissal?: DismissalInfo;
  newStrikerId?: string;
  nextBowlerId?: string;
}

export function scoreBall(match: Match, input: ScoreBallInput): { match: Match; overCompleted: boolean; matchEnded: boolean; event: BallEvent } {
  // Deep clone to guarantee immutability
  const clonedMatch: Match = JSON.parse(JSON.stringify(match));
  const innings = clonedMatch.innings[clonedMatch.currentInningsIndex];

  const runsBat = input.runsBat || 0;
  const runsExtra = input.runsExtra || (input.extraType ? 1 : 0);
  const extraType = input.extraType;
  const isLegal = extraType !== 'wide' && extraType !== 'no_ball';
  const isWicket = !!input.isWicket;
  const dismissal = input.dismissal;

  const strikerId = innings.currentStrikerId;
  const nonStrikerId = innings.currentNonStrikerId;
  const bowlerId = innings.currentBowlerId;

  const battingTeam = clonedMatch.teamA.id === innings.battingTeamId ? clonedMatch.teamA : clonedMatch.teamB;
  const bowlingTeam = clonedMatch.teamA.id === innings.bowlingTeamId ? clonedMatch.teamA : clonedMatch.teamB;

  const strikerPlayer = battingTeam.squad.find((p) => p.id === strikerId) || { name: 'Batter' };
  const nonStrikerPlayer = battingTeam.squad.find((p) => p.id === nonStrikerId) || { name: 'Non-Striker' };
  const bowlerPlayer = bowlingTeam.squad.find((p) => p.id === bowlerId) || { name: 'Bowler' };
  const fielderPlayer = dismissal?.fielderId ? bowlingTeam.squad.find((p) => p.id === dismissal.fielderId) : undefined;

  const currentOverNumber = innings.oversCompleted;
  const legalBallNumberInOver = isLegal ? innings.ballsInCurrentOver + 1 : innings.ballsInCurrentOver;

  // Generate Commentary
  const commentary = generateCommentary({
    bowlerName: bowlerPlayer.name,
    batterName: strikerPlayer.name,
    runsBat,
    runsExtra,
    extraType,
    isWicket,
    dismissal,
    fielderName: fielderPlayer?.name,
    overNumber: currentOverNumber,
    legalBallNumber: Math.max(1, legalBallNumberInOver),
  });

  const ballEvent: BallEvent = {
    id: `ball-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    ballNumberInOver: innings.balls.filter((b) => b.overNumber === currentOverNumber).length + 1,
    legalBallNumberInOver: isLegal ? legalBallNumberInOver : innings.ballsInCurrentOver,
    overNumber: currentOverNumber,
    strikerId,
    nonStrikerId,
    bowlerId,
    runsBat,
    runsExtra,
    extraType,
    isLegal,
    isWicket,
    dismissal,
    commentary,
    timestamp: Date.now(),
  };

  // Add ball event
  innings.balls.push(ballEvent);

  // Update total score
  const ballTotalRuns = runsBat + runsExtra;
  innings.totalRuns += ballTotalRuns;

  // Update Extras
  if (extraType) {
    if (extraType === 'wide') innings.extras.wides += runsExtra;
    if (extraType === 'no_ball') innings.extras.noBalls += (runsExtra || 1);
    if (extraType === 'bye') innings.extras.byes += runsExtra;
    if (extraType === 'leg_bye') innings.extras.legByes += runsExtra;
    if (extraType === 'penalty') innings.extras.penalty += runsExtra;
    innings.extras.total += runsExtra;
  }

  // Update Batting Stats
  const strikerStat = innings.battingStats[strikerId];
  if (strikerStat) {
    // Only increment balls faced if wide wasn't bowled
    if (extraType !== 'wide') {
      strikerStat.balls += 1;
    }
    strikerStat.runs += runsBat;
    if (runsBat === 4) strikerStat.fours += 1;
    if (runsBat === 6) strikerStat.sixes += 1;
    strikerStat.strikeRate = strikerStat.balls > 0 ? Number(((strikerStat.runs / strikerStat.balls) * 100).toFixed(1)) : 0;
  }

  // Update Bowling Stats
  const bowlerStat = innings.bowlingStats[bowlerId];
  if (bowlerStat) {
    if (isLegal) {
      bowlerStat.legalBalls += 1;
      const fullOvers = Math.floor(bowlerStat.legalBalls / 6);
      const remBalls = bowlerStat.legalBalls % 6;
      bowlerStat.oversString = `${fullOvers}.${remBalls}`;
    }

    // Runs charged to bowler (byes and leg-byes are not charged to bowler)
    let runsChargedToBowler = runsBat;
    if (extraType === 'wide' || extraType === 'no_ball') {
      runsChargedToBowler += runsExtra;
    }
    bowlerStat.runs += runsChargedToBowler;

    if (runsBat === 0 && !extraType) {
      bowlerStat.dots += 1;
    }
    if (runsBat === 4) bowlerStat.fours += 1;
    if (runsBat === 6) bowlerStat.sixes += 1;
    if (extraType === 'wide') bowlerStat.wides += runsExtra;
    if (extraType === 'no_ball') bowlerStat.noBalls += 1;

    // Calculate economy
    const totalBowlerOvers = bowlerStat.legalBalls / 6;
    bowlerStat.economy = totalBowlerOvers > 0 ? Number((bowlerStat.runs / totalBowlerOvers).toFixed(2)) : 0;
  }

  // Update Partnership
  if (innings.currentPartnership) {
    innings.currentPartnership.totalRuns += ballTotalRuns;
    if (extraType !== 'wide') {
      innings.currentPartnership.totalBalls += 1;
    }
    if (strikerId === innings.currentPartnership.batter1Id) {
      innings.currentPartnership.batter1Runs += runsBat;
      if (extraType !== 'wide') innings.currentPartnership.batter1Balls += 1;
    } else {
      innings.currentPartnership.batter2Runs += runsBat;
      if (extraType !== 'wide') innings.currentPartnership.batter2Balls += 1;
    }
  }

  // Handle Wickets
  if (isWicket && dismissal) {
    innings.totalWickets += 1;
    const playerOut = battingTeam.squad.find((p) => p.id === dismissal.playerOutId);
    const outStat = innings.battingStats[dismissal.playerOutId];
    if (outStat) {
      outStat.isOut = true;
      let dismissalText = '';
      if (dismissal.type === 'bowled') dismissalText = `b ${bowlerPlayer.name}`;
      else if (dismissal.type === 'caught') dismissalText = `c ${fielderPlayer ? fielderPlayer.name : 'sub'} b ${bowlerPlayer.name}`;
      else if (dismissal.type === 'lbw') dismissalText = `lbw b ${bowlerPlayer.name}`;
      else if (dismissal.type === 'stumped') dismissalText = `st ${fielderPlayer ? fielderPlayer.name : 'wk'} b ${bowlerPlayer.name}`;
      else if (dismissal.type === 'run_out') dismissalText = `run out (${fielderPlayer ? fielderPlayer.name : 'direct hit'})`;
      else dismissalText = dismissal.type;
      outStat.dismissalText = dismissalText;
    }

    // Bowler wicket tally (run outs are not credited to bowler)
    if (bowlerStat && dismissal.type !== 'run_out') {
      bowlerStat.wickets += 1;
    }

    // Fall of Wicket Record
    const curBalls = innings.totalLegalBalls + (isLegal ? 1 : 0);
    const fovOvers = `${Math.floor(curBalls / 6)}.${curBalls % 6}`;
    innings.fallOfWickets.push({
      wicketNumber: innings.totalWickets,
      runs: innings.totalRuns,
      oversString: fovOvers,
      playerOutName: playerOut?.name || 'Batsman',
      playerOutId: dismissal.playerOutId,
    });

    // Close current partnership
    innings.partnerships.push({ ...innings.currentPartnership });

    // Pick new batter
    if (input.newStrikerId) {
      if (dismissal.playerOutId === strikerId) {
        innings.currentStrikerId = input.newStrikerId;
      } else {
        innings.currentNonStrikerId = input.newStrikerId;
      }
    } else {
      // Auto-assign next batter in playing XI
      const usedBatterIds = new Set(Object.values(innings.battingStats).filter((s) => s.balls > 0 || s.isOut).map((s) => s.playerId));
      usedBatterIds.add(innings.currentStrikerId);
      usedBatterIds.add(innings.currentNonStrikerId);

      const nextBatterId = battingTeam.playingXI.find((pid) => !usedBatterIds.has(pid));
      if (nextBatterId) {
        if (dismissal.playerOutId === strikerId) {
          innings.currentStrikerId = nextBatterId;
        } else {
          innings.currentNonStrikerId = nextBatterId;
        }
      }
    }

    const newBatter1 = battingTeam.squad.find((p) => p.id === innings.currentStrikerId);
    const newBatter2 = battingTeam.squad.find((p) => p.id === innings.currentNonStrikerId);

    innings.currentPartnership = {
      wicketNumber: innings.totalWickets + 1,
      batter1Id: innings.currentStrikerId,
      batter1Name: newBatter1?.name || 'Batter 1',
      batter1Runs: 0,
      batter1Balls: 0,
      batter2Id: innings.currentNonStrikerId,
      batter2Name: newBatter2?.name || 'Batter 2',
      batter2Runs: 0,
      batter2Balls: 0,
      totalRuns: 0,
      totalBalls: 0,
    };
  }

  // Handle Legal Ball Count & Over Progress
  let overCompleted = false;
  if (isLegal) {
    innings.totalLegalBalls += 1;
    innings.ballsInCurrentOver += 1;

    // Check if over is completed
    if (innings.ballsInCurrentOver === 6) {
      overCompleted = true;
      innings.oversCompleted += 1;
      innings.ballsInCurrentOver = 0;

      // Check maiden over for bowler
      const ballsInThisOver = innings.balls.filter((b) => b.overNumber === currentOverNumber && b.bowlerId === bowlerId);
      const runsConcededInOver = ballsInThisOver.reduce((sum, b) => {
        let r = b.runsBat;
        if (b.extraType === 'wide' || b.extraType === 'no_ball') r += b.runsExtra;
        return sum + r;
      }, 0);

      if (runsConcededInOver === 0 && bowlerStat) {
        bowlerStat.maidens += 1;
      }

      // Record Over Summary for graphs & commentary
      const wicketsInThisOver = ballsInThisOver.filter((b) => b.isWicket).length;
      innings.overs.push({
        overNumber: currentOverNumber + 1,
        bowlerId,
        bowlerName: bowlerPlayer.name,
        runsInOver: runsConcededInOver,
        wicketsInOver: wicketsInThisOver,
        balls: ballsInThisOver,
        cumulativeRuns: innings.totalRuns,
        cumulativeWickets: innings.totalWickets,
      });

      // Rotate strike at end of over
      const temp = innings.currentStrikerId;
      innings.currentStrikerId = innings.currentNonStrikerId;
      innings.currentNonStrikerId = temp;

      // If nextBowlerId supplied
      if (input.nextBowlerId) {
        innings.currentBowlerId = input.nextBowlerId;
      }
    }
  }

  // Strike rotation for odd runs (1, 3, 5) - applies if ball wasn't an over-ending rotation
  const runsToRotate = (runsBat + (extraType === 'bye' || extraType === 'leg_bye' ? runsExtra : 0));
  if (runsToRotate % 2 !== 0 && !overCompleted) {
    const temp = innings.currentStrikerId;
    innings.currentStrikerId = innings.currentNonStrikerId;
    innings.currentNonStrikerId = temp;
  }

  // Check Innings & Match Termination Conditions
  let matchEnded = false;
  const isAllOut = innings.totalWickets >= 10 || innings.totalWickets >= (battingTeam.playingXI.length - 1);
  const isOversFinished = innings.oversCompleted >= clonedMatch.totalOvers;

  // If 2nd innings: check if target is chased down or team defended
  if (clonedMatch.currentInningsIndex === 1) {
    const target = clonedMatch.innings[0].totalRuns + 1;
    if (innings.totalRuns >= target) {
      // Chasing team won!
      matchEnded = true;
      innings.isCompleted = true;
      clonedMatch.status = 'completed';
      const wicketsRemaining = 10 - innings.totalWickets;
      clonedMatch.result = {
        winnerTeamId: battingTeam.id,
        resultType: 'won_by_wickets',
        winMargin: `${wicketsRemaining} wicket${wicketsRemaining > 1 ? 's' : ''}`,
        summary: `${battingTeam.name} won by ${wicketsRemaining} wicket${wicketsRemaining > 1 ? 's' : ''}`,
      };
    } else if (isAllOut || isOversFinished) {
      matchEnded = true;
      innings.isCompleted = true;
      clonedMatch.status = 'completed';
      if (innings.totalRuns === clonedMatch.innings[0].totalRuns) {
        clonedMatch.result = {
          resultType: 'tie',
          winMargin: 'Scores level',
          summary: 'Match Tied! (Super Over required)',
        };
      } else {
        const defendingTeam = clonedMatch.teamA.id === battingTeam.id ? clonedMatch.teamB : clonedMatch.teamA;
        const runMargin = clonedMatch.innings[0].totalRuns - innings.totalRuns;
        clonedMatch.result = {
          winnerTeamId: defendingTeam.id,
          resultType: 'won_by_runs',
          winMargin: `${runMargin} run${runMargin > 1 ? 's' : ''}`,
          summary: `${defendingTeam.name} won by ${runMargin} runs`,
        };
      }
    }
  } else if (clonedMatch.currentInningsIndex === 0) {
    if (isAllOut || isOversFinished) {
      innings.isCompleted = true;
      // Prompt or ready for 2nd innings switch
    }
  }

  // Auto assign Player of the Match if match ended
  if (matchEnded && !clonedMatch.result?.playerOfTheMatchId) {
    clonedMatch.result = {
      ...clonedMatch.result!,
      ...calculatePlayerOfTheMatch(clonedMatch),
    };
  }

  clonedMatch.updatedAt = Date.now();

  return {
    match: clonedMatch,
    overCompleted,
    matchEnded,
    event: ballEvent,
  };
}

export function calculatePlayerOfTheMatch(match: Match): { playerOfTheMatchId: string; playerOfTheMatchName: string; reason: string } {
  const scores: Record<string, { name: string; points: number; stats: string }> = {};

  match.innings.forEach((inn) => {
    Object.values(inn.battingStats).forEach((b) => {
      if (!scores[b.playerId]) scores[b.playerId] = { name: b.playerName, points: 0, stats: '' };
      const pts = b.runs * 1 + (b.runs >= 50 ? 25 : 0) + (b.runs >= 100 ? 50 : 0);
      scores[b.playerId].points += pts;
      if (b.runs >= 30) scores[b.playerId].stats += `${b.runs} (${b.balls}) `;
    });

    Object.values(inn.bowlingStats).forEach((bw) => {
      if (!scores[bw.playerId]) scores[bw.playerId] = { name: bw.playerName, points: 0, stats: '' };
      const pts = bw.wickets * 25 + bw.maidens * 15 - Math.floor(bw.runs / 4);
      scores[bw.playerId].points += pts;
      if (bw.wickets >= 2) scores[bw.playerId].stats += `${bw.wickets}/${bw.runs} (${bw.oversString} ov) `;
    });
  });

  let bestPlayerId = '';
  let maxPts = -1;
  Object.entries(scores).forEach(([pid, data]) => {
    if (data.points > maxPts) {
      maxPts = data.points;
      bestPlayerId = pid;
    }
  });

  const best = scores[bestPlayerId] || { name: 'Star Performer', stats: 'All-round contribution' };
  return {
    playerOfTheMatchId: bestPlayerId,
    playerOfTheMatchName: best.name,
    reason: best.stats.trim() || 'Outstanding performance',
  };
}

export function undoLastBall(match: Match): Match {
  const cloned: Match = JSON.parse(JSON.stringify(match));
  const innings = cloned.innings[cloned.currentInningsIndex];

  if (innings.balls.length === 0) {
    // If at start of 2nd innings, can go back to 1st innings
    if (cloned.currentInningsIndex === 1 && cloned.innings[0].balls.length > 0) {
      cloned.currentInningsIndex = 0;
      cloned.innings[0].isCompleted = false;
      return cloned;
    }
    return match;
  }

  // Rebuild the innings from ball 0 up to (N - 1)
  const allBalls = [...innings.balls];
  allBalls.pop(); // remove last ball

  const battingTeam = cloned.teamA.id === innings.battingTeamId ? cloned.teamA : cloned.teamB;
  const bowlingTeam = cloned.teamA.id === innings.bowlingTeamId ? cloned.teamA : cloned.teamB;

  const freshInnings = createEmptyInnings(
    innings.inningsNumber,
    innings.battingTeamId,
    innings.bowlingTeamId,
    battingTeam.squad.filter((p) => battingTeam.playingXI.includes(p.id)),
    bowlingTeam.squad.filter((p) => bowlingTeam.playingXI.includes(p.id))
  );

  cloned.innings[cloned.currentInningsIndex] = freshInnings;
  cloned.status = 'live';
  delete cloned.result;

  // Replay all previous balls
  let currentMatch = cloned;
  for (const b of allBalls) {
    const res = scoreBall(currentMatch, {
      runsBat: b.runsBat,
      runsExtra: b.runsExtra,
      extraType: b.extraType,
      isWicket: b.isWicket,
      dismissal: b.dismissal,
    });
    currentMatch = res.match;
  }

  return currentMatch;
}

export function switchStriker(match: Match): Match {
  const cloned: Match = JSON.parse(JSON.stringify(match));
  const innings = cloned.innings[cloned.currentInningsIndex];
  const temp = innings.currentStrikerId;
  innings.currentStrikerId = innings.currentNonStrikerId;
  innings.currentNonStrikerId = temp;
  return cloned;
}

export function changeBowler(match: Match, newBowlerId: string): Match {
  const cloned: Match = JSON.parse(JSON.stringify(match));
  const innings = cloned.innings[cloned.currentInningsIndex];
  innings.currentBowlerId = newBowlerId;
  return cloned;
}

export function startSecondInnings(match: Match): Match {
  const cloned: Match = JSON.parse(JSON.stringify(match));
  cloned.innings[0].isCompleted = true;
  cloned.currentInningsIndex = 1;

  // Batting team in 2nd innings is the bowling team from 1st
  const firstInnings = cloned.innings[0];
  const battingTeamId = firstInnings.bowlingTeamId;
  const bowlingTeamId = firstInnings.battingTeamId;

  const battingTeam = cloned.teamA.id === battingTeamId ? cloned.teamA : cloned.teamB;
  const bowlingTeam = cloned.teamA.id === bowlingTeamId ? cloned.teamA : cloned.teamB;

  cloned.innings[1] = createEmptyInnings(
    2,
    battingTeamId,
    bowlingTeamId,
    battingTeam.squad.filter((p) => battingTeam.playingXI.includes(p.id)),
    bowlingTeam.squad.filter((p) => bowlingTeam.playingXI.includes(p.id))
  );

  cloned.status = 'live';
  cloned.updatedAt = Date.now();
  return cloned;
}
