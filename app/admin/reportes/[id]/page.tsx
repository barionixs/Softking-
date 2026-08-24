import { notFound } from "next/navigation";
import { getDiagnosticById } from "@/lib/actions/diagnostics";
import { STATUS_LABELS } from "@/lib/diagnostics";
import { PrintButton } from "./PrintButton";

export default async function ReportePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diagnosticId = Number(id);
  if (!Number.isInteger(diagnosticId)) {
    notFound();
  }

  const d = await getDiagnosticById(diagnosticId);
  if (!d) {
    notFound();
  }

  const date = new Date(d.created_at).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="admin-report__actions">
        <PrintButton />
      </div>

      <article className="admin-report">
        <header className="admin-report__header">
          <div>
            <p className="admin-report__brand">SoftKing Support</p>
            <p className="admin-report__brand-sub">Soporte técnico &amp; desarrollo web</p>
          </div>
          <div className="admin-report__meta">
            <p>Reporte N° {d.id}</p>
            <p>{date}</p>
          </div>
        </header>

        <section className="admin-report__section">
          <h2>Cliente</h2>
          <p>{d.client_name}</p>
          {d.client_phone && <p>{d.client_phone}</p>}
          {d.client_email && <p>{d.client_email}</p>}
          {d.client_address && <p>{d.client_address}</p>}
        </section>

        <section className="admin-report__section">
          <h2>Equipo</h2>
          <p>{d.equipment_type || "No especificado"}{d.brand_model ? ` · ${d.brand_model}` : ""}</p>
        </section>

        {d.reported_fault && (
          <section className="admin-report__section">
            <h2>Falla reportada</h2>
            <p>{d.reported_fault}</p>
          </section>
        )}

        {(d.diagnosis_notes || d.root_cause) && (
          <section className="admin-report__section">
            <h2>Diagnóstico</h2>
            {d.diagnosis_notes && <p>{d.diagnosis_notes}</p>}
            {d.root_cause && (
              <p>
                <strong>Causa:</strong> {d.root_cause}
              </p>
            )}
          </section>
        )}

        {d.solution_applied && (
          <section className="admin-report__section">
            <h2>Solución</h2>
            <p>{d.solution_applied}</p>
          </section>
        )}

        <section className="admin-report__section admin-report__summary">
          <div>
            <h2>Estado</h2>
            <span className={`admin-badge admin-badge--${d.status}`}>
              {STATUS_LABELS[d.status]}
            </span>
          </div>
          <div>
            <h2>Costos</h2>
            {d.budget_quote && <p>Presupuesto: ${d.budget_quote}</p>}
            {d.final_cost && <p>Costo final: ${d.final_cost}</p>}
            <p>{d.paid ? "Pagado" : "Pendiente de pago"}</p>
          </div>
        </section>

        <footer className="admin-report__footer">
          <p>SoftKing Support · wa.me/56948917116 · @_softking</p>
        </footer>
      </article>
    </>
  );
}
