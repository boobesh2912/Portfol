-- Dodo Payments billing columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dodo_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
