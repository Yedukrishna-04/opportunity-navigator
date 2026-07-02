# 🎓 Opportunity Navigator

> An AI-powered opportunity management platform that helps education counselors efficiently manage student cases, identify financial aid opportunities, and provide personalized recommendations.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌐 Live Demo

**Application:**  
https://opportunity-navigator-eight.vercel.app/

---

## 📖 Overview

Opportunity Navigator is a full-stack web application built using **Next.js 16** and **PostgreSQL** to help education counselors manage student opportunities efficiently.

Instead of being a simple CRUD application, Opportunity Navigator combines secure authentication, role-based access control, eligibility scoring, counselor workflows, and AI-assisted recommendations to simplify the process of matching students with financial aid opportunities.

The application emphasizes scalability, security, accessibility, and modern development practices while delivering an intuitive user experience.

---

# ✨ Features

- 🔐 Secure Authentication using JWT
- 👥 Role-Based Authorization
- 📂 Student Case Management
- 📚 Aid Resource Management
- 🤖 AI-Powered Opportunity Recommendations
- 📊 Eligibility Scoring
- ✅ Complete CRUD Operations
- 🛡 Input Validation with Zod
- 🔒 Secure HTTP-only Cookies
- 📱 Fully Responsive UI
- ⚡ Server-Side Rendering (SSR)
- 🎨 Modern Tailwind CSS Interface

---

# 🛠 Tech Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js Route Handlers
- REST APIs

## Database

- PostgreSQL

## Authentication

- JWT Authentication
- HTTP-only Cookies
- bcrypt Password Hashing

## Validation

- Zod

## AI

- OpenAI API
- Local deterministic fallback when API key is unavailable

## Deployment

- Vercel

## Package Manager

- pnpm

---

# 📂 Project Structure

```text
app/
components/
db/
lib/
public/
styles/
middleware.ts
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone <repository-url>
cd opportunity-navigator
```

---

## 2. Install dependencies

```bash
pnpm install
```

---

## 3. Configure Environment Variables

Copy

```bash
cp .env.example .env
```

Update the values inside `.env`.

---

## 4. Start PostgreSQL

```bash
docker compose up -d
```

---

## 5. Run Database Migration

```bash
pnpm db:migrate
```

---

## 6. Seed Sample Data

```bash
pnpm db:seed
```

---

## 7. Start Development Server

```bash
pnpm dev
```

Visit

```
http://localhost:3000
```

---

# 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@opnav.test | Password123! |
| Counselor | counselor@opnav.test | Password123! |
| Reviewer | reviewer@opnav.test | Password123! |

---

# 🤖 AI Integration

Opportunity Navigator integrates AI to assist counselors by generating intelligent recommendations for financial aid opportunities based on student information.

When an `OPENAI_API_KEY` is configured, OpenAI powers these recommendations.

If the API key is unavailable, the application automatically switches to a deterministic local recommendation engine, ensuring uninterrupted functionality.

---

# 🔒 Security Features

- JWT Authentication
- HTTP-only Cookies
- Password Hashing using bcrypt
- Role-Based Authorization
- Zod Validation
- Parameterized SQL Queries
- Input Sanitization
- Protected API Routes

---

# 📈 Performance Optimizations

- Server-Side Rendering (SSR)
- Optimized React Components
- Efficient Database Queries
- Clean Component Architecture
- Code Splitting
- Responsive Design

---

# 📸 Screenshots

### Login

> *(Add Screenshot Here)*

---

### Dashboard

> *(Add Screenshot Here)*

---

### Student Cases

> *(Add Screenshot Here)*

---

### AI Recommendations

> *(Add Screenshot Here)*

---

# 🌍 Deployment

The application is deployed on **Vercel**.

Live Application:

https://opportunity-navigator-eight.vercel.app/

---

# 📌 Future Improvements

- Email Notifications
- Advanced AI Matching
- Analytics Dashboard
- Multi-language Support
- File Uploads
- Calendar Integration
- PDF Report Generation

---

# 👨‍💻 Author

**Yedukrishna Nair**

GitHub

https://github.com/Yedukrishna-04

LinkedIn

https://www.linkedin.com/in/yedukrishna-nair/

---

# ⭐ Repository

If you found this project interesting, feel free to ⭐ the repository.

Feedback and contributions are always welcome.
