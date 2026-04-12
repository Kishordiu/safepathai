-- SafePath AI base schema
-- Run this in Supabase SQL editor after creating your project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  mobile_number text,
  role text not null default 'parent',
  school_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age int,
  grade text,
  school_name text not null,
  parent_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'safe',
  home_lat double precision,
  home_lng double precision,
  school_lat double precision,
  school_lng double precision,
  routine_schedule text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null unique references public.children(id) on delete cascade,
  device_code text unique not null,
  device_type text default 'pendant',
  battery_level int default 100,
  signal_strength text,
  firmware_version text,
  last_seen timestamptz,
  status text default 'offline',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  severity text not null,
  title text not null,
  message text not null,
  reason text,
  confidence int,
  acknowledged boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.pickup_records (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  picked_up_by text,
  verifier_name text,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now()
);
