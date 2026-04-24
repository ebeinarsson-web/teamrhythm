/**
 * Values must match Airtable `Teymi.Fundartaktur` single-select options exactly.
 * If Airtable options change, update this list to match.
 */
export const TEAM_MEETING_CADENCE_OPTIONS = [
  "Daglega",
  "Vikulega",
  "Tveggja vikna fresti",
  "Eftir þörfum",
] as const;

const CADENCE_SET = new Set<string>(TEAM_MEETING_CADENCE_OPTIONS);

export function isAllowedMeetingCadence(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return CADENCE_SET.has(trimmed);
}
