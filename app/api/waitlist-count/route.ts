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

    // First, let's try to get all records to see what's actually in the database
    const { data: allRecords, error: fetchError } = await supabaseAdmin
      .from('waitlist')
      .select('id, email, created_at')

    if (fetchError) {
      console.error('Error fetching waitlist records:', fetchError)
      return NextResponse.json({
        count: 0,
        error: 'Database query failed',
        details: fetchError.message
      }, { status: 200 })
    }

    console.log('All records in database:', allRecords)
    console.log('Number of records:', allRecords?.length || 0)

    // Now get the count
    const { count, error } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error fetching waitlist count:', error)
      return NextResponse.json({
        count: 0,
        error: 'Database count query failed',
        details: error.message,
        allRecords: allRecords
      }, { status: 200 })
    }

    console.log('Count query result:', count)
    return NextResponse.json({
      count: count || 0,
      debug: {
        countFromQuery: count,
        actualRecords: allRecords?.length || 0,
        records: allRecords?.map(r => ({ id: r.id, email: r.email, created_at: r.created_at }))
      }
    })
  } catch (error) {
    console.error('Error in waitlist-count route:', error)
    return NextResponse.json({
      count: 0,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 })
  }
}
