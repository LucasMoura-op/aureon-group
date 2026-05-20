-- Run this in Supabase SQL Editor after `prisma migrate deploy`.
-- It mirrors app-level organization isolation at the database layer.

alter table "Organization" enable row level security;
alter table "OrganizationMember" enable row level security;
alter table "Project" enable row level security;
alter table "ProjectScenario" enable row level security;
alter table "ProjectRisk" enable row level security;
alter table "FinancialTransaction" enable row level security;
alter table "RegionResearch" enable row level security;
alter table "ExternalDataSource" enable row level security;
alter table "BusinessIdea" enable row level security;
alter table "DecisionReport" enable row level security;
alter table "FileAttachment" enable row level security;
alter table "AuditLog" enable row level security;
alter table "Task" enable row level security;
alter table "Alert" enable row level security;
alter table "AIAnalysis" enable row level security;
alter table "LoanProposal" enable row level security;
alter table "FinancialHealth" enable row level security;
alter table "WealthProjection" enable row level security;

create or replace function public.current_user_id()
returns text
language sql stable
as $$
  select id from "User" where "authId" = auth.uid()::text limit 1;
$$;

create or replace function public.is_org_member(org_id text)
returns boolean
language sql stable
as $$
  select exists (
    select 1 from "OrganizationMember"
    where "organizationId" = org_id
      and "userId" = public.current_user_id()
      and "acceptedAt" is not null
  );
$$;

create or replace function public.can_org_write(org_id text)
returns boolean
language sql stable
as $$
  select exists (
    select 1 from "OrganizationMember"
    where "organizationId" = org_id
      and "userId" = public.current_user_id()
      and role in ('OWNER', 'PARTNER', 'EDITOR')
      and "acceptedAt" is not null
  );
$$;

create policy "members can read organizations"
on "Organization" for select
using (public.is_org_member(id));

create policy "members can read own membership"
on "OrganizationMember" for select
using (public.is_org_member("organizationId"));

create policy "writers can insert projects"
on "Project" for insert
with check (public.can_org_write("organizationId"));

create policy "members can read projects"
on "Project" for select
using (public.is_org_member("organizationId"));

create policy "writers can update projects"
on "Project" for update
using (public.can_org_write("organizationId"))
with check (public.can_org_write("organizationId"));

-- Repeatable generic policies for tables carrying organizationId.
do $$
declare
  t text;
begin
  foreach t in array array[
    'FinancialTransaction','RegionResearch','ExternalDataSource','BusinessIdea',
    'DecisionReport','FileAttachment','AuditLog','Task','Alert','AIAnalysis',
    'LoanProposal','FinancialHealth','WealthProjection'
  ]
  loop
    execute format('create policy "%s read org" on "%s" for select using (public.is_org_member("organizationId"))', t, t);
    execute format('create policy "%s write org" on "%s" for all using (public.can_org_write("organizationId")) with check (public.can_org_write("organizationId"))', t, t);
  end loop;
end $$;
