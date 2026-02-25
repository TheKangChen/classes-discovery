create table public.classes (
  id uuid primary key default gen_random_uuid(),
  class_title text not null,
  description text not null,
  prerequisite text,
  level text check (level in ('Beginner', 'Intermediate', 'Advanced', 'None')) not null,
  series text[] not null,
  format text not null,
  created_at timestamp with time zone default now()
);

-- Indexing
create index idx_classes_series on public.classes using gin (series);
create index idx_classes_level on public.classes (level);

-- RLS policies
create policy "Enable read access for all users"
on "public"."classes"
for select using (true);
