-- Storage's `storage.objects` table always has RLS enforced by Supabase itself
-- (you can't disable it) — so unlike our own tables, this genuinely needs a
-- policy rather than a disable. This grants the same open access (matching
-- the rest of the app's "no fine-grained access control, anon key does
-- everything" approach) scoped to just the contract-documents bucket.
--
-- Uses drop-then-create so it's safe to re-run (Postgres' CREATE POLICY does
-- not support IF NOT EXISTS).

drop policy if exists "contract-documents read" on storage.objects;
create policy "contract-documents read"
  on storage.objects for select
  to public
  using (bucket_id = 'contract-documents');

drop policy if exists "contract-documents insert" on storage.objects;
create policy "contract-documents insert"
  on storage.objects for insert
  to public
  with check (bucket_id = 'contract-documents');

drop policy if exists "contract-documents update" on storage.objects;
create policy "contract-documents update"
  on storage.objects for update
  to public
  using (bucket_id = 'contract-documents');

drop policy if exists "contract-documents delete" on storage.objects;
create policy "contract-documents delete"
  on storage.objects for delete
  to public
  using (bucket_id = 'contract-documents');
