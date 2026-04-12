-- Parent-only protected access code per child
create table if not exists public.guardian_access_codes (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null unique references public.children(id) on delete cascade,
  access_code text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_guardian_access_codes_updated_at
before update on public.guardian_access_codes
for each row
execute function public.set_updated_at();

alter table public.guardian_access_codes enable row level security;

drop policy if exists "Authorized users can manage guardian access codes" on public.guardian_access_codes;
create policy "Authorized users can manage guardian access codes"
on public.guardian_access_codes
for all
using (public.can_access_child(child_id))
with check (public.can_access_child(child_id));

-- Device commands for future two-way sync (web -> backend -> device)
create table if not exists public.device_commands (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  command_type text not null,
  payload jsonb not null default '{}'::jsonb,
  is_consumed boolean not null default false,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_device_commands_child_id on public.device_commands(child_id);
create index if not exists idx_device_commands_consumed on public.device_commands(is_consumed);

alter table public.device_commands enable row level security;

drop policy if exists "Authorized users can manage device commands" on public.device_commands;
create policy "Authorized users can manage device commands"
on public.device_commands
for all
using (public.can_access_child(child_id) or public.is_super_admin())
with check (public.can_access_child(child_id) or public.is_super_admin());

-- Demo code for your existing child
insert into public.guardian_access_codes (child_id, access_code)
select c.id, '2580'
from public.children c
where c.id = '9be9019a-257e-4549-b1f0-eb06d2811036'
on conflict (child_id) do update set access_code = excluded.access_code, updated_at = now();
