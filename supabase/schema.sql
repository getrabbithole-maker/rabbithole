-- Create waitlist table
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'monthly' CHECK (plan IN ('monthly', 'yearly')),
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'th')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX waitlist_email_idx ON waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX waitlist_created_at_idx ON waitlist(created_at DESC);

-- Optional: Enable Realtime for live updates (if you want to use Supabase Realtime instead of polling)
-- ALTER PUBLICATION supabase_realtime ADD TABLE waitlist;

-- Enable Row Level Security (optional, if you want to add RLS policies later)
-- ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts (for the server action)
-- CREATE POLICY "Allow insert" ON waitlist FOR INSERT WITH CHECK (true);

-- Policy to allow reads (for the count endpoint)
-- CREATE POLICY "Allow read" ON waitlist FOR SELECT USING (true);
