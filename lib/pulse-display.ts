import { formatDateIs } from "@/lib/date-format";
import type { Pulse } from "@/lib/types";

function hasValidDate(value: string): boolean {
  if (!value) return false;
  const timestamp = new Date(value).getTime();
  return !Number.isNaN(timestamp);
}

export function getPulseDisplayTitle(pulse: Pulse): string {
  if (hasValidDate(pulse.meetingDate)) {
    return `Púls ${formatDateIs(pulse.meetingDate)}`;
  }
  if (hasValidDate(pulse.createdDate)) {
    return `Púls ${formatDateIs(pulse.createdDate)}`;
  }
  return pulse.title?.trim() || "Púls";
}
