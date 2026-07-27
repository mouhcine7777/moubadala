-- Allows deleting a contract that's still a draft (brouillon/en_preparation) —
-- i.e. before the other party has agreed to or signed anything. Contracts past
-- that point can never be deleted (only the immutable event log records them).
--
-- Needs a function rather than a plain DELETE because contract_events has a
-- trigger blocking ALL deletes (including cascades) to keep the signed-contract
-- audit trail tamper-proof. This function briefly disables that trigger, but
-- ONLY after confirming the contract is still a draft — a signed/executing
-- contract's events can never be touched this way.
--
-- SECURITY DEFINER: runs with this function's owner's privileges (the role that
-- runs this migration, typically a superuser), so it can disable/re-enable the
-- trigger even though the app only ever connects with the low-privilege anon key.

create or replace function delete_draft_contract(p_contract_id uuid, p_clerk_user_id text)
returns void as $$
declare
  v_status  text;
  v_party_a text;
  v_party_b text;
begin
  select status, party_a_clerk_id, party_b_clerk_id
    into v_status, v_party_a, v_party_b
  from contracts where id = p_contract_id;

  if v_status is null then
    raise exception 'Contrat introuvable.';
  end if;

  if p_clerk_user_id is distinct from v_party_a and p_clerk_user_id is distinct from v_party_b then
    raise exception 'Vous n''êtes pas partie à ce contrat.';
  end if;

  if v_status not in ('brouillon', 'en_preparation') then
    raise exception 'Seuls les contrats en brouillon ou en préparation peuvent être supprimés.';
  end if;

  alter table contract_events disable trigger contract_events_no_delete;
  delete from contracts where id = p_contract_id;
  alter table contract_events enable trigger contract_events_no_delete;
end;
$$ language plpgsql security definer;

grant execute on function delete_draft_contract(uuid, text) to anon, authenticated;
