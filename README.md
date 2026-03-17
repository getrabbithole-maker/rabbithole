# rabbithole — Waitlist Landing Page

A premium waitlist landing page for Rabbithole, a deep work ritual app.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase (database)
- Resend (emails)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

3. **Set up Supabase:**
   - Create a new Supabase project
   - Run the SQL in `supabase/schema.sql` in your Supabase SQL editor
   - Copy your project URL and keys to `.env.local`

4. **Set up Resend:**
   - Create a Resend account
   - Add your API key to `.env.local`
   - Verify your domain (noreply@rabbithole.so)

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Features

- Bilingual support (English/Thai)
- Real-time spot counter
- Live countdown timer
- Email confirmation with Resend
- Responsive design
- Premium dark UI

## Environment Variables

See `.env.example` for all required variables.

## Developed by Namwaaok

---

Go deep. Stay deep.
