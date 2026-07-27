-- ============================================================================
-- Moubadala — Assistant Intelligent de Contractualisation (AIC)
-- Phase 1 (French) schema migration
--
-- HOW TO APPLY: paste this whole file into the Supabase dashboard's
-- SQL Editor (your project -> SQL Editor -> New query) and run it once.
-- There is no migration runner in this repo yet, so this file is applied
-- by hand and kept here purely as a record of what was run and when.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. profiles: new legal-identity columns
-- Nullable — only enforced (required) at contract-creation time, same way
-- `status` already gates listing publication without being NOT NULL.
-- ----------------------------------------------------------------------------
alter table profiles
  add column if not exists if_number      text,       -- Identifiant Fiscal (distinct from patente/rc/cnss/ice)
  add column if not exists legal_form     text,       -- SARL, SA, SARL-AU, etc.
  add column if not exists capital_social numeric,
  add column if not exists rep_prenom     text,       -- contract signatory first name
  add column if not exists rep_nom        text,       -- contract signatory last name
  add column if not exists rep_fonction   text,       -- e.g. "Gérant", "Directeur Général"
  add column if not exists rep_email      text,
  add column if not exists rep_phone      text;


-- ----------------------------------------------------------------------------
-- 2. Atomic contract numbering (MBD-2026-000154 style)
-- ----------------------------------------------------------------------------
create table if not exists contract_number_counters (
  year    int primary key,
  counter int not null default 0
);

create or replace function generate_contract_number() returns text as $$
declare
  yr  int := extract(year from now());
  seq int;
begin
  insert into contract_number_counters(year, counter) values (yr, 1)
    on conflict (year) do update set counter = contract_number_counters.counter + 1
    returning counter into seq;
  return 'MBD-' || yr || '-' || lpad(seq::text, 6, '0');
end;
$$ language plpgsql;


