create table public.classes (
  id uuid primary key default gen_random_uuid(),
  class_title text not null,
  description text not null,
  prerequisite text,
  level text check (level in ('beginner', 'intermediate', 'advanced', 'none')) not null,
  series text[] not null,
  format text not null,
  created_at timestamp with time zone default now()
);

CREATE EXTENSION IF NOT EXISTS citext;

-- Case-insensitive
alter table public.classes
alter column level type citext,
alter column format type citext,
alter column series type citext[];

-- Indexing
create index idx_classes_series on public.classes using gin (series);
create index idx_classes_level on public.classes (level);
create index idx_classes_title_lower on classes (lower(class_title));

-- RLS policies
create policy "Enable read access for all users"
on "public"."classes"
for select using (true);
