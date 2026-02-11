# 🦁 Zoo Management System

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-316192)

A role-based web application for managing a zoological park — animals, habitats, treatments, feedings and tasks — built with **Next.js**, **TypeScript**, **Prisma**, and **PostgreSQL**.

---

## ✨ Features

### 🐾 Animal Management

- Create / update / delete animals
- Track: scientific name, common name, age, sex, weight, health status, arrival date
- Assign animals to habitats

### 🏞️ Habitat Management

- Manage habitats: type, capacity, status (open/closed)
- Coordinate-based habitat shape (`Int[]`) for map rendering
- See animals per habitat

### 💊 Treatments

- Create treatment records linked to animals
- Track title, notes, date, createdBy
- Cascading deletion when an animal is removed

### 🍽️ Feedings

- Schedule feedings and mark as fed
- Track food type, quantity, scheduled date and fedBy

### 🧩 Tasks

- Create operational tasks with:
  - status: TODO / IN_PROGRESS / BLOCKED / DONE / CANCELED
  - priority: LOW → URGENT
  - dueDate / startAt / completedAt
- Assign tasks to users
- Optional linking to: animal / habitat / treatment

---

## 👥 Roles & Access

| Role        | Description                        |
| ----------- | ---------------------------------- |
| STAFF       | Basic access (daily operations)    |
| ADMIN       | Manage animals/habitats/treatments |
| SUPER_ADMIN | Full access to the system          |

---

## 🧱 Tech Stack

**Frontend**

- Next.js (App Router)
- React + TypeScript
- TailwindCSS
- shadcn/ui

**Backend**

- Next.js Server Actions
- Prisma ORM
- PostgreSQL
- JWT authentication
- Role-based authorization

**Dev Tools**

- Prisma Studio
- Faker seed data
- ESLint

---

## ✅ Requirements

- Node.js 18+ (recommended 20+)
- PostgreSQL database
- npm / pnpm / yarn / bun

---

## 🚀 Getting Started

Follow these steps to run the project locally.

---

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/zoo_db"
JWT_SECRET="your_super_secret_key"
```

Make sure:

- PostgreSQL is installed
- Database exists
- Credentials are correct

---

### 3️⃣ Generate Prisma Client

```bash
npx prisma generate
```

---

### 4️⃣ Run Database Migrations

```bash
npx prisma migrate dev
```

---

### 5️⃣ Seed the Database (Recommended)

```bash
npx tsx prisma/seed.ts
```

Custom seed volume:

```bash
npx tsx prisma/seed.ts 10 30 50 100 120
# users animals treatments feedings tasks
```

---

### 6️⃣ Start Development Server

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 🔐 Default Accounts (Seeded)

| Role        | Email              | Password  |
| ----------- | ------------------ | --------- |
| SUPER_ADMIN | superadmin@zoo.com | sadmin123 |
| ADMIN       | admin@zoo.com      | admin123  |
| STAFF       | staff@zoo.com      | staff123  |

---

## 🛠️ Useful Commands

```bash
# Prisma Studio (Database GUI)
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate dev

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Run seed manually
npx tsx prisma/seed.ts

# Build production version
npm run build

# Start production server
npm start
```

---

## 🌍 Deployment

### Deploy on Vercel

1. Push repository to GitHub
2. Import project into Vercel
3. Add environment variables:
   - DATABASE_URL
   - JWT_SECRET
4. Deploy

---

### Self-Hosted Deployment

Build the app:

```bash
npm run build
```

Start production server:

```bash
npm start
```

Production requires:

- Hosted PostgreSQL database (Railway / Render / Supabase / Neon)
- Correct environment variables
- Proper database migrations applied

---

## 📄 License

MIT License
