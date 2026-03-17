import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json({
        count: 0,
        error: 'Database not configured',
        debug: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      }, { status: 200 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { count, error } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error fetching waitlist count:', error)
      return NextResponse.json({
        count: 0,
        error: 'Database query failed',
        details: error.message
      }, { status: 200 })
    }

    console.log('Waitlist count:', count)
    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    console.error('Error in waitlist-count route:', error)
    return NextResponse.json({
      count: 0,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 })
  }
}
