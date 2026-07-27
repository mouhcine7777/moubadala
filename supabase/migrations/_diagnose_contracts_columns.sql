-- Diagnostic only — lists every column Postgres actually has on the
-- `contracts` table right now. Paste the full result back.
select column_name, data_type, is_nullable
from information_schema.columns
where table_name = 'contracts'
order by ordinal_position;
