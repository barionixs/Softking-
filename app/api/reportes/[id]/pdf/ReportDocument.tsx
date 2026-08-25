import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import {
  STATUS_LABELS,
  TIPO_EQUIPO_LABELS,
  FORMA_PAGO_LABELS,
  ACCESORIOS_LABELS,
  calcCostoTotal,
  calcSaldoPendiente,
  type DiagnosticWithClient,
  type DiagnosticPart,
  type DiagnosticPhoto,
  type TipoEquipo,
  type FormaPago,
  type Accesorio,
} from "@/lib/diagnostics";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#111827" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 14,
    marginBottom: 18,
  },
  brandBlock: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 90, height: 40, objectFit: "contain" },
  brand: { fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 },
  brandSub: { fontSize: 9, color: "#555", marginTop: 2 },
  metaRight: { alignItems: "flex-end" },
  metaText: { fontSize: 9, color: "#555" },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#ff7a1a",
    marginBottom: 5,
    fontWeight: 700,
  },
  text: { fontSize: 10, lineHeight: 1.5 },
  bold: { fontWeight: 700 },
  summaryRow: { flexDirection: "row", gap: 30 },
  summaryCol: { flex: 1 },
  badge: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  table: { marginTop: 6, borderWidth: 1, borderColor: "#ddd" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ddd" },
  tableRowLast: { flexDirection: "row" },
  tableHeaderCell: {
    flex: 1,
    fontSize: 8,
    textTransform: "uppercase",
    color: "#555",
    padding: 5,
    backgroundColor: "#f5f5f5",
  },
  tableCell: { flex: 1, fontSize: 9, padding: 5 },
  photosRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  photo: { width: 90, height: 90, objectFit: "cover", borderWidth: 1, borderColor: "#ddd" },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
    marginTop: 20,
    fontSize: 8,
    color: "#666",
    textAlign: "center",
  },
});

