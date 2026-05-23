-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- audits: the complete record of every audit run
-- The input and result columns store JSONB — typed in application code via TypeScript
CREATE TABLE IF NOT EXISTS audits (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  TEXT NOT NULL UNIQUE,
  input                 JSONB NOT NULL,
  result                JSONB NOT NULL,
  ai_summary            TEXT,                    -- nullable: populated async after creation
  monthly_savings_usd   INTEGER NOT NULL,        -- denormalized cents for fast queries
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on slug: every public page load hits this index
CREATE INDEX IF NOT EXISTS idx_audits_slug ON audits(slug);

-- Index on savings: useful for Credex internal dashboards and lead prioritization
CREATE INDEX IF NOT EXISTS idx_audits_savings ON audits(monthly_savings_usd DESC);

-- leads: email captures — completely separate from public audit data
-- Row Level Security ensures this table is only accessible via service role key
CREATE TABLE IF NOT EXISTS leads (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id              UUID REFERENCES audits(id) ON DELETE SET NULL,
  email                 TEXT NOT NULL,
  company_name          TEXT,
  role                  TEXT,
  team_size             INTEGER,
  monthly_savings_usd   INTEGER,                 -- denormalized for sales team prioritization
  high_value            BOOLEAN NOT NULL DEFAULT false,
  email_sent            BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_high_value
  ON leads(high_value, monthly_savings_usd DESC)
  WHERE high_value = true;

-- events: conversion funnel analytics
CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id    UUID REFERENCES audits(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL
                CHECK (event_type IN (
                  'form_started',
                  'audit_completed',
                  'email_captured',
                  'cta_clicked',
                  'link_shared'
                )),
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_type_created
  ON events(event_type, created_at DESC);

-- Row Level Security
-- Audits are publicly readable (anyone with the slug can view)
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audits_public_read" ON audits
  FOR SELECT USING (true);
CREATE POLICY "audits_service_insert" ON audits
  FOR INSERT WITH CHECK (true);
CREATE POLICY "audits_service_update" ON audits
  FOR UPDATE USING (true);

-- Leads are private — service role only
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_service_only" ON leads
  USING (false);  -- anon key gets nothing; service role bypasses RLS

-- Events are service-role write, no public read
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_service_only" ON events
  USING (false);
