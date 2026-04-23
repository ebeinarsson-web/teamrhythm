import type { Pulse, Team } from "@/lib/types";

export const mockTeams: Team[] = [
  { id: "t1", name: "Kjarnateymi", lead: "Anna" },
  { id: "t2", name: "Vöruþróun", lead: "Björn" },
];

export const mockPulses: Pulse[] = [
  {
    id: "p1",
    teamId: "t1",
    date: "2026-04-20",
    status: "yellow",
    blockers: "Óskýr forgangsröðun á tveimur verkefnum.",
    nextSteps: "Skýra forgang fyrir föstudag og loka eigendaskiptingu.",
    summary: "Áframhald á réttri leið en þarf skýrari forgang.",
  },
  {
    id: "p2",
    teamId: "t2",
    date: "2026-04-22",
    status: "green",
    blockers: "Engar stórar hindranir núna.",
    nextSteps: "Halda vikulegri stöðutöku og uppfæra sameiginlega stöðumynd.",
    summary: "Góð samvinna og skýr framvinda í þessari viku.",
  },
];
