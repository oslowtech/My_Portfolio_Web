# Pranjal Giri — Engineering Systems Console

An industrial aerospace and robotics laboratory control console portfolio. Built with **Next.js 15**, **React 19**, **Three.js / React Three Fiber**, **Tailwind CSS v4**, **Supabase**, and **Resend**.

Designed around real hardware aesthetics: telemetry streams, flight computers, UAV/UGV robotics systems, technical schematics, and clean engineering interfaces.

---

## Subsystem Architecture & Features

### 1. Visual Identity & Interface
- **Industrial Aerospace Aesthetic**: Warm technical paper / graphite `#12181B`, `#E9E6DD`, aerospace orange `#D96C32`, and muted telemetry accents.
- **Interactive 3D Schematics**: Interactive Three.js/Fiber avionics models, technical overlays, and engineering grid layers.
- **Dark & Light Mode**: Telemetry HUD theme switching with full contrast preservation.
- **Character Integration**: Stylized engineering lead avatar representing Pranjal Giri across hero poses, field research, and lab scenes.

### 2. Complete Authentication & Security Gateway
- **Multi-Factor Pathways**:
  - **Google OAuth**: Fast 1-click single sign-on with automatic avatar synchronization.
  - **Email OTP & Magic Link**: Passwordless entry via 6-digit access codes or direct transmission links.
  - **Manual Password Credentials**: Secure email and password sign-in.
- **Account & Security Protocols**:
  - **Password Recovery & Overrides**: Integrated forgot password flow with custom aerospace email template and secure reset token validation.
  - **In-App Password Updates**: Direct credential updates from Operator Profile.
  - **Email Address Reassignment**: Dual-confirmation address updating.
- **Strict Role-Based Access Control**:
  - Master administration hard-locked to `pranjalgiri1122005@gmail.com` via Next.js Middleware and database triggers.
  - Operators / Users have access to bookmarks, interactive discussions, and profile customization.

### 3. Admin Command Center (`/admin`)
- **System Metrics & Statistics**: Real-time counts of active systems, blog research notes, and contact transmissions.
- **Project Telemetry Manager**: Create, edit, and categorize projects (`flight`, `robotics`, `uav`, `ai`, `software`, `embedded`).
- **Technical Research Notes**: Markdown editor for engineering writeups and postmortem notes.
- **Resend Inbound & Reply Portal (`/admin/messages`)**:
  - Real-time contact transmission feed with unique tracking IDs (`MSG-ID: #PG-XXXXX`).
  - Interactive email dispatch console to reply directly to inquiries using pre-formatted aerospace email templates through the Resend API.
- **Operator Roster & Invitations (`/admin/users`)**:
  - Dispatch authorization invitations to new operators with custom clearance notes.
  - View registered operator roster and credentials.
- **Email Template Hub (`/admin/templates`)**:
  - Interactive live preview and 1-click clipboard copy for all Supabase Auth templates and Resend outbound formats.
  - One-click test button to dispatch test emails directly to your inbox.

---

## Tech Stack

| Component | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Actions, Middleware) |
| **Runtime & Package Manager** | Bun / Node.js |
| **3D Rendering** | Three.js, React Three Fiber, Drei |
| **Styling** | Tailwind CSS v4, Lucide Icons |
| **Authentication & Database** | Supabase Auth (OAuth, OTP, Magic Link) & PostgreSQL |
| **Email & Transmissions** | Resend API + Supabase Auth Email Engine |
| **Animation** | Framer Motion |

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/my-portfolio-web.git
cd my-portfolio-web
```

### 2. Install Dependencies
```bash
bun install
# or
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_anon_key
RESEND_API_KEY=re_your_resend_api_key
ADMIN_EMAIL=pranjalgiri1122005@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Setup
Run the SQL migration in your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql):
- Execute [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)

### 5. Run Development Server
```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `RESEND_API_KEY`, `ADMIN_EMAIL`, `NEXT_PUBLIC_SITE_URL`).
4. Deploy!

---

## Author

**Pranjal Giri**  
Vellore Institute of Technology (VIT) Chennai  
AI, Robotics & Flight Software
