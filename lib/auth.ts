import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import type { Role, SessionUser } from "@/lib/types";

const COOKIE_NAME = "opnav_session";
const issuer = "opportunity-navigator";

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters.");
  }
  return new TextEncoder().encode(value);
}

export async function signSession(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(issuer)
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

export async function verifySession(token?: string): Promise<SessionUser | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret(), { issuer });
    return {
      id: String(payload.id),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role as Role
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(COOKIE_NAME)?.value);
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function authenticate(email: string, password: string): Promise<SessionUser | null> {
  const { rows } = await pool.query(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
    [email]
  );
  const row = rows[0];
  if (!row) return null;

  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role
  };
}

export function canManageAll(role: Role) {
  return role === "admin" || role === "reviewer";
}

export function assertRole(user: SessionUser | null, roles: Role[]) {
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  if (!roles.includes(user.role)) {
    return NextResponse.json({ error: "You do not have permission for this action." }, { status: 403 });
  }
  return null;
}
