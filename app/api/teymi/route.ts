import { auth } from "@/auth";
import { createTeamForUser } from "@/lib/airtable";
import type { NewTeamInput } from "@/lib/types";
import { NextResponse } from "next/server";

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return NextResponse.json(
        { ok: false, message: "Ekki tókst að staðfesta aðgang. Vinsamlegast skráðu þig inn aftur." },
        { status: 401 },
      );
    }

    const payload = (await request.json()) as Partial<NewTeamInput>;
    const input: NewTeamInput = {
      name: asText(payload.name),
      meetingCadence: asText(payload.meetingCadence),
      notes: asText(payload.notes),
    };

    const result = await createTeamForUser(userEmail, input);
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: "Teymi var stofnað." });
  } catch (error) {
    console.error("[teamrhythm] Invalid team create request.", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Ekki tókst að vinna innsendingu. Vinsamlegast reyndu aftur.",
      },
      { status: 400 },
    );
  }
}
