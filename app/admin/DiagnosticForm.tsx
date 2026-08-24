"use client";

import { useActionState } from "react";
import { createDiagnostic } from "@/lib/actions/diagnostics";
import { DIAGNOSTIC_STATUSES, STATUS_LABELS } from "@/lib/diagnostics";

type ClientOption = { id: number; name: string };

export function DiagnosticForm({
  clientId,
  clients,
}: {
  clientId?: number;
  clients?: ClientOption[];
}) {
  const [state, action, pending] = useActionState(createDiagnostic, undefined);

  return (
    <form action={action} className="admin-form">
      {clientId ? (
        <input type="hidden" name="client_id" value={clientId} />
      ) : (
        <div className="admin-form__field">
          <label htmlFor="client_id">Cliente</label>
          <select id="client_id" name="client_id" required defaultValue="">
            <option value="" disabled>
              Selecciona un cliente
            </option>
            {clients?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="admin-form__field">
        <label htmlFor="equipment_type">Tipo de equipo</label>
        <input id="equipment_type" name="equipment_type" type="text" placeholder="PC, notebook, impresora..." />
      </div>
      <div className="admin-form__field">
        <label htmlFor="brand_model">Marca / modelo</label>
        <input id="brand_model" name="brand_model" type="text" />
      </div>
      <div className="admin-form__field">
        <label htmlFor="reported_fault">Falla reportada</label>
        <textarea id="reported_fault" name="reported_fault" rows={2} />
      </div>
      <div className="admin-form__field">
        <label htmlFor="diagnosis_notes">Notas del diagnóstico</label>
        <textarea id="diagnosis_notes" name="diagnosis_notes" rows={2} />
      </div>
      <div className="admin-form__field">
        <label htmlFor="root_cause">Causa encontrada</label>
        <input id="root_cause" name="root_cause" type="text" />
      </div>
      <div className="admin-form__field">
        <label htmlFor="solution_applied">Solución aplicada</label>
        <textarea id="solution_applied" name="solution_applied" rows={2} />
      </div>
      <div className="admin-form__field">
        <label htmlFor="status">Estado</label>
        <select id="status" name="status" defaultValue="pending">
          {DIAGNOSTIC_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label htmlFor="budget_quote">Presupuesto</label>
          <input id="budget_quote" name="budget_quote" type="text" inputMode="decimal" />
        </div>
        <div className="admin-form__field">
          <label htmlFor="final_cost">Costo final</label>
          <input id="final_cost" name="final_cost" type="text" inputMode="decimal" />
        </div>
      </div>
      <div className="admin-form__field admin-form__field--checkbox">
        <label htmlFor="paid">
          <input id="paid" name="paid" type="checkbox" />
          Pagado
        </label>
      </div>
      {state?.error && <p className="admin-form__error">{state.error}</p>}
      <button className="btn btn--whatsapp" type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar reporte"}
      </button>
    </form>
  );
}
