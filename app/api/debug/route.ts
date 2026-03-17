import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const debug = {
    environment: process.env.NODE_ENV,
    supabase: {
      urlConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      anonKeyConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceKeyConfigured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    telegram: {
      botConfigured: !!process.env.TELEGRAM_BOT_TOKEN,
      chatIdConfigured: !!process.env.TELEGRAM_CHAT_ID,
    },
    resend: {
      configured: !!process.env.RESEND_API_KEY,
    }
  }

  return NextResponse.json(debug)
}