-- ----------------------------------------------------------------------------
-- 3. contracts — the "Fiche Contractuelle d'Échange"
-- ----------------------------------------------------------------------------
create table if not exists contracts (
  id                      uuid primary key default gen_random_uuid(),
  contract_number         text unique not null default generate_contract_number(),
  request_id              uuid references requests(id),
  party_a_clerk_id        text not null references profiles(clerk_user_id),
  party_b_clerk_id        text references profiles(clerk_user_id),
  party_b_pending_email   text,
  party_b_pending_name    text,
  party_b_invite_token    text unique,
  party_b_invited_at      timestamptz,
  created_by_clerk_id     text not null references profiles(clerk_user_id),
  status                  text not null default 'brouillon'
                            check (status in ('brouillon','en_preparation','en_attente_validation',
                              'en_attente_signature','signe','en_execution','cloture','resilie','archive')),

  -- Étape 2 — Nature et objet de l'échange
  exchange_type           text check (exchange_type in ('produit_produit','service_service','produit_service','plusieurs','autre')),
  title                   text,
  objectif                text[],
  description             text,
  execution_mode          text check (execution_mode in ('une_fois','plusieurs_livraisons','plusieurs_interventions','continue','calendrier')),
  lieu_execution          text check (lieu_execution in ('chez_a','chez_b','chez_client','a_distance','plusieurs')),
  confidentialite         text not null default 'standard' check (confidentialite in ('standard','renforcee')),
  category_derived        text,
  complexity_indicator    text check (complexity_indicator in ('faible','moyenne','elevee')),

  -- Étape 5 — Équilibre économique et compensation
  compensation_prevue     boolean not null default false,
  compensation_montant    numeric,
  compensation_devise     text default 'MAD',
  compensation_mode       text,
  compensation_echeance   date,

  -- Étape 6 — Calendrier
  calendar_start_date     date,
  calendar_end_date       date,
  calendar_mode           text check (calendar_mode in ('unique','multi_jalons')),

  -- Étape 1 — signataires désignés (avant signature effective)
  signatory_a_nom         text,
  signatory_a_prenom      text,
  signatory_a_fonction    text,
  signatory_a_email       text,
  signatory_a_phone       text,
  signatory_b_nom         text,
  signatory_b_prenom      text,
  signatory_b_fonction    text,
  signatory_b_email       text,
  signatory_b_phone       text,

  -- Étape 8 — signature électronique (rempli au clic "Valider et signer")
  signed_at_a             timestamptz,
  signature_ip_a          text,
  signed_at_b             timestamptz,
  signature_ip_b          text,

  pdf_url                 text,
  closure_pv_url          text,
  closure_requested_by    text references profiles(clerk_user_id),
  closure_requested_at    timestamptz,
  closed_at               timestamptz,

  language                text not null default 'fr',

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create index if not exists idx_contracts_party_a on contracts(party_a_clerk_id);
create index if not exists idx_contracts_party_b on contracts(party_b_clerk_id);
create index if not exists idx_contracts_status  on contracts(status);


-- ----------------------------------------------------------------------------
-- 4. contract_services — Chapitre III (Étapes 3 & 4, prestations A/B)
-- ----------------------------------------------------------------------------
create table if not exists contract_services (
  id                       uuid primary key default gen_random_uuid(),
  contract_id              uuid not null references contracts(id) on delete cascade,
  party                    text not null check (party in ('a','b')),
  label                    text not null,          -- e.g. "PREST-A-001"
  nature                   text check (nature in ('produit','service','produit_service')),
  description              text not null,
  quantite                 numeric,
  unite                    text,
  valeur_ht                numeric not null,
  tva_percent              numeric not null default 20,
  delai_debut              date,
  delai_fin                date,
  lieu_execution           text,
  conditions_particulieres text,
  garantie                 boolean not null default false,
  garantie_nature          text,
  garantie_duree           text,
  garantie_conditions      text,
  exec_status              text not null default 'a_realiser'
                             check (exec_status in ('a_realiser','en_cours','realisee','validee','contestee')),
  declared_done_at         timestamptz,
  declared_done_by         text references profiles(clerk_user_id),
  declared_comment         text,
  validated_at             timestamptz,
  validated_by             text references profiles(clerk_user_id),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
create index if not exists idx_contract_services_contract on contract_services(contract_id);


-- ----------------------------------------------------------------------------
-- 5. contract_milestones — Étape 6, jalons de calendrier
-- ----------------------------------------------------------------------------
create table if not exists contract_milestones (
  id           uuid primary key default gen_random_uuid(),
  contract_id  uuid not null references contracts(id) on delete cascade,
  label        text not null,
  due_date     date not null,
  status       text not null default 'a_venir' check (status in ('a_venir','en_cours','realise','en_retard')),
  created_at   timestamptz not null default now()
);
create index if not exists idx_contract_milestones_contract on contract_milestones(contract_id);


-- ----------------------------------------------------------------------------
-- 6. contract_reserves — Chapitre 8.6, réserves sur exécution
-- (created before contract_documents so the latter can FK to it)
-- ----------------------------------------------------------------------------
create table if not exists contract_reserves (
  id                  uuid primary key default gen_random_uuid(),
  contract_id         uuid not null references contracts(id) on delete cascade,
  contract_service_id uuid not null references contract_services(id) on delete cascade,
  raised_by_clerk_id  text not null references profiles(clerk_user_id),
  subject             text not null,
  description         text not null,
  status              text not null default 'ouverte' check (status in ('ouverte','resolue')),
  resolved_at         timestamptz,
  resolved_by         text references profiles(clerk_user_id),
  resolution_comment  text,
  created_at          timestamptz not null default now()
);
create index if not exists idx_contract_reserves_contract on contract_reserves(contract_id);
create index if not exists idx_contract_reserves_service on contract_reserves(contract_service_id);


-- ----------------------------------------------------------------------------
-- 7. contract_documents — Étape 7 / Chapitre VI, annexes contractuelles
-- ----------------------------------------------------------------------------
create table if not exists contract_documents (
  id                   uuid primary key default gen_random_uuid(),
  contract_id          uuid not null references contracts(id) on delete cascade,
  service_id           uuid references contract_services(id) on delete set null,
  reserve_id           uuid references contract_reserves(id) on delete set null,
  category             text not null check (category in
                         ('devis','cahier_charges','plan','photo','video','catalogue','certificat','notice','autre')),
  title                text not null,
  file_url             text not null,
  file_name            text,
  file_size            int,
  version              int not null default 1,
  comment              text,
  uploaded_by_clerk_id text not null references profiles(clerk_user_id),
  created_at           timestamptz not null default now()
);
create index if not exists idx_contract_documents_contract on contract_documents(contract_id);


-- ----------------------------------------------------------------------------
-- 8. contract_events — Journal du Contrat (immutable audit log)
-- Application code must NEVER update or delete rows here — enforced below
-- with triggers, belt-and-suspenders since this project has no RLS.
-- ----------------------------------------------------------------------------
create table if not exists contract_events (
  id              uuid primary key default gen_random_uuid(),
  contract_id     uuid not null references contracts(id) on delete cascade,
  event_type      text not null,
  actor_clerk_id  text references profiles(clerk_user_id),
  metadata        jsonb,
  created_at      timestamptz not null default now()
);
create index if not exists idx_contract_events_contract on contract_events(contract_id, created_at);

create or replace function reject_contract_events_mutation() returns trigger as $$
begin
  raise exception 'contract_events is append-only — updates and deletes are not permitted';
end;
$$ language plpgsql;

drop trigger if exists contract_events_no_update on contract_events;
create trigger contract_events_no_update before update on contract_events
  for each row execute function reject_contract_events_mutation();

drop trigger if exists contract_events_no_delete on contract_events;
create trigger contract_events_no_delete before delete on contract_events
  for each row execute function reject_contract_events_mutation();


-- ----------------------------------------------------------------------------
-- 9. contract_messages / contract_message_reads — messagerie contractuelle
-- Mirrors the shape of messages/message_reads but scoped to contract_id
-- instead of request_id (pre-deal negotiation vs. post-deal auditable
-- contractual communication are different things — see plan notes).
-- ----------------------------------------------------------------------------
create table if not exists contract_messages (
  id               uuid primary key default gen_random_uuid(),
  contract_id      uuid not null references contracts(id) on delete cascade,
  sender_clerk_id  text not null references profiles(clerk_user_id),
  content          text not null,
  attachment_url   text,
  attachment_name  text,
  attachment_size  int,
  created_at       timestamptz not null default now()
);
create index if not exists idx_contract_messages_contract on contract_messages(contract_id, created_at);

create table if not exists contract_message_reads (
  contract_id    uuid not null references contracts(id) on delete cascade,
  clerk_user_id  text not null references profiles(clerk_user_id),
  last_read_at   timestamptz not null,
  primary key (contract_id, clerk_user_id)
);


-- ----------------------------------------------------------------------------
-- 10. notifications — élargit la contrainte de type pour les notifications AIC
-- IMPORTANT: adjust the constraint name below first if your existing
-- `notifications.type` check constraint has a different name than the
-- Postgres default (`notifications_type_check`) — check with:
--   select conname from pg_constraint where conrelid = 'notifications'::regclass;
-- If no such constraint exists at all (type is unconstrained), this whole
-- block is a harmless no-op safety net.
-- ----------------------------------------------------------------------------
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check check (type in (
  'new_request', 'message', 'listing_expiring', 'new_matching', 'platform',
  'contract_invited', 'contract_ready_to_sign', 'contract_signed_partial', 'contract_signed_complete',
  'contract_service_declared', 'contract_reserve_raised', 'contract_reserve_resolved',
  'contract_deadline_reminder', 'contract_closed'
));


-- ============================================================================
-- RLS: intentionally NOT enabled here, matching every existing table in this
-- project (transactions, requests, listings, documents, notifications, ...).
-- Authorization is done in application code via .eq(clerk_user_id, ...) /
-- .or(...) filters, not via Postgres row security. This is a known risk for
-- legal/signature/financial data and is flagged as a recommended fast-follow
-- once this feature is proven out (would need a service-role/SSR Supabase
-- client, which doesn't exist in this codebase yet).
-- ============================================================================


-- ============================================================================
-- MANUAL STEP (cannot be done via SQL): create a new Storage bucket named
-- "contract-documents" in Supabase Dashboard -> Storage -> New bucket.
-- Make it Public (same convention as the existing "listings-images" bucket)
-- so generated PDFs and uploaded annexes are reachable via public URL.
-- ============================================================================
