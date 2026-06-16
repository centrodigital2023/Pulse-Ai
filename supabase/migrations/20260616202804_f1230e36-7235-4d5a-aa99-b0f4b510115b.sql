
delete from public.organizations a using public.organizations b
where a.owner_id = b.owner_id and a.ctid < b.ctid;

alter table public.organizations
  add constraint organizations_owner_id_key unique (owner_id);
