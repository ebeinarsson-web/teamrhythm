import type { NewPulseInput, Pulse, Team } from "@/lib/types";
import { mockPulses, mockTeams } from "@/lib/mock-data";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_API_URL = "https://api.airtable.com/v0";
const TEAMS_TABLE = "Teymi";
const PULSE_TABLE = "Puls";

function hasAirtableConfig() {
  return Boolean(AIRTABLE_BASE_ID && AIRTABLE_TOKEN);
}

function authHeaders() {
  return {
    Authorization: `Bearer ${AIRTABLE_TOKEN}`,
    "Content-Type": "application/json",
  };
}

export async function getTeams(): Promise<Team[]> {
  if (!hasAirtableConfig()) return mockTeams;

  try {
    const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(TEAMS_TABLE)}`;
    const res = await fetch(url, { headers: authHeaders(), cache: "no-store" });
    if (!res.ok) throw new Error("Failed Airtable team fetch");
    const payload = (await res.json()) as {
      records: Array<{ id: string; fields: Record<string, string> }>;
    };
    return payload.records.map((record) => ({
      id: record.id,
      name: record.fields.Name ?? record.fields.Heiti ?? "Ónefnt teymi",
      lead: record.fields.Lead ?? record.fields.Abyrgðaraðili ?? "Óskráð",
    }));
  } catch {
    return mockTeams;
  }
}

export async function getPulses(): Promise<Pulse[]> {
  if (!hasAirtableConfig()) return mockPulses;

  try {
    const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(PULSE_TABLE)}`;
    const res = await fetch(url, { headers: authHeaders(), cache: "no-store" });
    if (!res.ok) throw new Error("Failed Airtable pulse fetch");
    const payload = (await res.json()) as {
      records: Array<{ id: string; fields: Record<string, string> }>;
    };
    return payload.records.map((record) => ({
      id: record.id,
      teamId: record.fields.TeamId ?? "unknown",
      date: record.fields.Date ?? new Date().toISOString().slice(0, 10),
      status: (record.fields.Status as Pulse["status"]) ?? "yellow",
      blockers: record.fields.Blockers ?? "",
      nextSteps: record.fields.NextSteps ?? "",
      summary: record.fields.Summary ?? "",
    }));
  } catch {
    return mockPulses;
  }
}

export async function createPulse(input: NewPulseInput): Promise<Pulse> {
  const pulse: Pulse = {
    id: `local-${Date.now()}`,
    teamId: input.teamId,
    date: new Date().toISOString().slice(0, 10),
    status: input.status,
    blockers: input.blockers,
    nextSteps: input.nextSteps,
    summary: input.summary,
  };

  if (!hasAirtableConfig()) return pulse;

  try {
    const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(PULSE_TABLE)}`;
    await fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        records: [
          {
            fields: {
              TeamId: input.teamId,
              Date: pulse.date,
              Status: input.status,
              Blockers: input.blockers,
              NextSteps: input.nextSteps,
              Summary: input.summary,
            },
          },
        ],
      }),
    });
  } catch {
    return pulse;
  }

  return pulse;
}
