-- Diagnostic only — run this and tell me what comes back.
select relname as table_name, relrowsecurity as rls_enabled, relforcerowsecurity as rls_forced
from pg_class
where relname = 'contract_number_counters';

select policyname, cmd, roles
from pg_policies
where tablename = 'contract_number_counters';
