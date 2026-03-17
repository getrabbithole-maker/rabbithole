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

    // Fetch ALL records (not just count) to get accurate number
    // SQL: SELECT id FROM waitlist
    const { data: allRecords, error } = await supabaseAdmin
      .from('waitlist')
      .select('id')

    if (error) {
      console.error('Error fetching waitlist records:', error)
      return NextResponse.json({
        count: 0,
        error: 'Database query failed',
        details: error.message
      }, { status: 200 })
    }

    const actualCount = allRecords?.length || 0
    console.log('SQL: SELECT id FROM waitlist')
    console.log('Records found:', actualCount)
    console.log('All records:', allRecords)

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
