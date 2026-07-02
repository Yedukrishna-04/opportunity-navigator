import { mapCase, mapRecommendation, mapResource, pool } from "@/lib/db";
import { canManageAll } from "@/lib/auth";
import type { AidResource, CaseStatus, SessionUser, StudentCase } from "@/lib/types";

export async function listCases(user: SessionUser) {
  const query = canManageAll(user.role)
    ? `SELECT cases.*, users.name AS owner_name
       FROM cases JOIN users ON users.id = cases.owner_id
       ORDER BY cases.updated_at DESC`
    : `SELECT cases.*, users.name AS owner_name
       FROM cases JOIN users ON users.id = cases.owner_id
       WHERE cases.owner_id = $1
       ORDER BY cases.updated_at DESC`;

  const { rows } = await pool.query(query, canManageAll(user.role) ? [] : [user.id]);
  return rows.map(mapCase);
}

export async function getCase(id: string, user: SessionUser) {
  const { rows } = await pool.query(
    `SELECT cases.*, users.name AS owner_name
     FROM cases JOIN users ON users.id = cases.owner_id
     WHERE cases.id = $1`,
    [id]
  );
  const record = rows[0] ? mapCase(rows[0]) : null;
  if (!record) return null;
  if (!canManageAll(user.role) && record.ownerId !== user.id) return null;
  return record;
}

export async function listResources() {
  const { rows } = await pool.query("SELECT * FROM aid_resources ORDER BY deadline NULLS LAST, title");
  return rows.map(mapResource);
}

export async function getResource(id: string) {
  const { rows } = await pool.query("SELECT * FROM aid_resources WHERE id = $1", [id]);
  return rows[0] ? mapResource(rows[0]) : null;
}

export async function listRecommendations(caseId: string) {
  const { rows } = await pool.query(
    "SELECT * FROM recommendations WHERE case_id = $1 ORDER BY created_at DESC",
    [caseId]
  );
  return rows.map(mapRecommendation);
}

export function scoreResource(studentCase: StudentCase, resource: AidResource) {
  let score = 0;
  if (resource.region === "All India" || resource.region.toLowerCase() === studentCase.region.toLowerCase()) {
    score += 35;
  }
  if (studentCase.householdIncome <= resource.maxIncome) score += 30;
  if (studentCase.educationLevel === resource.minEducationLevel) score += 20;
  if (studentCase.urgency === "high" && ["device", "stipend", "housing"].includes(resource.supportType)) score += 10;
  if (resource.deadline && new Date(resource.deadline).getTime() < Date.now() + 1000 * 60 * 60 * 24 * 21) score += 5;
  return score;
}

export async function createCase(input: Omit<StudentCase, "id" | "ownerName" | "createdAt" | "updatedAt">) {
  const { rows } = await pool.query(
    `INSERT INTO cases
     (student_name, student_email, region, household_income, education_level, urgency, barriers, notes, status, owner_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      input.studentName,
      input.studentEmail,
      input.region,
      input.householdIncome,
      input.educationLevel,
      input.urgency,
      input.barriers,
      input.notes,
      input.status,
      input.ownerId
    ]
  );
  return mapCase(rows[0]);
}

export async function updateCase(id: string, input: Partial<StudentCase> & { status?: CaseStatus }) {
  const { rows } = await pool.query(
    `UPDATE cases
     SET student_name = $2, student_email = $3, region = $4, household_income = $5,
         education_level = $6, urgency = $7, barriers = $8, notes = $9, status = $10, updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      input.studentName,
      input.studentEmail,
      input.region,
      input.householdIncome,
      input.educationLevel,
      input.urgency,
      input.barriers,
      input.notes,
      input.status
    ]
  );
  return rows[0] ? mapCase(rows[0]) : null;
}

export async function deleteCase(id: string) {
  await pool.query("DELETE FROM cases WHERE id = $1", [id]);
}
