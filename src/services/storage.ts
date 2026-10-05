import { Match } from '../types/cricket';
import { createDemoMatch } from '../data/seedMatch';

const STORAGE_KEY_CURRENT = 'cricscore_current_match';
const STORAGE_KEY_HISTORY = 'cricscore_match_history';

export function getStoredCurrentMatch(): Match {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.innings) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading current match from localStorage', e);
  }
  const demo = createDemoMatch();
  saveCurrentMatch(demo);
  return demo;
}

export function saveCurrentMatch(match: Match): void {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(match));
    // Also update history list
    upsertMatchHistory(match);
  } catch (e) {
    console.error('Error saving current match to localStorage', e);
  }
}

export function getMatchHistory(): Match[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading match history', e);
  }
  return [];
}

export function upsertMatchHistory(match: Match): void {
  try {
    const history = getMatchHistory();
    const idx = history.findIndex((m) => m.id === match.id);
    if (idx >= 0) {
      history[idx] = match;
    } else {
      history.unshift(match);
    }
    // keep max 20 matches
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 20)));
  } catch (e) {
    console.error('Error upserting match history', e);
  }
}

export function deleteMatchFromHistory(matchId: string): void {
  try {
    const history = getMatchHistory().filter((m) => m.id !== matchId);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Error deleting match', e);
  }
}

export function duplicateMatch(match: Match): Match {
  const cloned: Match = JSON.parse(JSON.stringify(match));
  cloned.id = `match-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  cloned.title = `${cloned.title} (Copy)`;
  cloned.createdAt = Date.now();
  cloned.updatedAt = Date.now();
  saveCurrentMatch(cloned);
  return cloned;
}

export function exportMatchToJson(match: Match): string {
  return JSON.stringify(match, null, 2);
}

export function importMatchFromJson(jsonStr: string): Match {
  const parsed = JSON.parse(jsonStr);
  if (!parsed.teamA || !parsed.teamB || !parsed.innings) {
    throw new Error('Invalid cricket match JSON format');
  }
  // ensure new unique id or keep
  parsed.updatedAt = Date.now();
  saveCurrentMatch(parsed);
  return parsed;
}
