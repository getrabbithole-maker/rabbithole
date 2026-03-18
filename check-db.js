const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
  
  console.log('Total records:', data?.length || 0)
  console.log('Records:', data?.map(r => ({ id: r.id, email: r.email })))
}

check().catch(console.error)
