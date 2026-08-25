import Link from "next/link";
import { notFound } from "next/navigation";
import { getDiagnosticById } from "@/lib/actions/diagnostics";
import {
  STATUS_LABELS,
  TIPO_EQUIPO_LABELS,
  FORMA_PAGO_LABELS,
  ACCESORIOS_LABELS,
  calcCostoTotal,
  calcSaldoPendiente,
  type TipoEquipo,
  type FormaPago,
  type Accesorio,
} from "@/lib/diagnostics";
import { PrintButton } from "./PrintButton";
import { PhotoUpload } from "./PhotoUpload";
import { DeleteButton } from "./DeleteButton";

function formatDate(value: string | null, withTime = false) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

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

  const result = await getDiagnosticById(diagnosticId);
  if (!result) {
    notFound();
  }
  const { diagnostic: d, parts, photos, history } = result;

  const costoTotal = calcCostoTotal(d);
  const saldoPendiente = calcSaldoPendiente(d);
  const equipoLinea = [
    d.equipment_type ? TIPO_EQUIPO_LABELS[d.equipment_type as TipoEquipo] ?? d.equipment_type : null,
    d.marca,
    d.modelo,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <div className="admin-report__actions">
        <Link href={`/admin/reportes/${d.id}/editar`} className="btn btn--ghost">
          Editar
        </Link>
        <PrintButton />
        <DeleteButton diagnosticId={d.id} />
      </div>

      <article className="admin-report">
        <header className="admin-report__header">
          <div>
            <p className="admin-report__brand">SoftKing Support</p>
            <p className="admin-report__brand-sub">Soporte técnico &amp; desarrollo web</p>
          </div>
          <div className="admin-report__meta">
            <p>Folio N° {d.id}</p>
            <p>Ingreso: {formatDate(d.created_at)}</p>
            {d.fecha_entrega && <p>Entrega: {formatDate(d.fecha_entrega, true)}</p>}
          </div>
        </header>

        <section className="admin-report__section admin-report__summary">
          <div>
            <h2>Estado</h2>
            <span className={`admin-badge admin-badge--${d.status}`}>{STATUS_LABELS[d.status]}</span>
          </div>
          {d.tecnico_responsable && (
            <div>
              <h2>Atendido por</h2>
              <p>{d.tecnico_responsable}</p>
            </div>
          )}
        </section>

        <section className="admin-report__section">
          <h2>Cliente</h2>
          <p>{d.client_name}</p>
          {d.client_rut && <p>RUT: {d.client_rut}</p>}
          {d.client_phone && <p>{d.client_phone}</p>}
          {d.client_email && <p>{d.client_email}</p>}
          {d.client_address && <p>{d.client_address}</p>}
        </section>

        <section className="admin-report__section">
          <h2>Equipo</h2>
          <p>{equipoLinea || "No especificado"}</p>
          {d.numero_serie && <p>N° de serie: {d.numero_serie}</p>}
          {(d.accesorios_entregados?.length || d.accesorios_otros) && (
            <p>
              Accesorios:{" "}
              {[
                ...(d.accesorios_entregados ?? []).map((a) => ACCESORIOS_LABELS[a as Accesorio] ?? a),
                d.accesorios_otros,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
          {d.estado_fisico_ingreso && <p>Estado físico al ingreso: {d.estado_fisico_ingreso}</p>}
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
            {d.fecha_diagnostico && <p>Fecha: {formatDate(d.fecha_diagnostico, true)}</p>}
          </section>
        )}

        {(d.solution_applied || d.tiempo_trabajo_horas || parts.length > 0) && (
          <section className="admin-report__section">
            <h2>Intervención</h2>
            {d.solution_applied && <p>{d.solution_applied}</p>}
            {d.tiempo_trabajo_horas && <p>Tiempo de trabajo: {d.tiempo_trabajo_horas} hrs</p>}
            {parts.length > 0 && (
              <table className="admin-report__parts">
                <thead>
                  <tr>
                    <th>Repuesto</th>
                    <th>Cant.</th>
                    <th>Costo unit.</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>{p.cantidad}</td>
                      <td>${p.costo_unitario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        <section className="admin-report__section admin-report__summary">
          <div>
            <h2>Costos</h2>
            {d.budget_quote && <p>Presupuesto: ${d.budget_quote}</p>}
            <p>Total: ${costoTotal.toLocaleString("es-CL")}</p>
            {d.abono && <p>Abono: ${Number(d.abono).toLocaleString("es-CL")}</p>}
            <p>
              <strong>Saldo pendiente: ${saldoPendiente.toLocaleString("es-CL")}</strong>
            </p>
            {d.forma_pago && <p>Forma de pago: {FORMA_PAGO_LABELS[d.forma_pago as FormaPago]}</p>}
          </div>
          {(d.dias_garantia || d.condiciones_garantia) && (
            <div>
              <h2>Garantía</h2>
              {d.dias_garantia !== null && <p>{d.dias_garantia} días</p>}
              {d.condiciones_garantia && <p>{d.condiciones_garantia}</p>}
            </div>
          )}
        </section>

        {photos.length > 0 && (
          <section className="admin-report__section">
            <h2>Fotos del equipo</h2>
            <div className="admin-report__photos">
              {photos.map((photo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={photo.id} src={photo.url} alt="Foto del equipo" />
              ))}
            </div>
          </section>
        )}

        <footer className="admin-report__footer">
          <p>SoftKing Support · wa.me/56948917116 · @_softking</p>
        </footer>
      </article>

      <section className="admin-panel admin-report__extra">
        <h2 className="admin-panel__title">Fotos (agregar)</h2>
        <PhotoUpload diagnosticId={d.id} photos={photos} />
      </section>

      {history.length > 0 && (
        <section className="admin-panel admin-report__extra">
          <h2 className="admin-panel__title">Historial de estados</h2>
          <ul className="admin-timeline">
            {history.map((h) => (
              <li key={h.id}>
                <span className={`admin-badge admin-badge--${h.status}`}>{STATUS_LABELS[h.status]}</span>
                <span>{formatDate(h.changed_at, true)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
