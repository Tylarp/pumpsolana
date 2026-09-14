/*
# Create watchlist and alerts tables (single-tenant, no auth)

## Overview
This migration creates two tables for the Solana memecoin intelligence dashboard:
- `watchlist`: stores tokens the user is tracking
- `alerts`: stores user-configured alert rules and triggered alert events

Both tables are single-tenant (no sign-in required). The anon-key frontend can
read and write freely because the data is intentionally shared/public.

## New Tables

### watchlist
- `id` (uuid, primary key)
- `token_address` (text, not null) — Solana token mint address
- `token_symbol` (text, not null) — token ticker for display
- `token_name` (text, not null) — token name for display
- `added_at` (timestamptz, default now())

### alerts
- `id` (uuid, primary key)
- `token_address` (text, not null) — token this alert watches
- `token_symbol` (text, not null) — token ticker for display
- `token_name` (text, not null) — token name for display
- `alert_type` (text, not null) — one of: volume, holders, liquidity, social
- `threshold` (text, not null) — human-readable threshold description
- `triggered` (boolean, default false) — whether this alert has fired
- `message` (text) — optional message shown when triggered
- `created_at` (timestamptz, default now())
- `triggered_at` (timestamptz) — when the alert fired

## Security
- RLS enabled on both tables.
- Full CRUD allowed for anon + authenticated (single-tenant, intentionally public).
*/

CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_address text NOT NULL,
  token_symbol text NOT NULL,
  token_name text NOT NULL,
  added_at timestamptz DEFAULT now()
);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_watchlist" ON watchlist;
CREATE POLICY "anon_select_watchlist" ON watchlist FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_watchlist" ON watchlist;
CREATE POLICY "anon_insert_watchlist" ON watchlist FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_watchlist" ON watchlist;
CREATE POLICY "anon_update_watchlist" ON watchlist FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_watchlist" ON watchlist;
CREATE POLICY "anon_delete_watchlist" ON watchlist FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_address text NOT NULL,
  token_symbol text NOT NULL,
  token_name text NOT NULL,
  alert_type text NOT NULL,
  threshold text NOT NULL,
  triggered boolean NOT NULL DEFAULT false,
  message text,
  created_at timestamptz DEFAULT now(),
  triggered_at timestamptz
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_alerts" ON alerts;
CREATE POLICY "anon_select_alerts" ON alerts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_alerts" ON alerts;
CREATE POLICY "anon_insert_alerts" ON alerts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_alerts" ON alerts;
CREATE POLICY "anon_update_alerts" ON alerts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_alerts" ON alerts;
CREATE POLICY "anon_delete_alerts" ON alerts FOR DELETE
  TO anon, authenticated USING (true);
