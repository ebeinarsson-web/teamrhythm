export type Team = {
  id: string;
  name: string;
  lead: string;
};

export type Pulse = {
  id: string;
  teamId: string;
  date: string;
  status: "green" | "yellow" | "red";
  blockers: string;
  nextSteps: string;
  summary: string;
};

export type NewPulseInput = {
  teamId: string;
  status: Pulse["status"];
  blockers: string;
  nextSteps: string;
  summary: string;
};
