import { NextResponse } from "next/server";
import { assertRole, getCurrentUser } from "@/lib/auth";
import { getResource } from "@/lib/data";
import { mapResource, pool } from "@/lib/db";
import { resourceSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, props: Params) {
  const { id } = await props.params;
  const resource = await getResource(id);
  if (!resource) return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  return NextResponse.json({ resource });
}

export async function PUT(request: Request, props: Params) {
  const user = await getCurrentUser();
  const denied = assertRole(user, ["admin", "reviewer"]);
  if (denied) return denied;

  const parsed = resourceSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Resource validation failed.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await props.params;
  const { rows } = await pool.query(
    `UPDATE aid_resources
     SET title = $2, provider = $3, region = $4, min_education_level = $5, max_income = $6,
         support_type = $7, deadline = NULLIF($8, '')::date, description = $9, updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      parsed.data.title,
      parsed.data.provider,
      parsed.data.region,
      parsed.data.minEducationLevel,
      parsed.data.maxIncome,
      parsed.data.supportType,
      parsed.data.deadline ?? "",
      parsed.data.description
    ]
  );

  if (!rows[0]) return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  return NextResponse.json({ resource: mapResource(rows[0]) });
}

export async function DELETE(_request: Request, props: Params) {
  const user = await getCurrentUser();
  const denied = assertRole(user, ["admin"]);
  if (denied) return denied;

  const { id } = await props.params;
  await pool.query("DELETE FROM aid_resources WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
