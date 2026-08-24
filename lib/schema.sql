-- Run once against the Postgres database (e.g. `psql "$DATABASE_URL" -f lib/schema.sql`
-- or pasted into the Neon SQL editor) before using the admin panel.

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE clients (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT,
  email      TEXT,
  address    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE diagnostics (
  id                SERIAL PRIMARY KEY,
  client_id         INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Equipo y falla
  equipment_type    TEXT,
  brand_model       TEXT,
  reported_fault    TEXT,

  -- Diagnostico y solucion
  diagnosis_notes   TEXT,
  root_cause        TEXT,
  solution_applied  TEXT,
  status            TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending', 'in_progress', 'done')),

  -- Costos y pagos
  budget_quote      NUMERIC(10,2),
  final_cost        NUMERIC(10,2),
  paid              BOOLEAN NOT NULL DEFAULT false,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_diagnostics_client_id ON diagnostics(client_id);
