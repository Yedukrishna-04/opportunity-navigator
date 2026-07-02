import { NextResponse } from "next/server";
import { authenticate, setSessionCookie, signSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
    }

    const user = await authenticate(parsed.data.email, parsed.data.password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const response = NextResponse.json({ user });
    setSessionCookie(response, await signSession(user));
    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json(
      { error: "Login failed. Check that PostgreSQL is running and seeded." },
      { status: 500 }
    );
  }
}
