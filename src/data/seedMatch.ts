import { Match, Team, Innings } from '../types/cricket';
import { DEFAULT_TEAMS } from './defaultTeams';
import { createEmptyInnings, scoreBall } from '../services/cricketEngine';

export function createDemoMatch(): Match {
  const teamInd = JSON.parse(JSON.stringify(DEFAULT_TEAMS[0])) as Team;
  const teamAus = JSON.parse(JSON.stringify(DEFAULT_TEAMS[1])) as Team;

  const baseInnings1 = createEmptyInnings(
    1,
    teamInd.id,
    teamAus.id,
    teamInd.squad.filter((p) => teamInd.playingXI.includes(p.id)),
    teamAus.squad.filter((p) => teamAus.playingXI.includes(p.id))
  );

  const baseInnings2 = createEmptyInnings(
    2,
    teamAus.id,
    teamInd.id,
    teamAus.squad.filter((p) => teamAus.playingXI.includes(p.id)),
    teamInd.squad.filter((p) => teamInd.playingXI.includes(p.id))
  );

  let match: Match = {
    id: 'demo-match-t20-ind-aus',
    title: 'India vs Australia, Super 8 Clash',
    format: 'T20',
    totalOvers: 20,
    date: '2026-10-04',
    time: '19:30 PM',
    venue: 'Kensington Oval, Bridgetown, Barbados',
    teamA: teamInd,
    teamB: teamAus,
    toss: {
      winnerTeamId: teamAus.id,
      decision: 'bowl',
    },
    status: 'live',
    currentInningsIndex: 0,
    innings: [baseInnings1, baseInnings2],
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now(),
  };

  // Seed balls to reach ~152/3 in 16.4 overs with Rohit 72(48), Kohli 31(25), Gill 18(12), Rahul 12(10), Hardik 8(6)
  // Bowlers: Starc, Hazlewood, Cummins, Zampa, Stoinis, Maxwell
  const bowlerOrder = ['aus-9', 'aus-11', 'aus-8', 'aus-10', 'aus-5', 'aus-4']; // Starc, Hazlewood, Cummins, Zampa, Stoinis, Maxwell

  // Seed balls sequence
  const sampleBalls: Array<{
    runsBat: number;
    runsExtra?: number;
    extraType?: any;
    isWicket?: boolean;
    dismissal?: any;
    newStrikerId?: string;
  }> = [
    // Over 1 (Starc to Rohit & Kohli)
    { runsBat: 0 },
    { runsBat: 4 },
    { runsBat: 1 },
    { runsBat: 0 },
    { runsBat: 2 },
    { runsBat: 1 }, // 8 runs
    // Over 2 (Hazlewood)
    { runsBat: 0 },
    { runsBat: 1 },
    { runsBat: 4 },
    { runsBat: 0 },
    { runsBat: 1 },
    { runsBat: 0 }, // 6 runs -> 14/0
    // Over 3 (Starc)
    { runsBat: 6 },
    { runsBat: 1 },
    { runsBat: 0, runsExtra: 1, extraType: 'wide' },
    { runsBat: 0 },
    { runsBat: 2 },
    { runsBat: 1 },
    { runsBat: 4 }, // 15 runs -> 29/0
    // Over 4 (Hazlewood)
    { runsBat: 1 },
    { runsBat: 0 },
    { runsBat: 1 },
    { runsBat: 4 },
    { runsBat: 1 },
    { runsBat: 0 }, // 7 runs -> 36/0
    // Over 5 (Cummins)
    { runsBat: 0 },
    { runsBat: 4 },
    { runsBat: 1 },
    { runsBat: 1 },
    { runsBat: 2 },
    { runsBat: 1 }, // 9 runs -> 45/0
    // Over 6 (Zampa) - Wicket!
    { runsBat: 0, isWicket: true, dismissal: { type: 'caught', playerOutId: 'ind-1', fielderId: 'aus-7', desc: 'c Wade b Zampa' } }, // Rohit out 45
    { runsBat: 1, newStrikerId: 'ind-3' }, // Gill enters
    { runsBat: 4 },
    { runsBat: 0 },
    { runsBat: 1 },
    { runsBat: 0 }, // 6 runs -> 51/1 Powerplay
    // Over 7 (Stoinis)
    { runsBat: 1 },
    { runsBat: 1 },
    { runsBat: 2 },
    { runsBat: 0, runsExtra: 1, extraType: 'no_ball' },
    { runsBat: 4 }, // free hit
    { runsBat: 1 },
    { runsBat: 0 }, // 10 runs -> 61/1
    // Over 8 (Maxwell)
    { runsBat: 1 },
    { runsBat: 1 },
    { runsBat: 6 },
    { runsBat: 0 },
    { runsBat: 1 },
    { runsBat: 1 }, // 10 runs -> 71/1
    // Over 9 (Zampa)
    { runsBat: 0 },
    { runsBat: 1 },
    { runsBat: 2 },
    { runsBat: 1 },
    { runsBat: 4 },
    { runsBat: 0 }, // 8 runs -> 79/1
    // Over 10 (Cummins)
    { runsBat: 1 },
    { runsBat: 1 },
    { runsBat: 0 },
    { runsBat: 4 },
    { runsBat: 1 },
    { runsBat: 0 }, // 7 runs -> 86/1
    // Over 11 (Starc) - Wicket 2!
    { runsBat: 1 },
    { runsBat: 0, isWicket: true, dismissal: { type: 'bowled', playerOutId: 'ind-3', bowlerId: 'aus-9', desc: 'b Starc' } }, // Gill out
    { runsBat: 0, newStrikerId: 'ind-4' }, // KL Rahul enters
    { runsBat: 1 },
    { runsBat: 4 },
    { runsBat: 1 }, // 7 runs -> 93/2
    // Over 12 (Zampa)
    { runsBat: 1 },
    { runsBat: 1 },
    { runsBat: 1 },
    { runsBat: 2 },
    { runsBat: 1 },
    { runsBat: 1 }, // 7 runs -> 100/2
    // Over 13 (Maxwell)
    { runsBat: 6 },
    { runsBat: 1 },
    { runsBat: 0, runsExtra: 4, extraType: 'bye' },
    { runsBat: 1 },
    { runsBat: 2 },
    { runsBat: 1 }, // 15 runs -> 115/2
    // Over 14 (Hazlewood)
    { runsBat: 1 },
    { runsBat: 1 },
    { runsBat: 4 },
    { runsBat: 0 },
    { runsBat: 1 },
    { runsBat: 1 }, // 8 runs -> 123/2
    // Over 15 (Cummins) - Wicket 3!
    { runsBat: 1 },
    { runsBat: 0, isWicket: true, dismissal: { type: 'lbw', playerOutId: 'ind-2', bowlerId: 'aus-8', desc: 'lbw b Cummins' } }, // Kohli out
    { runsBat: 0, runsExtra: 1, extraType: 'wide' },
    { runsBat: 1, newStrikerId: 'ind-5' }, // Hardik enters
    { runsBat: 4 },
    { runsBat: 1 },
    { runsBat: 2 }, // 10 runs -> 133/3
    // Over 16 (Starc)
    { runsBat: 1 },
    { runsBat: 4 },
    { runsBat: 0 },
    { runsBat: 6 },
    { runsBat: 1 },
    { runsBat: 2 }, // 14 runs -> 147/3
    // Over 17 (Zampa bowling currently) - 4 legal balls
    { runsBat: 1 }, // 16.1
    { runsBat: 4 }, // 16.2
    { runsBat: 0 }, // 16.3
    { runsBat: 0, isWicket: true, dismissal: { type: 'bowled', playerOutId: 'ind-4', bowlerId: 'aus-10', desc: 'b Zampa' } }, // 16.4 Wicket!
  ];

  // Apply balls with rotating bowlers
  let bIdx = 0;
  for (const b of sampleBalls) {
    // assign bowler for current over
    const curOver = match.innings[0].oversCompleted;
    const bowler = bowlerOrder[curOver % bowlerOrder.length];
    match.innings[0].currentBowlerId = bowler;

    const res = scoreBall(match, b);
    match = res.match;
  }

  return match;
}
