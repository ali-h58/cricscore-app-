import { Match, WinProbabilityEstimate } from '../types/cricket';

export function calculateWinProbability(match: Match): WinProbabilityEstimate {
  const currentInnings = match.innings[match.currentInningsIndex];
  const battingTeam = currentInnings.battingTeamId === match.teamA.id ? match.teamA : match.teamB;
  const bowlingTeam = currentInnings.battingTeamId === match.teamA.id ? match.teamB : match.teamA;

  const totalBalls = match.totalOvers * 6;
  const legalBallsBowled = currentInnings.totalLegalBalls;
  const ballsRemaining = Math.max(0, totalBalls - legalBallsBowled);
  const oversBowled = legalBallsBowled / 6;

  const currentRunRate = oversBowled > 0 ? (currentInnings.totalRuns / oversBowled) : 0;
  const wicketsLost = currentInnings.totalWickets;
  const wicketsInHand = Math.max(0, 10 - wicketsLost);

  // Projected score
  const projectedScore = oversBowled > 0
    ? Math.round(currentInnings.totalRuns + (currentRunRate * (ballsRemaining / 6)))
    : match.totalOvers * 8;

  const keyFactors: string[] = [];

  // If match completed
  if (match.status === 'completed' && match.result) {
    const isTeamAWinner = match.result.winnerTeamId === match.teamA.id;
    return {
      teamAPercentage: isTeamAWinner ? 100 : 0,
      teamBPercentage: isTeamAWinner ? 0 : 100,
      teamAName: match.teamA.name,
      teamBName: match.teamB.name,
      projectedScore: currentInnings.totalRuns,
      currentRunRate: Number(currentRunRate.toFixed(2)),
      requiredRunRate: 0,
      keyFactors: [match.result.summary || 'Match concluded'],
    };
  }

  // 1st Innings calculation
  if (match.currentInningsIndex === 0) {
    // Benchmark par score: e.g. T20: 165, ODI: 280
    const parScore = match.format === 'ODI' ? 280 : match.totalOvers * 8.2;
    const progressFactor = legalBallsBowled / Math.max(1, totalBalls);
    
    // Wickets penalty
    const wicketResource = Math.pow(wicketsInHand / 10, 0.7);
    const scoreResource = projectedScore / parScore;
    
    let batProbability = 50 + (scoreResource - 1) * 30 + (wicketResource - 0.7) * 20;
    batProbability = Math.min(92, Math.max(8, batProbability));

    if (currentRunRate >= 8.5) {
      keyFactors.push(`High current run rate (${currentRunRate.toFixed(2)} RPO) putting pressure on bowler.`);
    } else if (currentRunRate < 6.5 && oversBowled >= 5) {
      keyFactors.push(`Sluggish run rate (${currentRunRate.toFixed(2)} RPO) below par.`);
    }

    if (wicketsInHand <= 4) {
      keyFactors.push(`Bowling side in control after taking ${wicketsLost} wickets.`);
    } else if (wicketsLost <= 2 && oversBowled >= 8) {
      keyFactors.push(`Batting team has ${wicketsInHand} wickets in hand for death overs.`);
    }

    if (keyFactors.length === 0) {
      keyFactors.push('Evenly poised contest in the first innings.');
    }

    const teamAPercent = battingTeam.id === match.teamA.id ? Math.round(batProbability) : Math.round(100 - batProbability);
    const teamBPercent = 100 - teamAPercent;

    return {
      teamAPercentage: teamAPercent,
      teamBPercentage: teamBPercent,
      teamAName: match.teamA.name,
      teamBName: match.teamB.name,
      projectedScore,
      currentRunRate: Number(currentRunRate.toFixed(2)),
      requiredRunRate: 0,
      keyFactors,
    };
  }

  // 2nd Innings calculation (Chase calculator)
  const firstInnings = match.innings[0];
  const targetRuns = firstInnings.totalRuns + 1;
  const runsRemaining = Math.max(0, targetRuns - currentInnings.totalRuns);
  const requiredRunRate = ballsRemaining > 0 ? (runsRemaining / (ballsRemaining / 6)) : (runsRemaining > 0 ? 99 : 0);

  // Wickets factor + RRR factor
  const rrrGap = requiredRunRate - currentRunRate;
  let chaseWinProb = 50;

  if (runsRemaining <= 0) {
    chaseWinProb = 100;
  } else if (wicketsLost >= 10 || (ballsRemaining === 0 && runsRemaining > 0)) {
    chaseWinProb = 0;
  } else {
    // Base probability starts with resources remaining
    const ballsWeight = Math.min(1, ballsRemaining / 60);
    const rrrImpact = (8.5 - requiredRunRate) * 5;
    const wicketBonus = (wicketsInHand - 5) * 6;
    chaseWinProb = 50 + rrrImpact + wicketBonus;
    chaseWinProb = Math.min(95, Math.max(5, chaseWinProb));
  }

  if (runsRemaining <= 0) {
    keyFactors.push(`Target achieved! ${battingTeam.name} has crossed the finish line.`);
  } else if (requiredRunRate > 12) {
    keyFactors.push(`Steep required run rate of ${requiredRunRate.toFixed(2)} RPO creates immense pressure.`);
  } else if (requiredRunRate <= 7) {
    keyFactors.push(`Manageable required run rate of ${requiredRunRate.toFixed(2)} RPO favors chasing team.`);
  }

  if (wicketsInHand >= 7) {
    keyFactors.push(`${battingTeam.name} holds ${wicketsInHand} wickets in hand to attack.`);
  } else if (wicketsInHand <= 3) {
    keyFactors.push(`${bowlingTeam.name} needs just ${wicketsInHand} more wickets to wrap up victory.`);
  }

  if (keyFactors.length === 0) {
    keyFactors.push(`Needs ${runsRemaining} runs off ${ballsRemaining} deliveries.`);
  }

  const teamAPercent = battingTeam.id === match.teamA.id ? Math.round(chaseWinProb) : Math.round(100 - chaseWinProb);
  const teamBPercent = 100 - teamAPercent;

  return {
    teamAPercentage: teamAPercent,
    teamBPercentage: teamBPercent,
    teamAName: match.teamA.name,
    teamBName: match.teamB.name,
    projectedScore,
    currentRunRate: Number(currentRunRate.toFixed(2)),
    requiredRunRate: Number(requiredRunRate.toFixed(2)),
    targetRuns,
    runsRemaining,
    ballsRemaining,
    keyFactors,
  };
}
