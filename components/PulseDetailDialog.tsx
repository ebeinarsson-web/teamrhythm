"use client";

import Link from "next/link";
import { useEffect } from "react";
import { formatDateIs } from "@/lib/date-format";
import { getPulseDisplayTitle } from "@/lib/pulse-display";
import type { Pulse } from "@/lib/types";

type Props = {
  pulse: Pulse;
  onClose: () => void;
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2.5">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-800">{value || "Ekki skráð"}</p>
    </div>
  );
}

export default function PulseDetailDialog({ pulse, onClose }: Props) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-slate-900/45 p-0 sm:items-center sm:justify-center sm:p-4">
      <button
        type="button"
        aria-label="Loka glugga"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-h-[92vh] overflow-auto rounded-t-2xl bg-white p-4 shadow-xl sm:max-w-2xl sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{pulse.teamName}</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
              {getPulseDisplayTitle(pulse)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
          >
            Loka
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-600">{formatDateIs(pulse.meetingDate)}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusToneClass[pulse.status]}`}>
            {statusLabel[pulse.status]}
          </span>
        </div>

        <div className="mt-4 grid gap-3">
          <Field label="Helstu markmið" value={pulse.goals} />
          <Field label="Hvað gekk vel" value={pulse.wins} />
          <Field label="Hvað tefur framvindu" value={pulse.blockers} />
          <Field label="Hvaða ákvarðanir eða stuðning vantar" value={pulse.decisionsNeeded} />
          <Field label="Næstu skref" value={pulse.nextSteps} />
          <Field label="Sent inn af" value={pulse.submittedBy} />
        </div>

        <div className="mt-5">
          <Link
            href={`/pulsar?team=${encodeURIComponent(pulse.teamId)}`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Sjá í Púlsum
          </Link>
        </div>
      </div>
    </div>
  );
}
