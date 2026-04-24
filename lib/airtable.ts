import type { NewPulseInput, NewTeamInput, Pulse, PulseFormStatus, Team } from "@/lib/types";
import { mockPulses, mockTeams } from "@/lib/mock-data";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_API_URL = "https://api.airtable.com/v0";
const TEAMS_TABLE = "Teymi";
const PULSE_TABLE = "Puls";
const STATUS_GREEN = "green";
const STATUS_YELLOW = "yellow";
const STATUS_RED = "red";

function hasAirtableConfig() {
  return Boolean(AIRTABLE_BASE_ID && AIRTABLE_TOKEN);
}

function authHeaders() {
  return {
    Authorization: `Bearer ${AIRTABLE_TOKEN}`,
    "Content-Type": "application/json",
  };
}

type AirtableValue = string | number | boolean | string[] | null | undefined;
type AirtableRecord = { id: string; fields: Record<string, AirtableValue> };

function toText(value: AirtableValue): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return "";
}

function toLinkedIds(value: AirtableValue): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toBoolean(value: AirtableValue): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.toLowerCase().trim();
    return normalized === "true" || normalized === "ja" || normalized === "já" || normalized === "virkt";
  }
  if (typeof value === "number") return value > 0;
  return false;
}

function normalizeEmail(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function normalizeStatus(value: string): Pulse["status"] {
  const normalized = value.toLowerCase().trim();
  if (normalized === "green" || normalized === "graen" || normalized === "græn") return STATUS_GREEN;
  if (normalized === "red" || normalized === "raud" || normalized === "rauð") return STATUS_RED;
  if (normalized === "yellow" || normalized === "gul" || normalized === "gult") return STATUS_YELLOW;
  return STATUS_YELLOW;
}

function mapFormStatusToAirtable(status: PulseFormStatus): PulseFormStatus {
  if (status === "Græn" || status === "Gul" || status === "Rauð") return status;
  return "Gul";
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function toTimestamp(value: string): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function comparePulsesNewestFirst(a: Pulse, b: Pulse): number {
  const meetingDiff = toTimestamp(b.meetingDate) - toTimestamp(a.meetingDate);
  if (meetingDiff !== 0) return meetingDiff;

  const createdDiff = toTimestamp(b.createdDate) - toTimestamp(a.createdDate);
  if (createdDiff !== 0) return createdDiff;

  return b.id.localeCompare(a.id);
}

async function fetchAirtableRecords(tableName: string): Promise<AirtableRecord[]> {
  const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;
  const response = await fetch(url, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Airtable request failed for table ${tableName}: ${response.status}`);
  }
  const payload = (await response.json()) as { records?: AirtableRecord[] };
  return payload.records ?? [];
}

async function fetchAirtableRecordById(tableName: string, recordId: string): Promise<AirtableRecord | null> {
  const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}/${encodeURIComponent(recordId)}`;
  const response = await fetch(url, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Airtable get record failed for ${tableName}/${recordId}: ${response.status}`);
  }
  const payload = (await response.json()) as { id: string; fields: Record<string, AirtableValue> };
  return { id: payload.id, fields: payload.fields };
}

function isValidDateInput(value: string): boolean {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function validatePulseInput(input: NewPulseInput): string | null {
  if (!input.teamId.trim()) return "Veldu teymi.";
  if (!isValidDateInput(input.meetingDate)) return "Fundardagur þarf að vera gilt dagsetning.";
  if (!["Græn", "Gul", "Rauð"].includes(input.status)) {
    return "Staða þarf að vera Græn, Gul eða Rauð.";
  }
  return null;
}

export async function getTeams(): Promise<Team[]> {
  if (!hasAirtableConfig()) {
    console.info("[teamrhythm] Airtable env missing, using mock teams.");
    return mockTeams;
  }

  try {
    const records = await fetchAirtableRecords(TEAMS_TABLE);
    return records.map((record) => ({
      id: record.id,
      name: toText(record.fields["Teymi"]) || "Ónefnt teymi",
      isActive: toBoolean(record.fields["Virkt"]),
      contact: toText(record.fields["Tengiliður"]) || "Óskráð",
      meetingCadence: toText(record.fields["Fundartaktur"]) || "Ekki skilgreint",
      notes: toText(record.fields["Athugasemdir"]),
    }));
  } catch (error) {
    console.warn("[teamrhythm] Team fetch failed, using mock teams.", error);
    return mockTeams;
  }
}

function mapTeamRecord(record: AirtableRecord): Team {
  return {
    id: record.id,
    name: toText(record.fields["Teymi"]) || "Ónefnt teymi",
    isActive: toBoolean(record.fields["Virkt"]),
    contact: toText(record.fields["Tengiliður"]) || "Óskráð",
    meetingCadence: toText(record.fields["Fundartaktur"]) || "Ekki skilgreint",
    notes: toText(record.fields["Athugasemdir"]),
  };
}

function isOwnedActiveTeam(record: AirtableRecord, userEmail: string): boolean {
  const ownerEmail = normalizeEmail(toText(record.fields["OwnerEmail"]));
  const archived = toBoolean(record.fields["Archived"]);
  return Boolean(ownerEmail) && ownerEmail === userEmail && !archived;
}

function isTeamOwner(record: AirtableRecord, userEmail: string): boolean {
  const ownerEmail = normalizeEmail(toText(record.fields["OwnerEmail"]));
  return Boolean(ownerEmail) && ownerEmail === userEmail;
}

function validateNewTeamInput(input: NewTeamInput): string | null {
  if (!input.name.trim()) return "Teymisnafn er krafist.";
  return null;
}

export async function getTeamsForUser(userEmail: string | null | undefined): Promise<Team[]> {
  const normalizedUserEmail = normalizeEmail(userEmail);
  if (!normalizedUserEmail) return [];

  if (!hasAirtableConfig()) {
    console.info("[teamrhythm] Airtable env missing, returning empty teams for user scope.");
    return [];
  }

  try {
    const records = await fetchAirtableRecords(TEAMS_TABLE);
    return records.filter((record) => isOwnedActiveTeam(record, normalizedUserEmail)).map(mapTeamRecord);
  } catch (error) {
    console.warn("[teamrhythm] Team fetch failed for user scope.", error);
    return [];
  }
}

export async function getPulses(): Promise<Pulse[]> {
  if (!hasAirtableConfig()) {
    console.info("[teamrhythm] Airtable env missing, using mock pulses.");
    return [...mockPulses].sort(comparePulsesNewestFirst);
  }

  try {
    const [teamRecords, pulseRecords] = await Promise.all([
      fetchAirtableRecords(TEAMS_TABLE),
      fetchAirtableRecords(PULSE_TABLE),
    ]);
    const teamById = new Map<string, string>(
      teamRecords.map((team) => [team.id, toText(team.fields["Teymi"]) || "Óþekkt teymi"]),
    );

    const normalized = pulseRecords.map((record) => {
      const linkedTeamIds = toLinkedIds(record.fields["Teymi"]);
      const linkedTeamId = linkedTeamIds[0] ?? "";
      const linkedTeamName = linkedTeamId ? teamById.get(linkedTeamId) : undefined;
      const fallbackTeamField = toText(record.fields["Teymi"]);
      const createdDate = toText(record.fields["Skráð dags."]) || todayIsoDate();
      const meetingDate = toText(record.fields["Fundardagur"]) || createdDate;

      return {
        id: record.id,
        title: toText(record.fields["Púls"]) || `Púls ${meetingDate}`,
        teamId: linkedTeamId || "unknown",
        teamName: linkedTeamName || fallbackTeamField || "Óþekkt teymi",
        createdDate,
        meetingDate,
        status: normalizeStatus(toText(record.fields["Staða"])),
        goals: toText(record.fields["Helstu markmið"]),
        wins: toText(record.fields["Hvað gekk vel"]),
        blockers: toText(record.fields["Hvað tefur framvindu"]),
        decisionsNeeded: toText(record.fields["Hvaða ákvarðanir eða stuðning vantar"]),
        nextSteps: toText(record.fields["Næstu skref"]),
        submittedBy: toText(record.fields["Sent inn af"]),
      } satisfies Pulse;
    });

    return normalized.sort(comparePulsesNewestFirst);
  } catch (error) {
    console.warn("[teamrhythm] Pulse fetch failed, using mock pulses.", error);
    return [...mockPulses].sort(comparePulsesNewestFirst);
  }
}

export async function getPulsesForUser(userEmail: string | null | undefined): Promise<Pulse[]> {
  const ownedTeams = await getTeamsForUser(userEmail);
  if (ownedTeams.length === 0) return [];

  if (!hasAirtableConfig()) {
    console.info("[teamrhythm] Airtable env missing, returning empty pulses for user scope.");
    return [];
  }

  const ownedTeamIds = new Set(ownedTeams.map((team) => team.id));
  const ownedTeamNameById = new Map(ownedTeams.map((team) => [team.id, team.name]));

  try {
    const pulseRecords = await fetchAirtableRecords(PULSE_TABLE);
    const normalized = pulseRecords
      .map((record) => {
        const linkedTeamIds = toLinkedIds(record.fields["Teymi"]);
        const linkedTeamId = linkedTeamIds[0] ?? "";
        const createdDate = toText(record.fields["Skráð dags."]) || todayIsoDate();
        const meetingDate = toText(record.fields["Fundardagur"]) || createdDate;
        const fallbackTeamField = toText(record.fields["Teymi"]);

        return {
          id: record.id,
          title: toText(record.fields["Púls"]) || `Púls ${meetingDate}`,
          teamId: linkedTeamId || "unknown",
          teamName: ownedTeamNameById.get(linkedTeamId) || fallbackTeamField || "Óþekkt teymi",
          createdDate,
          meetingDate,
          status: normalizeStatus(toText(record.fields["Staða"])),
          goals: toText(record.fields["Helstu markmið"]),
          wins: toText(record.fields["Hvað gekk vel"]),
          blockers: toText(record.fields["Hvað tefur framvindu"]),
          decisionsNeeded: toText(record.fields["Hvaða ákvarðanir eða stuðning vantar"]),
          nextSteps: toText(record.fields["Næstu skref"]),
          submittedBy: toText(record.fields["Sent inn af"]),
        } satisfies Pulse;
      })
      .filter((pulse) => ownedTeamIds.has(pulse.teamId));

    return normalized.sort(comparePulsesNewestFirst);
  } catch (error) {
    console.warn("[teamrhythm] Pulse fetch failed for user scope.", error);
    return [];
  }
}

export async function getOverviewData() {
  const [teams, pulses] = await Promise.all([getTeams(), getPulses()]);
  const sortedPulses = [...pulses].sort(comparePulsesNewestFirst);
  const attentionPulses = sortedPulses.filter((pulse) => pulse.status === STATUS_YELLOW || pulse.status === STATUS_RED);

  const statusCounts = {
    green: pulses.filter((pulse) => pulse.status === STATUS_GREEN).length,
    yellow: pulses.filter((pulse) => pulse.status === STATUS_YELLOW).length,
    red: pulses.filter((pulse) => pulse.status === STATUS_RED).length,
  };

  return {
    teams,
    pulses: sortedPulses,
    attentionPulses,
    statusCounts,
    totalPulses: pulses.length,
  };
}

export async function getOverviewDataForUser(userEmail: string | null | undefined) {
  const [teams, pulses] = await Promise.all([getTeamsForUser(userEmail), getPulsesForUser(userEmail)]);
  const sortedPulses = [...pulses].sort(comparePulsesNewestFirst);
  const attentionPulses = sortedPulses.filter((pulse) => pulse.status === STATUS_YELLOW || pulse.status === STATUS_RED);

  const statusCounts = {
    green: pulses.filter((pulse) => pulse.status === STATUS_GREEN).length,
    yellow: pulses.filter((pulse) => pulse.status === STATUS_YELLOW).length,
    red: pulses.filter((pulse) => pulse.status === STATUS_RED).length,
  };

  return {
    teams,
    pulses: sortedPulses,
    attentionPulses,
    statusCounts,
    totalPulses: pulses.length,
  };
}

export type CreatePulseResult =
  | { ok: true; mode: "airtable" | "mock" }
  | { ok: false; message: string };

export async function createPulseForUser(
  userEmail: string | null | undefined,
  input: NewPulseInput,
): Promise<CreatePulseResult> {
  const normalizedUserEmail = normalizeEmail(userEmail);
  if (!normalizedUserEmail) {
    return { ok: false, message: "Ekki tókst að staðfesta aðgang. Vinsamlegast skráðu þig inn aftur." };
  }

  const validationError = validatePulseInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  if (!hasAirtableConfig()) {
    return {
      ok: false,
      message: "Innsending er ekki virk í þessari keyrslu. Vinsamlegast reyndu aftur í virku umhverfi.",
    };
  }

  try {
    const teamRecords = await fetchAirtableRecords(TEAMS_TABLE);
    const matchingTeam = teamRecords.find(
      (record) =>
        isOwnedActiveTeam(record, normalizedUserEmail) &&
        (record.id === input.teamId || toText(record.fields["Teymi"]) === input.teamId),
    );

    if (!matchingTeam) {
      return { ok: false, message: "Þú hefur ekki aðgang að valda teyminu." };
    }

    const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(PULSE_TABLE)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        records: [
          {
            fields: {
              Teymi: [matchingTeam.id],
              "Fundardagur": input.meetingDate,
              "Staða": mapFormStatusToAirtable(input.status),
              "Helstu markmið": input.goals,
              "Hvað gekk vel": input.wins,
              "Hvað tefur framvindu": input.blockers,
              "Hvaða ákvarðanir eða stuðning vantar": input.decisionsNeeded,
              "Næstu skref": input.nextSteps,
              "Sent inn af": input.submittedBy,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Airtable create failed: ${response.status}`);
    }

    return { ok: true, mode: "airtable" };
  } catch (error) {
    console.error("[teamrhythm] Pulse create failed.", error);
    return {
      ok: false,
      message: "Ekki tókst að vista púls í augnablikinu. Vinsamlegast reyndu aftur.",
    };
  }
}

export async function createPulse(input: NewPulseInput): Promise<CreatePulseResult> {
  return createPulseForUser(null, input);
}

export type TeamMutationResult = { ok: true } | { ok: false; message: string };

export async function createTeamForUser(
  userEmail: string | null | undefined,
  input: NewTeamInput,
): Promise<TeamMutationResult> {
  const normalizedUserEmail = normalizeEmail(userEmail);
  if (!normalizedUserEmail) {
    return { ok: false, message: "Ekki tókst að staðfesta aðgang. Vinsamlegast skráðu þig inn aftur." };
  }

  const validationError = validateNewTeamInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  if (!hasAirtableConfig()) {
    return {
      ok: false,
      message: "Innsending er ekki virk í þessari keyrslu. Vinsamlegast reyndu aftur í virku umhverfi.",
    };
  }

  const ownerEmailStored = (userEmail ?? "").trim();
  if (!ownerEmailStored) {
    return { ok: false, message: "Ekki tókst að staðfesta aðgang. Vinsamlegast skráðu þig inn aftur." };
  }

  try {
    const fields: Record<string, string | boolean> = {
      Teymi: input.name.trim(),
      OwnerEmail: ownerEmailStored,
      Archived: false,
      Virkt: true,
    };
    const cadence = input.meetingCadence.trim();
    if (cadence) fields["Fundartaktur"] = cadence;
    const notes = input.notes.trim();
    if (notes) fields["Athugasemdir"] = notes;

    const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(TEAMS_TABLE)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        records: [{ fields }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Airtable create team failed: ${response.status}`);
    }

    return { ok: true };
  } catch (error) {
    console.error("[teamrhythm] Team create failed.", error);
    return {
      ok: false,
      message: "Ekki tókst að vista teymi í augnablikinu. Vinsamlegast reyndu aftur.",
    };
  }
}

export async function archiveTeamForUser(
  userEmail: string | null | undefined,
  teamId: string,
): Promise<TeamMutationResult> {
  const normalizedUserEmail = normalizeEmail(userEmail);
  if (!normalizedUserEmail) {
    return { ok: false, message: "Ekki tókst að staðfesta aðgang. Vinsamlegast skráðu þig inn aftur." };
  }

  const trimmedId = teamId.trim();
  if (!trimmedId) {
    return { ok: false, message: "Teymi vantar." };
  }

  if (!hasAirtableConfig()) {
    return {
      ok: false,
      message: "Innsending er ekki virk í þessari keyrslu. Vinsamlegast reyndu aftur í virku umhverfi.",
    };
  }

  try {
    const record = await fetchAirtableRecordById(TEAMS_TABLE, trimmedId);
    if (!record) {
      return { ok: false, message: "Teymi fannst ekki." };
    }
    if (!isTeamOwner(record, normalizedUserEmail)) {
      return { ok: false, message: "Þú hefur ekki aðgang að þessu teymi." };
    }

    const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(TEAMS_TABLE)}/${encodeURIComponent(trimmedId)}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({
        fields: {
          Archived: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Airtable archive team failed: ${response.status}`);
    }

    return { ok: true };
  } catch (error) {
    console.error("[teamrhythm] Team archive failed.", error);
    return {
      ok: false,
      message: "Ekki tókst að fela teymi í augnablikinu. Vinsamlegast reyndu aftur.",
    };
  }
}
