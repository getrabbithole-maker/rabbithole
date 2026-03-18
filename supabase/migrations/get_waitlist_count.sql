-- Create a function to get waitlist count using SELECT COUNT(*)
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION get_waitlist_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*) FROM waitlist
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_waitlist_count() TO service_role;
