-- Forces Supabase's PostgREST layer to reload its cached view of the schema.
-- Needed after adding columns/tables via the SQL editor — the API doesn't
-- always pick up DDL changes immediately on its own.
notify pgrst, 'reload schema';
