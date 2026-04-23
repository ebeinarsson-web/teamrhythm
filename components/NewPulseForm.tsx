"use client";

import { useState } from "react";
import type { Team } from "@/lib/types";

type Props = {
  teams: Team[];
};

export default function NewPulseForm({ teams }: Props) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div>
        <label htmlFor="team" className="mb-1 block text-sm font-medium text-slate-700">
          Teymi
        </label>
        <select id="team" name="team" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">
          Staða
        </label>
        <select id="status" name="status" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="green">Grænt</option>
          <option value="yellow">Gult</option>
          <option value="red">Rautt</option>
        </select>
      </div>

      <div>
        <label htmlFor="summary" className="mb-1 block text-sm font-medium text-slate-700">
          Stutt samantekt
        </label>
        <textarea id="summary" name="summary" rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <div>
        <label htmlFor="blockers" className="mb-1 block text-sm font-medium text-slate-700">
          Hindranir
        </label>
        <textarea id="blockers" name="blockers" rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <div>
        <label htmlFor="nextSteps" className="mb-1 block text-sm font-medium text-slate-700">
          Næstu skref
        </label>
        <textarea id="nextSteps" name="nextSteps" rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <button
        type="submit"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Vista púls
      </button>

      {submitted ? (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Púls vistaður.
        </p>
      ) : null}
    </form>
  );
}
