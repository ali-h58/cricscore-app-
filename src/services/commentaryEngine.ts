import { DismissalInfo, ExtraType } from '../types/cricket';

const DOT_PHRASES = [
  'Defended solidly off the front foot towards cover.',
  'Good length ball outside off, batter shoulders arms safely.',
  'Pushed gently towards mid-on, no run taken.',
  'Beaten! Beautiful seam movement past the outside edge.',
  'Tapped towards backward point, fielder is quick to clean up.',
  'Fuller delivery on off stump, driven straight to mid-off.',
  'Bouncer on the body! Batter ducks under it carefully.',
  'Stifled appeal for LBW, struck on the pad outside off stump.',
];

const SINGLE_PHRASES = [
  'Worked away into the gap at mid-wicket for a sharp single.',
  'Tucked off the hips towards fine leg, easy single taken.',
  'Dropped and run! Quick call, scampering through for one.',
  'Driven down towards long-on, batsman turns the strike over.',
  'Steered delicately to third man for a sensible single.',
  'Pushed wide of cover, jogged across to complete the run.',
];

const DOUBLE_PHRASES = [
  'Clipped off the pads through square leg, brilliant running gets two!',
  'Driven sweetly through deep cover, batters push hard and come back for the second.',
  'Nudged into the pocket at deep midwicket, sharp call and they comfortably make two.',
  'Cut away behind point, sweeper runs around to keep it to a brace.',
];

const THREE_PHRASES = [
  'Superb timing! Pierces the extra cover gap, chased down just inside the boundary ropes for three.',
  'Lofted over mid-off, slows up on the outfield and they run three hard runs!',
];

const FOUR_PHRASES = [
  'FOUR! Magnificent shot! Leans into the drive and strokes it through extra cover with pure elegance!',
  'FOUR! Short and punished! Pulled with authority through midwicket, no chance for the deep fielder!',
  'FOUR! Up and over backward point! Deft touch using the bowler’s pace to beat third man!',
  'FOUR! Strayed down leg and flicked beautifully past the short fine leg fielder!',
  'FOUR! Smashed down the ground! Bowler could only watch that scorch the grass to the rope!',
  'FOUR! Cut away with pinpoint precision between backward point and short third man!',
];

const SIX_PHRASES = [
  'SIX! OUT OF THE PARK! He picked the slower ball early and sent it sailing into the second tier!',
  'SIX! High, handsome and maximum! Stepped out and clubbed it straight over the sight-screen!',
  'SIX! What a strike! Dispatched over deep midwicket into the delirious crowd!',
  'SIX! Hooked away ferociously! Flies over fine leg with tremendous bat speed!',
  'SIX! That is gigantic! Stand and deliver, clears the boundary with consummate ease!',
];

export function generateCommentary(params: {
  bowlerName: string;
  batterName: string;
  runsBat: number;
  runsExtra: number;
  extraType?: ExtraType;
  isWicket: boolean;
  dismissal?: DismissalInfo;
  fielderName?: string;
  overNumber: number;
  legalBallNumber: number;
}): string {
  const { bowlerName, batterName, runsBat, runsExtra, extraType, isWicket, dismissal, fielderName } = params;

  if (isWicket && dismissal) {
    switch (dismissal.type) {
      case 'bowled':
        return `${bowlerName} to ${batterName}, OUT! BOWLED 'EM! Absolute peach! Angled in, pitched on a length and clipped the top of off stump! Timber cartwheels!`;
      case 'caught':
        return `${bowlerName} to ${batterName}, OUT! CAUGHT! ${fielderName ? `Safe hands by ${fielderName}!` : 'Taken comfortably!'} Skied it high in the air and the fielder makes no mistake under pressure!`;
      case 'lbw':
        return `${bowlerName} to ${batterName}, OUT! LBW! Trapped in front! Fast fuller length hitting in line with middle and leg, umpire raises the finger instantly!`;
      case 'run_out':
        return `${bowlerName} to ${batterName}, OUT! RUN OUT! Massive mix-up! Direct hit ${fielderName ? `from ${fielderName}` : 'at the stumps'} and the batter is well short of the crease!`;
      case 'stumped':
        return `${bowlerName} to ${batterName}, OUT! STUMPED! Deceived in flight, dragged forward and the wicketkeeper whips the bails off in a flash!`;
      case 'hit_wicket':
        return `${bowlerName} to ${batterName}, OUT! HIT WICKET! Stepped back too deep in the crease and dislodged the bails with the boot! Unfortunate end!`;
      default:
        return `${bowlerName} to ${batterName}, OUT! Batter departs (${dismissal.type})!`;
    }
  }

  if (extraType === 'wide') {
    if (runsExtra > 1) {
      return `${bowlerName} to ${batterName}, WIDE + ${runsExtra - 1} runs! Sprayed far down leg side, keeper fumbles and they sneak extras!`;
    }
    return `${bowlerName} to ${batterName}, Wide ball! Strayed down leg, signalled wide by the umpire.`;
  }

  if (extraType === 'no_ball') {
    return `${bowlerName} to ${batterName}, NO BALL! ${runsBat > 0 ? `Plus ${runsBat} runs off the bat!` : ''} Overstepped the bowling crease, Free Hit coming up!`;
  }

  if (extraType === 'bye') {
    return `${bowlerName} to ${batterName}, ${runsExtra} Bye${runsExtra > 1 ? 's' : ''}! Beaten on the cut, ball zips through the keeper.`;
  }

  if (extraType === 'leg_bye') {
    return `${bowlerName} to ${batterName}, ${runsExtra} Leg Bye${runsExtra > 1 ? 's' : ''}! Struck on the thigh pad, deflection rolls into the vacant off side.`;
  }

  if (runsBat === 6) {
    const p = SIX_PHRASES[Math.floor(Math.random() * SIX_PHRASES.length)];
    return `${bowlerName} to ${batterName}, ${p}`;
  }

  if (runsBat === 4) {
    const p = FOUR_PHRASES[Math.floor(Math.random() * FOUR_PHRASES.length)];
    return `${bowlerName} to ${batterName}, ${p}`;
  }

  if (runsBat === 3) {
    const p = THREE_PHRASES[Math.floor(Math.random() * THREE_PHRASES.length)];
    return `${bowlerName} to ${batterName}, ${p}`;
  }

  if (runsBat === 2) {
    const p = DOUBLE_PHRASES[Math.floor(Math.random() * DOUBLE_PHRASES.length)];
    return `${bowlerName} to ${batterName}, ${p}`;
  }

  if (runsBat === 1) {
    const p = SINGLE_PHRASES[Math.floor(Math.random() * SINGLE_PHRASES.length)];
    return `${bowlerName} to ${batterName}, ${p}`;
  }

  const p = DOT_PHRASES[Math.floor(Math.random() * DOT_PHRASES.length)];
  return `${bowlerName} to ${batterName}, no run. ${p}`;
}
