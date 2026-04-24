import { auth } from "@/auth";
import { archiveTeamForUser } from "@/lib/airtable";
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

    const payload = (await request.json()) as { teamId?: unknown };
    const teamId = asText(payload.teamId);

    const result = await archiveTeamForUser(userEmail, teamId);
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: "Teymi var falið." });
  } catch (error) {
    console.error("[teamrhythm] Invalid team archive request.", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Ekki tókst að vinna beiðni. Vinsamlegast reyndu aftur.",
      },
      { status: 400 },
    );
  }
}
