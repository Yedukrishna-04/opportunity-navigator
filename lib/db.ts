import pg from "pg";
import type { AidResource, Recommendation, StudentCase } from "@/lib/types";

const { Pool } = pg;

declare global {
  var __opnavPool: pg.Pool | undefined;
}

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000
  });
}

export const pool = globalThis.__opnavPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__opnavPool = pool;
}

export function mapCase(row: Record<string, unknown>): StudentCase {
  return {
    id: String(row.id),
    studentName: String(row.student_name),
    studentEmail: String(row.student_email),
    region: String(row.region),
    householdIncome: Number(row.household_income),
    educationLevel: String(row.education_level),
    urgency: row.urgency as StudentCase["urgency"],
    barriers: (row.barriers ?? []) as string[],
    notes: String(row.notes ?? ""),
    status: row.status as StudentCase["status"],
    ownerId: String(row.owner_id),
    ownerName: row.owner_name ? String(row.owner_name) : undefined,
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString()
  };
}

export function mapResource(row: Record<string, unknown>): AidResource {
  return {
    id: String(row.id),
    title: String(row.title),
    provider: String(row.provider),
    region: String(row.region),
    minEducationLevel: String(row.min_education_level),
    maxIncome: Number(row.max_income),
    supportType: String(row.support_type),
    deadline: row.deadline ? new Date(row.deadline as string).toISOString().slice(0, 10) : null,
    description: String(row.description),
    createdBy: String(row.created_by),
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString()
  };
}

export function mapRecommendation(row: Record<string, unknown>): Recommendation {
  return {
    id: String(row.id),
    caseId: String(row.case_id),
    generatedBy: String(row.generated_by),
    summary: String(row.summary),
    actionPlan: String(row.action_plan),
    riskFlags: (row.risk_flags ?? []) as string[],
    createdAt: new Date(row.created_at as string).toISOString()
  };
}
