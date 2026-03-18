/**
 * Test waitlist count locally
 * Run: npx tsx test-waitlist-count.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ejvxwmwbwrovhznaedoz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqdnh3bXdid3Jvdmh6bmFlZG96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzYxNjUwNywiZXhwIjoyMDg5MTkyNTA3fQ.rsuWHejwIN7wgVpp5DqN8AWY1ymQiHa527jfdbIu_lk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testWaitlistCount() {
  console.log('Testing waitlist count...\n')

  // Method 1: Count query
  console.log('Method 1: COUNT query')
  const { count, error: countError } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('  Error:', countError)
  } else {
    console.log(`  Count: ${count}`)
  }

  // Method 2: Fetch all and count
  console.log('\nMethod 2: Fetch all records')
  const { data: allRecords, error: fetchError } = await supabase
    .from('waitlist')
    .select('id, email, created_at')

  if (fetchError) {
    console.error('  Error:', fetchError)
  } else {
    console.log(`  Total records: ${allRecords?.length || 0}`)
    console.log('\n  All waitlist entries:')
    allRecords?.forEach((record, i) => {
      console.log(`    ${i + 1}. ${record.email} - ${record.created_at}`)
    })
  }
}

testWaitlistCount()
