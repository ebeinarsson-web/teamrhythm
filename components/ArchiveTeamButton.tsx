"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  teamId: string;
};

export default function ArchiveTeamButton({ teamId }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleArchive() {
    if (!window.confirm("Fela teymi? Það hverfur af yfirliti en gögn eru óbreytt.")) return;

    setPending(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/teymi/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        setErrorMessage(data.message ?? "Ekki tókst að fela teymi. Vinsamlegast reyndu aftur.");
        return;
      }

      router.refresh();
    } catch {
      setErrorMessage("Ekki tókst að fela teymi í augnablikinu. Vinsamlegast reyndu aftur.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleArchive}
        disabled={pending}
        className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Vinn…" : "Fela teymi"}
      </button>
      {errorMessage ? <p className="text-sm text-rose-700">{errorMessage}</p> : null}
    </div>
  );
}
