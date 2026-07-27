-- Comprehensive fix — disables RLS (and removes any FORCE flag) on every new
-- table from the contracts feature, in one pass. Run this whole file once.
alter table contract_number_counters disable row level security;
alter table contract_number_counters no force row level security;

alter table contracts disable row level security;
alter table contracts no force row level security;

alter table contract_services disable row level security;
alter table contract_services no force row level security;

alter table contract_milestones disable row level security;
alter table contract_milestones no force row level security;

alter table contract_reserves disable row level security;
alter table contract_reserves no force row level security;

alter table contract_documents disable row level security;
alter table contract_documents no force row level security;

alter table contract_events disable row level security;
alter table contract_events no force row level security;

alter table contract_messages disable row level security;
alter table contract_messages no force row level security;

alter table contract_message_reads disable row level security;
alter table contract_message_reads no force row level security;

-- Verify — every row below should show rls_enabled = false.
select relname as table_name, relrowsecurity as rls_enabled, relforcerowsecurity as rls_forced
from pg_class
where relname in (
  'contract_number_counters', 'contracts', 'contract_services', 'contract_milestones',
  'contract_reserves', 'contract_documents', 'contract_events', 'contract_messages', 'contract_message_reads'
)
order by relname;
