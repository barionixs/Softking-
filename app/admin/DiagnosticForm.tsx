"use client";

import { useActionState } from "react";
import { createDiagnostic, updateDiagnostic } from "@/lib/actions/diagnostics";
import {
  DIAGNOSTIC_STATUSES,
  STATUS_LABELS,
  TIPO_EQUIPO_CHOICES,
  TIPO_EQUIPO_LABELS,
  FORMA_PAGO_CHOICES,
  FORMA_PAGO_LABELS,
  ACCESORIOS_CHOICES,
  ACCESORIOS_LABELS,
  type Diagnostic,
  type DiagnosticPart,
} from "@/lib/diagnostics";
import { PartsFieldset } from "./PartsFieldset";

type ClientOption = { id: number; name: string };

function toDatetimeLocal(value: string | null | undefined) {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function DiagnosticForm({
  clientId,
  clients,
  diagnostic,
  diagnosticId,
  parts,
}: {
  clientId?: number;
  clients?: ClientOption[];
  diagnostic?: Diagnostic;
  diagnosticId?: number;
  parts?: DiagnosticPart[];
}) {
  const action = diagnosticId ? updateDiagnostic.bind(null, diagnosticId) : createDiagnostic;
  const [state, formAction, pending] = useActionState(action, undefined);
  const d = diagnostic;

  return (
    <form action={formAction} className="admin-form">
      {clientId ? (
        <input type="hidden" name="client_id" value={clientId} />
      ) : (
        <div className="admin-form__field">
          <label htmlFor="client_id">Cliente</label>
          <select id="client_id" name="client_id" required defaultValue={d?.client_id ?? ""}>
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

      <h3 className="admin-form__section">Identificación del servicio</h3>
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label htmlFor="status">Estado</label>
          <select id="status" name="status" defaultValue={d?.status ?? "ingresado"}>
            {DIAGNOSTIC_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-form__field">
          <label htmlFor="fecha_entrega">Fecha de entrega</label>
          <input
            id="fecha_entrega"
            name="fecha_entrega"
            type="datetime-local"
            defaultValue={toDatetimeLocal(d?.fecha_entrega)}
          />
        </div>
      </div>

      <h3 className="admin-form__section">Equipo</h3>
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label htmlFor="equipment_type">Tipo de equipo</label>
          <select id="equipment_type" name="equipment_type" defaultValue={d?.equipment_type ?? ""}>
            <option value="">Selecciona</option>
            {TIPO_EQUIPO_CHOICES.map((t) => (
              <option key={t} value={t}>
                {TIPO_EQUIPO_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-form__field">
          <label htmlFor="numero_serie">N° de serie</label>
          <input id="numero_serie" name="numero_serie" type="text" defaultValue={d?.numero_serie ?? ""} />
        </div>
      </div>
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label htmlFor="marca">Marca</label>
          <input id="marca" name="marca" type="text" defaultValue={d?.marca ?? ""} />
        </div>
        <div className="admin-form__field">
          <label htmlFor="modelo">Modelo</label>
          <input id="modelo" name="modelo" type="text" defaultValue={d?.modelo ?? ""} />
        </div>
      </div>
      <div className="admin-form__field">
        <label>Accesorios entregados</label>
        <div className="admin-checklist">
          {ACCESORIOS_CHOICES.map((a) => (
            <label key={a} className="admin-checklist__item">
              <input
                type="checkbox"
                name="accesorios_entregados"
                value={a}
                defaultChecked={d?.accesorios_entregados?.includes(a)}
              />
              {ACCESORIOS_LABELS[a]}
            </label>
          ))}
        </div>
      </div>
      <div className="admin-form__field">
        <label htmlFor="accesorios_otros">Otros accesorios</label>
        <input id="accesorios_otros" name="accesorios_otros" type="text" defaultValue={d?.accesorios_otros ?? ""} />
      </div>
      <div className="admin-form__field">
        <label htmlFor="estado_fisico_ingreso">Estado físico al ingreso</label>
        <textarea
          id="estado_fisico_ingreso"
          name="estado_fisico_ingreso"
          rows={2}
          placeholder="Rayones, golpes, pantalla trizada, etc."
          defaultValue={d?.estado_fisico_ingreso ?? ""}
        />
      </div>

      <h3 className="admin-form__section">Diagnóstico</h3>
      <div className="admin-form__field">
        <label htmlFor="reported_fault">Falla reportada</label>
        <textarea id="reported_fault" name="reported_fault" rows={2} defaultValue={d?.reported_fault ?? ""} />
      </div>
      <div className="admin-form__field">
        <label htmlFor="diagnosis_notes">Diagnóstico técnico</label>
        <textarea id="diagnosis_notes" name="diagnosis_notes" rows={2} defaultValue={d?.diagnosis_notes ?? ""} />
      </div>
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label htmlFor="root_cause">Causa</label>
          <input id="root_cause" name="root_cause" type="text" defaultValue={d?.root_cause ?? ""} />
        </div>
        <div className="admin-form__field">
          <label htmlFor="fecha_diagnostico">Fecha del diagnóstico</label>
          <input
            id="fecha_diagnostico"
            name="fecha_diagnostico"
            type="datetime-local"
            defaultValue={toDatetimeLocal(d?.fecha_diagnostico)}
          />
        </div>
      </div>

      <h3 className="admin-form__section">Intervención</h3>
      <div className="admin-form__field">
        <label htmlFor="solution_applied">Trabajo realizado</label>
        <textarea id="solution_applied" name="solution_applied" rows={2} defaultValue={d?.solution_applied ?? ""} />
      </div>
      <div className="admin-form__field">
        <label htmlFor="tiempo_trabajo_horas">Tiempo de trabajo (horas)</label>
        <input
          id="tiempo_trabajo_horas"
          name="tiempo_trabajo_horas"
          type="text"
          inputMode="decimal"
          defaultValue={d?.tiempo_trabajo_horas ?? ""}
        />
      </div>
      <div className="admin-form__field">
        <label>Repuestos usados</label>
        <PartsFieldset initialParts={parts} />
      </div>

      <h3 className="admin-form__section">Costos</h3>
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label htmlFor="budget_quote">Presupuesto</label>
          <input id="budget_quote" name="budget_quote" type="text" inputMode="decimal" defaultValue={d?.budget_quote ?? ""} />
        </div>
        <div className="admin-form__field">
          <label htmlFor="costo_mano_obra">Costo mano de obra</label>
          <input
            id="costo_mano_obra"
            name="costo_mano_obra"
            type="text"
            inputMode="decimal"
            defaultValue={d?.costo_mano_obra ?? ""}
          />
        </div>
      </div>
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label htmlFor="costo_repuestos">Costo repuestos</label>
          <input
            id="costo_repuestos"
            name="costo_repuestos"
            type="text"
            inputMode="decimal"
            defaultValue={d?.costo_repuestos ?? ""}
          />
        </div>
        <div className="admin-form__field">
          <label htmlFor="abono">Abono</label>
          <input id="abono" name="abono" type="text" inputMode="decimal" defaultValue={d?.abono ?? ""} />
        </div>
      </div>
      <div className="admin-form__field">
        <label htmlFor="forma_pago">Forma de pago</label>
        <select id="forma_pago" name="forma_pago" defaultValue={d?.forma_pago ?? ""}>
          <option value="">Sin especificar</option>
          {FORMA_PAGO_CHOICES.map((f) => (
            <option key={f} value={f}>
              {FORMA_PAGO_LABELS[f]}
            </option>
          ))}
        </select>
      </div>

      <h3 className="admin-form__section">Garantía</h3>
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label htmlFor="dias_garantia">Días de garantía</label>
          <input id="dias_garantia" name="dias_garantia" type="number" min="0" defaultValue={d?.dias_garantia ?? ""} />
        </div>
      </div>
      <div className="admin-form__field">
        <label htmlFor="condiciones_garantia">Condiciones de garantía</label>
        <textarea
          id="condiciones_garantia"
          name="condiciones_garantia"
          rows={2}
          defaultValue={d?.condiciones_garantia ?? ""}
        />
      </div>

      <h3 className="admin-form__section">Trazabilidad</h3>
      <div className="admin-form__field">
        <label htmlFor="tecnico_responsable">Técnico responsable</label>
        <input id="tecnico_responsable" name="tecnico_responsable" type="text" defaultValue={d?.tecnico_responsable ?? ""} />
      </div>
      <div className="admin-form__field">
        <label htmlFor="notas_internas">Notas internas (no se muestra al cliente)</label>
        <textarea id="notas_internas" name="notas_internas" rows={2} defaultValue={d?.notas_internas ?? ""} />
      </div>
      <div className="admin-form__field admin-form__field--checkbox">
        <label htmlFor="conforme_ingreso">
          <input
            id="conforme_ingreso"
            name="conforme_ingreso"
            type="checkbox"
            defaultChecked={d?.conforme_ingreso}
          />
          Cliente conforme con el estado registrado al ingreso
        </label>
      </div>
      <div className="admin-form__field admin-form__field--checkbox">
        <label htmlFor="conforme_retiro">
          <input id="conforme_retiro" name="conforme_retiro" type="checkbox" defaultChecked={d?.conforme_retiro} />
          Cliente retiró conforme
        </label>
      </div>
      <div className="admin-form__field admin-form__field--checkbox">
        <label htmlFor="notificado_cliente">
          <input
            id="notificado_cliente"
            name="notificado_cliente"
            type="checkbox"
            defaultChecked={d?.notificado_cliente}
          />
          Cliente notificado de que está listo
        </label>
      </div>

      {state?.error && <p className="admin-form__error">{state.error}</p>}
      <button className="btn btn--whatsapp" type="submit" disabled={pending}>
        {pending ? "Guardando..." : diagnosticId ? "Guardar cambios" : "Guardar reporte"}
      </button>
    </form>
  );
}
