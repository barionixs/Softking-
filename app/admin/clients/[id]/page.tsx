import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientById } from "@/lib/actions/clients";
import { getDiagnosticsByClient } from "@/lib/actions/diagnostics";
import { STATUS_LABELS } from "@/lib/diagnostics";
import { DiagnosticForm } from "@/app/admin/DiagnosticForm";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clientId = Number(id);
  if (!Number.isInteger(clientId)) {
    notFound();
  }

  const client = await getClientById(clientId);
  if (!client) {
    notFound();
  }

  const diagnostics = await getDiagnosticsByClient(clientId);

  return (
    <>
      <h1 className="admin-shell__title">{client.name}</h1>
      <p className="admin-client-meta">
        {client.phone && <span>{client.phone}</span>}
        {client.email && <span>{client.email}</span>}
        {client.address && <span>{client.address}</span>}
      </p>

      <div className="admin-grid">
        <section className="admin-panel">
          <h2 className="admin-panel__title">Diagnósticos</h2>
          {diagnostics.length === 0 && (
            <p className="admin-table__empty">Sin diagnósticos registrados.</p>
          )}
          <ul className="admin-diag-list">
            {diagnostics.map((d) => (
              <li key={d.id} className="admin-diag-card">
                <div className="admin-diag-card__head">
                  <span>
                    {d.equipment_type || "Equipo"}
                    {d.brand_model ? ` · ${d.brand_model}` : ""}
                  </span>
                  <span className={`admin-badge admin-badge--${d.status}`}>
                    {STATUS_LABELS[d.status]}
                  </span>
                </div>
                <Link href={`/admin/reportes/${d.id}`} className="admin-diag-card__export">
                  Exportar PDF
                </Link>
                {d.reported_fault && <p><strong>Falla:</strong> {d.reported_fault}</p>}
                {d.diagnosis_notes && <p><strong>Diagnóstico:</strong> {d.diagnosis_notes}</p>}
                {d.root_cause && <p><strong>Causa:</strong> {d.root_cause}</p>}
                {d.solution_applied && <p><strong>Solución:</strong> {d.solution_applied}</p>}
                <p className="admin-diag-card__cost">
                  {d.budget_quote && <span>Presupuesto: ${d.budget_quote}</span>}
                  {d.final_cost && <span>Costo final: ${d.final_cost}</span>}
                  <span>{d.paid ? "Pagado" : "Pendiente de pago"}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-panel">
          <h2 className="admin-panel__title">Nuevo diagnóstico</h2>
          <DiagnosticForm clientId={clientId} />
        </section>
      </div>
    </>
  );
}
