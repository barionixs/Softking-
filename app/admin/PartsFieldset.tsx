"use client";

import { useState } from "react";
import type { DiagnosticPart } from "@/lib/diagnostics";

type Row = { key: number; nombre: string; cantidad: string; costo_unitario: string };

let nextKey = 0;

function toRows(parts?: DiagnosticPart[]): Row[] {
  if (!parts || parts.length === 0) return [];
  return parts.map((p) => ({
    key: nextKey++,
    nombre: p.nombre,
    cantidad: String(p.cantidad),
    costo_unitario: String(p.costo_unitario),
  }));
}

export function PartsFieldset({ initialParts }: { initialParts?: DiagnosticPart[] }) {
  const [rows, setRows] = useState<Row[]>(() => toRows(initialParts));

  function addRow() {
    setRows((prev) => [...prev, { key: nextKey++, nombre: "", cantidad: "1", costo_unitario: "0" }]);
  }

  function removeRow(key: number) {
    setRows((prev) => prev.filter((r) => r.key !== key));
  }

  function updateRow(key: number, field: keyof Omit<Row, "key">, value: string) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  }

  return (
    <div className="admin-parts">
      {rows.map((row) => (
        <div className="admin-parts__row" key={row.key}>
          <input
            name="parts_nombre"
            type="text"
            placeholder="Repuesto"
            value={row.nombre}
            onChange={(e) => updateRow(row.key, "nombre", e.target.value)}
          />
          <input
            name="parts_cantidad"
            type="number"
            min="1"
            placeholder="Cant."
            value={row.cantidad}
            onChange={(e) => updateRow(row.key, "cantidad", e.target.value)}
          />
          <input
            name="parts_costo"
            type="text"
            inputMode="decimal"
            placeholder="Costo unit."
            value={row.costo_unitario}
            onChange={(e) => updateRow(row.key, "costo_unitario", e.target.value)}
          />
          <button
            type="button"
            className="admin-parts__remove"
            onClick={() => removeRow(row.key)}
            aria-label="Quitar repuesto"
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className="admin-parts__add" onClick={addRow}>
        + Agregar repuesto
      </button>
    </div>
  );
}
