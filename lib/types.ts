export type Team = {
  id: string;
  name: string;
  isActive: boolean;
  contact: string;
  meetingCadence: string;
  notes: string;
};

export type Pulse = {
  id: string;
  title: string;
  teamId: string;
  teamName: string;
  createdDate: string;
  meetingDate: string;
  status: "green" | "yellow" | "red";
  goals: string;
  wins: string;
  blockers: string;
  decisionsNeeded: string;
  nextSteps: string;
  submittedBy: string;
};

export type NewPulseInput = {
  teamId: string;
  status: Pulse["status"];
  blockers: string;
  nextSteps: string;
  summary: string;
};
