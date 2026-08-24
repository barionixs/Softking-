import Link from "next/link";
import { getAllDiagnostics } from "@/lib/actions/diagnostics";
import { getClients } from "@/lib/actions/clients";
import { STATUS_LABELS } from "@/lib/diagnostics";
import { DiagnosticForm } from "@/app/admin/DiagnosticForm";

export default async function ReportesPage() {
  const [diagnostics, clients] = await Promise.all([
    getAllDiagnostics(),
    getClients(),
  ]);

  return (
    <>
      <h1 className="admin-shell__title">Reportes</h1>

      <div className="admin-grid">
        <section className="admin-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Equipo</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {diagnostics.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-table__empty">
                    Todavía no hay reportes registrados.
                  </td>
                </tr>
              )}
              {diagnostics.map((d) => (
                <tr key={d.id} className="admin-table__row">
                  <td>
                    <Link href={`/admin/clients/${d.client_id}`}>
                      {d.client_name}
                    </Link>
                  </td>
                  <td>
                    {d.equipment_type || "—"}
                    {d.brand_model ? ` · ${d.brand_model}` : ""}
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge--${d.status}`}>
                      {STATUS_LABELS[d.status]}
                    </span>
                  </td>
                  <td>{new Date(d.created_at).toLocaleDateString("es-CL")}</td>
                  <td>
                    <Link href={`/admin/reportes/${d.id}`}>Ver / Exportar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="admin-panel">
          <h2 className="admin-panel__title">Nuevo reporte</h2>
          {clients.length === 0 ? (
            <p className="admin-table__empty">
              Primero crea un cliente en la sección{" "}
              <Link href="/admin">Clientes</Link>.
            </p>
          ) : (
            <DiagnosticForm clients={clients} />
          )}
        </section>
      </div>
    </>
  );
}
