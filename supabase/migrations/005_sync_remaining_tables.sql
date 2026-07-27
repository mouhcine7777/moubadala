-- Patch: syncs the remaining tables (contract_services, contract_reserves,
-- contract_documents) to match the final application code, in case they were
-- also created from the earlier draft schema. All additive/non-destructive —
-- safe to run even if some of these already match.

alter table contract_services
  add column if not exists declared_done_at timestamptz,
  add column if not exists declared_done_by text references profiles(clerk_user_id),
  add column if not exists declared_comment text,
  add column if not exists validated_at     timestamptz,
  add column if not exists validated_by     text references profiles(clerk_user_id);

alter table contract_reserves
  add column if not exists resolved_by text references profiles(clerk_user_id);

-- Widen the document category check to include 'notice' (used by Step7Documents.tsx
-- but missing from the earlier draft's constraint).
alter table contract_documents drop constraint if exists contract_documents_category_check;
alter table contract_documents add constraint contract_documents_category_check check (category in
  ('devis','cahier_charges','plan','photo','video','catalogue','certificat','notice','autre'));

-- Verify — run these and compare against the column names contracts.ts,
-- contract-services.ts, contract-execution.ts, and contract-documents.ts expect.
select 'contract_services' as t, column_name from information_schema.columns where table_name = 'contract_services'
union all
select 'contract_reserves', column_name from information_schema.columns where table_name = 'contract_reserves'
order by t, column_name;
