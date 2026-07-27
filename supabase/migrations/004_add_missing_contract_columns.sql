-- Patch: your `contracts` table was created from an earlier draft schema.
-- This adds every column the actual application code (lib/actions/contracts.ts,
-- lib/types.ts, the wizard steps) expects but that isn't in your table yet.
-- Non-destructive — nothing existing is dropped or renamed.

alter table contracts
  add column if not exists party_b_pending_name text,
  add column if not exists signatory_a_nom      text,
  add column if not exists signatory_a_prenom   text,
  add column if not exists signatory_a_email    text,
  add column if not exists signatory_a_phone    text,
  add column if not exists signatory_b_nom      text,
  add column if not exists signatory_b_prenom   text,
  add column if not exists signatory_b_email    text,
  add column if not exists signatory_b_phone    text,
  add column if not exists closure_requested_by text references profiles(clerk_user_id),
  add column if not exists closure_requested_at timestamptz,
  add column if not exists closed_at            timestamptz;

-- Optional cleanup — only run this if you're fine losing the old columns
-- (safe on a fresh test project with no real signed contracts yet):
-- alter table contracts drop column if exists signatory_a_name;
-- alter table contracts drop column if exists signatory_b_name;

-- Verify — should now show every column the app expects.
select column_name from information_schema.columns where table_name = 'contracts' order by ordinal_position;
