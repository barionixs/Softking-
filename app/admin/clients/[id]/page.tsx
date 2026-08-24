import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientById } from "@/lib/actions/clients";
import { getDiagnosticsByClient } from "@/lib/actions/diagnostics";
import { STATUS_LABELS, TIPO_EQUIPO_LABELS, type TipoEquipo } from "@/lib/diagnostics";
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
        {client.rut && <span>RUT {client.rut}</span>}
        {client.phone && <span>{client.phone}</span>}
        {client.email && <span>{client.email}</span>}
        {client.address && <span>{client.address}</span>}
      </p>

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
                  {d.equipment_type ? TIPO_EQUIPO_LABELS[d.equipment_type as TipoEquipo] ?? d.equipment_type : "Equipo"}
                  {d.marca ? ` · ${d.marca}` : ""}
                  {d.modelo ? ` ${d.modelo}` : ""}
                </span>
                <span className={`admin-badge admin-badge--${d.status}`}>
                  {STATUS_LABELS[d.status]}
                </span>
              </div>
              {d.reported_fault && <p><strong>Falla:</strong> {d.reported_fault}</p>}
              <Link href={`/admin/reportes/${d.id}`} className="admin-diag-card__export">
                Ver reporte completo / Exportar PDF
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-panel admin-panel--form">
        <h2 className="admin-panel__title">Nuevo diagnóstico</h2>
        <DiagnosticForm clientId={clientId} />
      </section>
    </>
  );
}
