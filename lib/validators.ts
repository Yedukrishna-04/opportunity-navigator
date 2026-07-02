import { z } from "zod";

const cleanText = (max = 300) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .transform((value) => value.replace(/[<>]/g, ""));

export const loginSchema = z.object({
  email: z.string().trim().email().max(255).toLowerCase(),
  password: z.string().min(8).max(128)
});

export const caseSchema = z.object({
  studentName: cleanText(120),
  studentEmail: z.string().trim().email().max(255).toLowerCase(),
  region: cleanText(80),
  householdIncome: z.coerce.number().int().min(0).max(10000000),
  educationLevel: z.enum(["secondary", "undergraduate", "postgraduate", "vocational"]),
  urgency: z.enum(["low", "medium", "high"]),
  barriers: z
    .array(cleanText(60))
    .max(8)
    .default([])
    .transform((items) => Array.from(new Set(items.filter(Boolean)))),
  notes: z.string().trim().max(1200).default(""),
  status: z.enum(["intake", "matched", "submitted", "approved", "blocked"]).default("intake")
});

export const resourceSchema = z.object({
  title: cleanText(160),
  provider: cleanText(140),
  region: cleanText(80),
  minEducationLevel: z.enum(["secondary", "undergraduate", "postgraduate", "vocational"]),
  maxIncome: z.coerce.number().int().min(0).max(10000000),
  supportType: z.enum(["tuition", "device", "stipend", "housing", "exam-fee", "mentorship"]),
  deadline: z.string().date().optional().or(z.literal("")),
  description: cleanText(1000)
});