function formatDate(value: string | null, withTime = false) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function ReportDocument({
  diagnostic: d,
  parts,
  photos,
  logoSrc,
}: {
  diagnostic: DiagnosticWithClient;
  parts: DiagnosticPart[];
  photos: DiagnosticPhoto[];
  logoSrc: string;
}) {
  const costoTotal = calcCostoTotal(d);
  const saldoPendiente = calcSaldoPendiente(d);
  const equipoLinea = [
    d.equipment_type ? TIPO_EQUIPO_LABELS[d.equipment_type as TipoEquipo] ?? d.equipment_type : null,
    d.marca,
    d.modelo,
  ]
    .filter(Boolean)
    .join(" · ");
  const accesorios = [
    ...(d.accesorios_entregados ?? []).map((a) => ACCESORIOS_LABELS[a as Accesorio] ?? a),
    d.accesorios_otros,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image, not an HTML/DOM element */}
            <Image src={logoSrc} style={styles.logo} />
            <View>
              <Text style={styles.brand}>SoftKing Support</Text>
              <Text style={styles.brandSub}>Soporte técnico &amp; desarrollo web</Text>
            </View>
          </View>
          <View style={styles.metaRight}>
            <Text style={styles.metaText}>Folio N° {d.id}</Text>
            <Text style={styles.metaText}>Ingreso: {formatDate(d.created_at)}</Text>
            {d.fecha_entrega && <Text style={styles.metaText}>Entrega: {formatDate(d.fecha_entrega, true)}</Text>}
          </View>
        </View>

        <View style={[styles.section, styles.summaryRow]}>
          <View style={styles.summaryCol}>
            <Text style={styles.sectionTitle}>Estado</Text>
            <Text style={styles.badge}>{STATUS_LABELS[d.status]}</Text>
          </View>
          {d.tecnico_responsable && (
            <View style={styles.summaryCol}>
              <Text style={styles.sectionTitle}>Atendido por</Text>
              <Text style={styles.text}>{d.tecnico_responsable}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <Text style={styles.text}>{d.client_name}</Text>
          {d.client_rut && <Text style={styles.text}>RUT: {d.client_rut}</Text>}
          {d.client_phone && <Text style={styles.text}>{d.client_phone}</Text>}
          {d.client_email && <Text style={styles.text}>{d.client_email}</Text>}
          {d.client_address && <Text style={styles.text}>{d.client_address}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipo</Text>
          <Text style={styles.text}>{equipoLinea || "No especificado"}</Text>
          {d.numero_serie && <Text style={styles.text}>N° de serie: {d.numero_serie}</Text>}
          {accesorios && <Text style={styles.text}>Accesorios: {accesorios}</Text>}
          {d.estado_fisico_ingreso && (
            <Text style={styles.text}>Estado físico al ingreso: {d.estado_fisico_ingreso}</Text>
          )}
        </View>

        {d.reported_fault && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Falla reportada</Text>
            <Text style={styles.text}>{d.reported_fault}</Text>
          </View>
        )}

        {(d.diagnosis_notes || d.root_cause) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnóstico</Text>
            {d.diagnosis_notes && <Text style={styles.text}>{d.diagnosis_notes}</Text>}
            {d.root_cause && (
              <Text style={styles.text}>
                <Text style={styles.bold}>Causa: </Text>
                {d.root_cause}
              </Text>
            )}
            {d.fecha_diagnostico && (
              <Text style={styles.text}>Fecha: {formatDate(d.fecha_diagnostico, true)}</Text>
            )}
          </View>
        )}

        {(d.solution_applied || d.tiempo_trabajo_horas || parts.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Intervención</Text>
            {d.solution_applied && <Text style={styles.text}>{d.solution_applied}</Text>}
            {d.tiempo_trabajo_horas && (
              <Text style={styles.text}>Tiempo de trabajo: {d.tiempo_trabajo_horas} hrs</Text>
            )}
            {parts.length > 0 && (
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeaderCell}>Repuesto</Text>
                  <Text style={styles.tableHeaderCell}>Cant.</Text>
                  <Text style={styles.tableHeaderCell}>Costo unit.</Text>
                </View>
                {parts.map((p, i) => (
                  <View style={i === parts.length - 1 ? styles.tableRowLast : styles.tableRow} key={p.id}>
                    <Text style={styles.tableCell}>{p.nombre}</Text>
                    <Text style={styles.tableCell}>{p.cantidad}</Text>
                    <Text style={styles.tableCell}>${p.costo_unitario}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={[styles.section, styles.summaryRow]}>
          <View style={styles.summaryCol}>
            <Text style={styles.sectionTitle}>Costos</Text>
            {d.budget_quote && <Text style={styles.text}>Presupuesto: ${d.budget_quote}</Text>}
            <Text style={styles.text}>Total: ${costoTotal.toLocaleString("es-CL")}</Text>
            {d.abono && <Text style={styles.text}>Abono: ${Number(d.abono).toLocaleString("es-CL")}</Text>}
            <Text style={[styles.text, styles.bold]}>
              Saldo pendiente: ${saldoPendiente.toLocaleString("es-CL")}
            </Text>
            {d.forma_pago && (
              <Text style={styles.text}>Forma de pago: {FORMA_PAGO_LABELS[d.forma_pago as FormaPago]}</Text>
            )}
          </View>
          {(d.dias_garantia || d.condiciones_garantia) && (
            <View style={styles.summaryCol}>
              <Text style={styles.sectionTitle}>Garantía</Text>
              {d.dias_garantia !== null && <Text style={styles.text}>{d.dias_garantia} días</Text>}
              {d.condiciones_garantia && <Text style={styles.text}>{d.condiciones_garantia}</Text>}
            </View>
          )}
        </View>

        {photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fotos del equipo</Text>
            <View style={styles.photosRow}>
              {photos.map((photo) => (
                // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image, not an HTML/DOM element
                <Image key={photo.id} src={photo.url} style={styles.photo} />
              ))}
            </View>
          </View>
        )}

        <Text style={styles.footer}>SoftKing Support · wa.me/56948917116 · @_softking</Text>
      </Page>
    </Document>
  );
}
