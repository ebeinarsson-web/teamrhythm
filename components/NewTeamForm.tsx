"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TEAM_MEETING_CADENCE_OPTIONS } from "@/lib/team-meeting-cadence";

export default function NewTeamForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      contact: String(formData.get("contact") ?? ""),
      meetingCadence: String(formData.get("meetingCadence") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    try {
      const response = await fetch("/api/teymi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        setErrorMessage(data.message ?? "Ekki tókst að vista teymi. Vinsamlegast reyndu aftur.");
        return;
      }

      formRef.current?.reset();
      router.push("/teymi?created=1");
      router.refresh();
    } catch {
      setErrorMessage("Ekki tókst að vista teymi í augnablikinu. Vinsamlegast reyndu aftur.");
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
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-800">
          Heiti teymis
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="organization"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label htmlFor="contact" className="mb-1.5 block text-sm font-medium text-slate-800">
          Tengiliður <span className="font-normal text-slate-500">(valfrjálst)</span>
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          autoComplete="name"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label htmlFor="meetingCadence" className="mb-1.5 block text-sm font-medium text-slate-800">
          Fundartaktur <span className="font-normal text-slate-500">(valfrjálst)</span>
        </label>
        <select
          id="meetingCadence"
          name="meetingCadence"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        >
          <option value="">Veldu fundartakt…</option>
          {TEAM_MEETING_CADENCE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-slate-800">
          Athugasemdir <span className="font-normal text-slate-500">(valfrjálst)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
      >
        {isSubmitting ? "Vista…" : "Stofna teymi"}
      </button>

      {errorMessage ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800">{errorMessage}</p>
      ) : null}
    </form>
  );
}
