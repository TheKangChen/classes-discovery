# Hybrid Class Discovery Interface

A "Discovery Page" demo built for NYPL TechConnect. This project showcases a **Hybrid Search** architecture (Semantic + Lexical) paired with a modern, URL-driven Next.js frontend.

**Live Demo:** [classes-discovery.vercel.app](https://classes-discovery.vercel.app/)

## Frontend Implementation

- **URL-Driven State**: Syncs search query and filters with the URL using `searchParams` for deep-linking and browser history support.
- **Server-Side Orchestration**: Leveraged Server Components to execute vector and database queries, minimizing client-side JS.
- **Recommendation Engine**: Built a content-based recommendation system using vector similarity to suggest related classes.
- **Responsive Layout**: Created a responsive grid-based filter menu and horizontal card system using different CSS media queries.
- **Accessible Hit Targets**: Used the "absolute-overlay" pattern to make entire cards clickable.

## Search Architecture (Hybrid Search)

1. **Semantic Search (Pinecone)**:

  - Converts the search query into a 384-dimensional vector using the `BAAI/bge-small-en-v1.5` model.
  - Retrieves the top 50 matches based on **semantic meaning** rather than just keyword matching.

2. **Lexical Filtering (Supabase/PostgreSQL)**:

  - Filters the semantic results against strict metadata (Level, Format, Series).
  - Uses **PostgreSQL `CITEXT**` to ensure case-insensitive matching across all filters.

## Database Schema & Optimization

The database is optimized for discovery through a few PostgreSQL configurations:

```sql
-- Enable the Case-Insensitive Text extension
CREATE EXTENSION IF NOT EXISTS citext;

-- Update columns to be case-insensitive
ALTER TABLE classes
ALTER COLUMN level TYPE citext,
ALTER COLUMN format TYPE citext,
ALTER COLUMN series TYPE citext[];

-- Indexing for search performance
CREATE INDEX idx_classes_title_lower ON classes (lower(class_title));
CREATE INDEX idx_classes_series ON classes using gin (series);
CREATE INDEX idx_classes_level ON classes (level);
```

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Vector DB**: Pinecone
- **Relational DB**: Supabase (PostgreSQL)
- **AI/LLM**: Hugging Face Inference API (Embeddings)
