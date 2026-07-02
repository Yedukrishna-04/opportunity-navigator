export type Role = "admin" | "counselor" | "reviewer";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type CaseStatus = "intake" | "matched" | "submitted" | "approved" | "blocked";

export type StudentCase = {
  id: string;
  studentName: string;
  studentEmail: string;
  region: string;
  householdIncome: number;
  educationLevel: string;
  urgency: "low" | "medium" | "high";
  barriers: string[];
  notes: string;
  status: CaseStatus;
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
};

export type AidResource = {
  id: string;
  title: string;
  provider: string;
  region: string;
  minEducationLevel: string;
  maxIncome: number;
  supportType: string;
  deadline: string | null;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type Recommendation = {
  id: string;
  caseId: string;
  generatedBy: string;
  summary: string;
  actionPlan: string;
  riskFlags: string[];
  createdAt: string;
};
