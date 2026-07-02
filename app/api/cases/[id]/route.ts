import { NextResponse } from "next/server";
import { canManageAll, getCurrentUser } from "@/lib/auth";
import { deleteCase, getCase, updateCase } from "@/lib/data";
import { caseSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, props: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await props.params;
  const record = await getCase(id, user);
  if (!record) return NextResponse.json({ error: "Case not found." }, { status: 404 });

  return NextResponse.json({ case: record });
}

export async function PUT(request: Request, props: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await props.params;
  const existing = await getCase(id, user);
  if (!existing) return NextResponse.json({ error: "Case not found." }, { status: 404 });

  const parsed = caseSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Case validation failed.", details: parsed.error.flatten() }, { status: 400 });
  }

  if (!canManageAll(user.role) && parsed.data.status !== existing.status) {
    return NextResponse.json({ error: "Only reviewers and admins can change status." }, { status: 403 });
  }

  const record = await updateCase(id, parsed.data);
  return NextResponse.json({ case: record });
}

export async function DELETE(_request: Request, props: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!canManageAll(user.role)) {
    return NextResponse.json({ error: "Only reviewers and admins can delete cases." }, { status: 403 });
  }

  const { id } = await props.params;
  await deleteCase(id);
  return NextResponse.json({ ok: true });
}
