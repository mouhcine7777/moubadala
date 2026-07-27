-- ============================================================================
-- Fix: your Supabase project apparently enables Row Level Security by default
-- on newly created tables. With RLS on and zero policies defined, Postgres
-- denies ALL access (even inserts from the atomic counter function), which is
-- exactly the "new row violates row-level security policy" error you hit.
--
-- This project's existing tables (transactions, requests, profiles, etc.) have
-- no RLS at all — authorization is done in application code via .eq(clerk_user_id, ...)
-- filters instead. To keep the new contracts feature consistent with that
-- (see the plan's explicit note on this), disable RLS on every new table.
--
-- Paste this into the Supabase SQL Editor and run it once.
-- ============================================================================

alter table contract_number_counters disable row level security;
alter table contracts                disable row level security;
alter table contract_services        disable row level security;
alter table contract_milestones      disable row level security;
alter table contract_reserves        disable row level security;
alter table contract_documents       disable row level security;
alter table contract_events          disable row level security;
alter table contract_messages        disable row level security;
alter table contract_message_reads   disable row level security;
