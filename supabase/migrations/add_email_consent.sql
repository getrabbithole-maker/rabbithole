-- Add email consent columns for Resend compliance
-- Run this in Supabase SQL Editor

ALTER TABLE waitlist
ADD COLUMN IF NOT EXISTS email_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMPTZ;

-- Add comment for documentation
COMMENT ON COLUMN waitlist.email_consent IS 'User explicitly agreed to receive marketing emails (Resend compliance)';
COMMENT ON COLUMN waitlist.consent_timestamp IS 'Timestamp when user agreed to email consent';
