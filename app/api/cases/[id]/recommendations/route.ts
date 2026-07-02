import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getCase, listRecommendations, listResources } from "@/lib/data";
import { generateRecommendation } from "@/lib/ai";
import { mapRecommendation, pool } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, props: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await props.params;
  const record = await getCase(id, user);
  if (!record) return NextResponse.json({ error: "Case not found." }, { status: 404 });

  return NextResponse.json({ recommendations: await listRecommendations(id) });
}

export async function POST(_request: Request, props: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await props.params;
  const record = await getCase(id, user);
  if (!record) return NextResponse.json({ error: "Case not found." }, { status: 404 });

  const generated = await generateRecommendation(record, await listResources());
  const { rows } = await pool.query(
    `INSERT INTO recommendations (case_id, generated_by, summary, action_plan, risk_flags)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [id, user.id, generated.summary, generated.actionPlan, generated.riskFlags]
  );

  return NextResponse.json({ recommendation: mapRecommendation(rows[0]) }, { status: 201 });
}
