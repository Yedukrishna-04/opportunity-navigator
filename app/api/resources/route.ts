import { NextResponse } from "next/server";
import { assertRole, getCurrentUser } from "@/lib/auth";
import { mapResource, pool } from "@/lib/db";
import { listResources } from "@/lib/data";
import { resourceSchema } from "@/lib/validators";

export async function GET() {
  return NextResponse.json({ resources: await listResources() });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const denied = assertRole(user, ["admin", "reviewer"]);
  if (denied) return denied;

  const parsed = resourceSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Resource validation failed.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { rows } = await pool.query(
    `INSERT INTO aid_resources
     (title, provider, region, min_education_level, max_income, support_type, deadline, description, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, NULLIF($7, '')::date, $8, $9)
     RETURNING *`,
    [
      parsed.data.title,
      parsed.data.provider,
      parsed.data.region,
      parsed.data.minEducationLevel,
      parsed.data.maxIncome,
      parsed.data.supportType,
      parsed.data.deadline ?? "",
      parsed.data.description,
      user!.id
    ]
  );

  return NextResponse.json({ resource: mapResource(rows[0]) }, { status: 201 });
}
