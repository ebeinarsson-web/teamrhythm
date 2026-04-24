import { createPulseForUser } from "@/lib/airtable";
import type { NewPulseInput } from "@/lib/types";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

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

    const payload = (await request.json()) as Partial<NewPulseInput>;
    const input: NewPulseInput = {
      teamId: asText(payload.teamId),
      meetingDate: asText(payload.meetingDate),
      status: asText(payload.status) as NewPulseInput["status"],
      goals: asText(payload.goals),
      wins: asText(payload.wins),
      blockers: asText(payload.blockers),
      decisionsNeeded: asText(payload.decisionsNeeded),
      nextSteps: asText(payload.nextSteps),
      submittedBy: asText(payload.submittedBy),
    };

    const result = await createPulseForUser(userEmail, input);
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      message: "Púls var vistaður.",
    });
  } catch (error) {
    console.error("[teamrhythm] Invalid pulse create request.", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Ekki tókst að vinna innsendingu. Vinsamlegast reyndu aftur.",
      },
      { status: 400 },
    );
  }
}
