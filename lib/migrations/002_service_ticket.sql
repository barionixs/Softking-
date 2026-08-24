-- Run once against the Postgres database (local .env.local and production
-- share the same Neon instance, so a single run covers both).

-- Cliente
ALTER TABLE clients ADD COLUMN rut TEXT;

-- Estado: migrar valores viejos antes de cambiar el CHECK
ALTER TABLE diagnostics DROP CONSTRAINT diagnostics_status_check;
UPDATE diagnostics SET status = CASE status
  WHEN 'pending' THEN 'ingresado'
  WHEN 'in_progress' THEN 'en_reparacion'
  WHEN 'done' THEN 'entregado'
  ELSE status END;
ALTER TABLE diagnostics ALTER COLUMN status SET DEFAULT 'ingresado';
ALTER TABLE diagnostics ADD CONSTRAINT diagnostics_status_check
  CHECK (status IN ('ingresado','en_diagnostico','en_reparacion','esperando_repuesto','listo_para_retiro','entregado','sin_reparacion'));

-- Identificacion / fechas
ALTER TABLE diagnostics ADD COLUMN fecha_entrega TIMESTAMPTZ;
ALTER TABLE diagnostics ADD COLUMN fecha_diagnostico TIMESTAMPTZ;

-- Equipo: dividir brand_model en marca/modelo, agregar campos nuevos
ALTER TABLE diagnostics ADD COLUMN marca TEXT;
ALTER TABLE diagnostics ADD COLUMN modelo TEXT;
UPDATE diagnostics SET marca = split_part(brand_model, ' · ', 1), modelo = split_part(brand_model, ' · ', 2) WHERE brand_model IS NOT NULL;
ALTER TABLE diagnostics DROP COLUMN brand_model;
ALTER TABLE diagnostics ADD COLUMN numero_serie TEXT;
ALTER TABLE diagnostics ADD COLUMN accesorios_entregados TEXT[];
ALTER TABLE diagnostics ADD COLUMN accesorios_otros TEXT;
ALTER TABLE diagnostics ADD COLUMN estado_fisico_ingreso TEXT;

-- Intervencion
ALTER TABLE diagnostics ADD COLUMN tiempo_trabajo_horas NUMERIC(6,2);

-- Costos: renombrar final_cost, agregar el resto
ALTER TABLE diagnostics RENAME COLUMN final_cost TO costo_mano_obra;
ALTER TABLE diagnostics ADD COLUMN costo_repuestos NUMERIC(10,2);
ALTER TABLE diagnostics ADD COLUMN abono NUMERIC(10,2);
ALTER TABLE diagnostics ADD COLUMN forma_pago TEXT CHECK (forma_pago IN ('efectivo','transferencia','tarjeta','otro'));
ALTER TABLE diagnostics DROP COLUMN paid;

-- Garantia
ALTER TABLE diagnostics ADD COLUMN dias_garantia INTEGER;
ALTER TABLE diagnostics ADD COLUMN condiciones_garantia TEXT;

-- Trazabilidad
ALTER TABLE diagnostics ADD COLUMN tecnico_responsable TEXT;
ALTER TABLE diagnostics ADD COLUMN notas_internas TEXT;
ALTER TABLE diagnostics ADD COLUMN conforme_ingreso BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE diagnostics ADD COLUMN conforme_retiro BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE diagnostics ADD COLUMN notificado_cliente BOOLEAN NOT NULL DEFAULT false;

-- Repuestos usados
CREATE TABLE diagnostic_parts (
  id SERIAL PRIMARY KEY,
  diagnostic_id INTEGER NOT NULL REFERENCES diagnostics(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  costo_unitario NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_diagnostic_parts_diagnostic_id ON diagnostic_parts(diagnostic_id);

-- Historial de estados
CREATE TABLE diagnostic_status_history (
  id SERIAL PRIMARY KEY,
  diagnostic_id INTEGER NOT NULL REFERENCES diagnostics(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_diagnostic_status_history_diagnostic_id ON diagnostic_status_history(diagnostic_id);

-- Fotos del equipo (URLs de Vercel Blob)
CREATE TABLE diagnostic_photos (
  id SERIAL PRIMARY KEY,
  diagnostic_id INTEGER NOT NULL REFERENCES diagnostics(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_diagnostic_photos_diagnostic_id ON diagnostic_photos(diagnostic_id);
