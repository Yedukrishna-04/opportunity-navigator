import { NextResponse } from "next/server";
import { createCase, listCases } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { caseSchema } from "@/lib/validators";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  return NextResponse.json({ cases: await listCases(user) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const parsed = caseSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Case validation failed.", details: parsed.error.flatten() }, { status: 400 });
  }

  const record = await createCase({
    ...parsed.data,
    ownerId: user.id
  });

  return NextResponse.json({ case: record }, { status: 201 });
}
