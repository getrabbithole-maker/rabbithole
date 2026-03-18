import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable Next.js caching

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    // Use RPC - forces fresh SQL query execution
    const { data: count, error } = await supabaseAdmin.rpc('get_waitlist_count')

    if (error) {
      console.error('RPC error:', error)
      // Fallback to direct query
      const { data: fallbackData } = await supabaseAdmin
        .from('waitlist')
        .select('id')
      return NextResponse.json({
        count: fallbackData?.length ?? 0
      })
    }

    return NextResponse.json({
      count: count || 0
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    })
  } catch (error) {
    return NextResponse.json({
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
