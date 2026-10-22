# Plan — Academic Daily Planner for College Students

"Plan" is an opinionated, minimalist daily planner web application engineered for university students to manage coursework, deadlines, exams, projects, time-blocked daily schedules, and academic momentum.

Designed with **Apple's Human Interface Guidelines** and visual source of truth from **Google Stitch** ("Student Daily Planner Dashboard", Design System: *Academic Clarity*).

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15 (App Router) + React 19 + TypeScript (strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 with design tokens mapped to CSS variables
- **UI & Components**: Custom [shadcn/ui](https://ui.shadcn.com/) primitives styled for Apple HIG
- **Database & Auth**: [Supabase](https://supabase.com/) Postgres + Supabase Auth (`@supabase/ssr`) with Row Level Security (RLS)
- **ORM & Migrations**: [Drizzle ORM](https://orm.drizzle.team/) + `drizzle-kit`
- **Data Fetching & State**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Dates**: [date-fns](https://date-fns.org/)
- **Transitions**: [Framer Motion](https://www.framer.com/motion/)
- **Icons & Charts**: [Lucide React](https://lucide.dev/) + [Recharts](https://recharts.org/)

---

## 🎨 Design System

All design tokens are documented in [`DESIGN.md`](./DESIGN.md) and exposed as CSS variables:
- **Primary Accent**: Electric Indigo (`#5E5CE6`)
- **Canvas / Background**: Light `#F5F5F7` / Dark `#0E0E11`
- **Surface**: Solid `#FFFFFF` / Dark `#18181B` with 20px radii
- **Frosted Glass**: `backdrop-blur-xl` on sidebar, top header, and mobile navigation bar
- **Academic Taxonomy**:
  - Exam: `#FF3B30` (Apple Red)
  - Assignment: `#FF9500` (Apple Orange)
  - Project: `#AF52DE` (Apple Purple)
  - Personal: `#34C759` (Apple Green)

---

## 🛠️ Setup & Development

### 1. Prerequisites
- Node.js 18+ (tested on v24.21.0)
- npm 9+

### 2. Installation
```bash
git clone <repo-url>
cd personal
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 5. Type-Check and Linting
```bash
npm run lint
npx tsc --noEmit
npm run build
```

---

## 📦 Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx         # App shell layout (Sidebar, Header, MobileTabBar)
│   │   ├── today/page.tsx     # Today dashboard
│   │   ├── calendar/page.tsx  # Academic calendar & assessment schedule
│   │   ├── projects/          # Deliverables & Kanban board
│   │   └── history/page.tsx   # History & reflection log
│   ├── globals.css            # Design system tokens & Tailwind imports
│   └── layout.tsx             # Root layout with ThemeProvider & QueryProvider
├── components/
│   ├── ui/                    # Restyled shadcn/ui components (Button, Badge, Card, Dialog, Input, Avatar)
│   ├── shell/                 # Sidebar, Header, MobileTabBar, ThemeToggle, QuickAddModal
│   └── providers/             # ThemeProvider, QueryProvider
├── lib/
│   ├── db/
│   │   ├── schema.ts          # Postgres Drizzle ORM schema
│   │   └── index.ts           # Drizzle client configuration
│   ├── supabase/              # Browser and server Supabase clients
│   ├── mock-data.ts           # Realistic student seed data matching Stitch
│   └── utils.ts               # cn class merge utility
└── DESIGN.md                  # Comprehensive design system tokens
```
