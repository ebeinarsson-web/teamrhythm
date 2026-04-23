"use client";

import { useState } from "react";
import { formatDateIs } from "@/lib/date-format";
import { getPulseDisplayTitle } from "@/lib/pulse-display";
import type { Pulse } from "@/lib/types";
import PulseDetailDialog from "./PulseDetailDialog";

type Props = {
  topAttention: Pulse[];
  latestPulses: Pulse[];
};

const statusLabel: Record<Pulse["status"], string> = {
  green: "Græn",
  yellow: "Gul",
  red: "Rauð",
};

const statusToneClass: Record<Pulse["status"], string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  yellow: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
};

function PulseListItem({ pulse, onOpen }: { pulse: Pulse; onOpen: (pulse: Pulse) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(pulse)}
      className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2.5 text-left transition-colors hover:bg-slate-100"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="line-clamp-1 text-sm font-medium text-slate-900">{getPulseDisplayTitle(pulse)}</p>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusToneClass[pulse.status]}`}>
          {statusLabel[pulse.status]}
        </span>
      </div>
      <p className="mt-1 line-clamp-1 text-xs text-slate-600">
        {pulse.teamName} - {formatDateIs(pulse.meetingDate)}
      </p>
    </button>
  );
}

export default function HomePulseSections({ topAttention, latestPulses }: Props) {
  const [selectedPulse, setSelectedPulse] = useState<Pulse | null>(null);

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Þarfnast athygli</h2>
          <div className="mt-3 space-y-3">
            {topAttention.length === 0 ? (
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Engir púlsar í gulri eða rauðri stöðu núna.
              </p>
            ) : (
              topAttention.map((pulse) => <PulseListItem key={pulse.id} pulse={pulse} onOpen={setSelectedPulse} />)
            )}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Nýjustu púlsar</h2>
          <div className="mt-3 space-y-3">
            {latestPulses.length === 0 ? (
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">Engar púlsfærslur fundust.</p>
            ) : (
              latestPulses.map((pulse) => <PulseListItem key={pulse.id} pulse={pulse} onOpen={setSelectedPulse} />)
            )}
          </div>
        </article>
      </section>

      {selectedPulse ? <PulseDetailDialog pulse={selectedPulse} onClose={() => setSelectedPulse(null)} /> : null}
    </>
  );
}
