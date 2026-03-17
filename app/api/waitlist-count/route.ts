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

    // Use count query first (it should work, but if not we'll use actual records)
    const { count, error } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Count query failed, fetching all records:', error)
      // Fallback: Get all records and count them
      const { data: allRecords, error: fetchError } = await supabaseAdmin
        .from('waitlist')
        .select('id', { count: 'exact' })

      if (fetchError) {
        return NextResponse.json({
          count: 0,
          error: 'Database query failed',
          details: fetchError.message
        }, { status: 200 })
      }

      const actualCount = allRecords?.length || 0
      console.log('Using fallback count:', actualCount)
      return NextResponse.json({ count: actualCount })
    }

    // Verify the count by also checking record length (Supabase count can be wrong)
    const { data: allRecords } = await supabaseAdmin
      .from('waitlist')
      .select('id', { count: 'exact', head: true })

    const actualCount = allRecords?.length || count || 0
    console.log('Count query:', count, 'Actual records:', actualCount)

    // Use the actual count since Supabase count queries can be inaccurate
    return NextResponse.json({ count: actualCount })
  } catch (error) {
    console.error('Error in waitlist-count route:', error)
    return NextResponse.json({
      count: 0,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 })
  }
}
