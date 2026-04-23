"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Team } from "@/lib/types";

type Props = {
  teams: Team[];
};

export default function NewPulseForm({ teams }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasTeams = teams.length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasTeams) return;

    setIsSubmitting(true);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      teamId: String(formData.get("team") ?? ""),
      meetingDate: String(formData.get("meetingDate") ?? ""),
      status: String(formData.get("status") ?? ""),
      goals: String(formData.get("goals") ?? ""),
      wins: String(formData.get("wins") ?? ""),
      blockers: String(formData.get("blockers") ?? ""),
      decisionsNeeded: String(formData.get("decisionsNeeded") ?? ""),
      nextSteps: String(formData.get("nextSteps") ?? ""),
      submittedBy: String(formData.get("submittedBy") ?? ""),
    };

    try {
      const response = await fetch("/api/pulsar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        setErrorMessage(data.message ?? "Ekki tókst að vista púls. Vinsamlegast reyndu aftur.");
        return;
      }

      formRef.current?.reset();
      router.push("/pulsar?saved=1");
      router.refresh();
    } catch {
      setErrorMessage("Ekki tókst að vista púls í augnablikinu. Vinsamlegast reyndu aftur.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:space-y-6 sm:p-6"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="team" className="mb-1.5 block text-sm font-medium text-slate-800">
          Teymi
        </label>
        <select
          id="team"
          name="team"
          required
          disabled={!hasTeams || isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        >
          <option value="">Veldu teymi</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="meetingDate" className="mb-1.5 block text-sm font-medium text-slate-800">
          Fundardagur
        </label>
        <input
          id="meetingDate"
          name="meetingDate"
          type="date"
          required
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-800">
          Staða
        </label>
        <select
          id="status"
          name="status"
          required
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        >
          <option value="">Veldu stöðu</option>
          <option value="Græn">Græn</option>
          <option value="Gul">Gul</option>
          <option value="Rauð">Rauð</option>
        </select>
      </div>

      <div>
        <label htmlFor="goals" className="mb-1.5 block text-sm font-medium text-slate-800">
          Helstu markmið
        </label>
        <textarea
          id="goals"
          name="goals"
          rows={3}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label htmlFor="wins" className="mb-1.5 block text-sm font-medium text-slate-800">
          Hvað gekk vel
        </label>
        <textarea
          id="wins"
          name="wins"
          rows={3}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label htmlFor="blockers" className="mb-1.5 block text-sm font-medium text-slate-800">
          Hindranir
        </label>
        <textarea
          id="blockers"
          name="blockers"
          rows={3}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label htmlFor="decisionsNeeded" className="mb-1.5 block text-sm font-medium text-slate-800">
          Hvaða ákvarðanir eða stuðning vantar
        </label>
        <textarea
          id="decisionsNeeded"
          name="decisionsNeeded"
          rows={3}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label htmlFor="nextSteps" className="mb-1.5 block text-sm font-medium text-slate-800">
          Næstu skref
        </label>
        <textarea
          id="nextSteps"
          name="nextSteps"
          rows={3}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label htmlFor="submittedBy" className="mb-1.5 block text-sm font-medium text-slate-800">
          Sent inn af
        </label>
        <input
          id="submittedBy"
          name="submittedBy"
          type="text"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !hasTeams}
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Sendi..." : "Vista púls"}
      </button>

      {errorMessage ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800">{errorMessage}</p>
      ) : null}

      {!hasTeams ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
          Ekki er hægt að senda inn púls í þessari keyrslu.
        </p>
      ) : null}
    </form>
  );
}
