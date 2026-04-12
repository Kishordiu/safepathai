create table if not exists public.voice_levels (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  avg_level integer not null default 0,
  peak_level integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_voice_levels_child_created
on public.voice_levels(child_id, created_at desc);