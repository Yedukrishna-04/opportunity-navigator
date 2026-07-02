import bcrypt from "bcryptjs";
import pg from "pg";
import { loadLocalEnv } from "./env.mjs";

const { Pool } = pg;

loadLocalEnv();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

const users = [
  ["Admin User", "admin@opnav.test", "admin"],
  ["Maya Counselor", "counselor@opnav.test", "counselor"],
  ["Ravi Reviewer", "reviewer@opnav.test", "reviewer"]
];

const resources = [
  {
    title: "Bridge Scholarship for First Generation Learners",
    provider: "House of Edtech Foundation",
    region: "Karnataka",
    minEducation: "undergraduate",
    maxIncome: 450000,
    supportType: "tuition",
    deadline: "2026-09-30",
    description: "Supports first generation undergraduate students with tuition gaps and mentor check-ins."
  },
  {
    title: "Emergency Device Access Grant",
    provider: "Digital Learning Trust",
    region: "All India",
    minEducation: "secondary",
    maxIncome: 300000,
    supportType: "device",
    deadline: "2026-08-15",
    description: "One-time device and connectivity support for students at risk of dropping out."
  },
  {
    title: "STEM Continuity Fellowship",
    provider: "Future Skills Guild",
    region: "Maharashtra",
    minEducation: "undergraduate",
    maxIncome: 600000,
    supportType: "stipend",
    deadline: "2026-11-01",
    description: "Monthly stipend for STEM learners with documented family income disruption."
  }
];

async function main() {
  const hash = await bcrypt.hash("Password123!", 12);

  for (const [name, email, role] of users) {
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role`,
      [name, email, hash, role]
    );
  }

  const { rows } = await pool.query("SELECT id FROM users WHERE email = $1", ["admin@opnav.test"]);
  const adminId = rows[0].id;

  for (const resource of resources) {
    await pool.query(
      `INSERT INTO aid_resources
       (title, provider, region, min_education_level, max_income, support_type, deadline, description, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT DO NOTHING`,
      [
        resource.title,
        resource.provider,
        resource.region,
        resource.minEducation,
        resource.maxIncome,
        resource.supportType,
        resource.deadline,
        resource.description,
        adminId
      ]
    );
  }

  console.log("Seed complete. Demo password: Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
