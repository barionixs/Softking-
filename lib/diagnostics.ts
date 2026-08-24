export const DIAGNOSTIC_STATUSES = [
  "ingresado",
  "en_diagnostico",
  "en_reparacion",
  "esperando_repuesto",
  "listo_para_retiro",
  "entregado",
  "sin_reparacion",
] as const;
export type DiagnosticStatus = (typeof DIAGNOSTIC_STATUSES)[number];

export const STATUS_LABELS: Record<DiagnosticStatus, string> = {
  ingresado: "Ingresado",
  en_diagnostico: "En diagnóstico",
  en_reparacion: "En reparación",
  esperando_repuesto: "Esperando repuesto",
  listo_para_retiro: "Listo para retiro",
  entregado: "Entregado",
  sin_reparacion: "Sin reparación",
};

export const TIPO_EQUIPO_CHOICES = [
  "pc_escritorio",
  "notebook",
  "impresora",
  "servidor",
  "otro",
] as const;
export type TipoEquipo = (typeof TIPO_EQUIPO_CHOICES)[number];

export const TIPO_EQUIPO_LABELS: Record<TipoEquipo, string> = {
  pc_escritorio: "PC escritorio",
  notebook: "Notebook",
  impresora: "Impresora",
  servidor: "Servidor",
  otro: "Otro",
};

export const FORMA_PAGO_CHOICES = [
  "efectivo",
  "transferencia",
  "tarjeta",
  "otro",
] as const;
export type FormaPago = (typeof FORMA_PAGO_CHOICES)[number];

export const FORMA_PAGO_LABELS: Record<FormaPago, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
  otro: "Otro",
};

export const ACCESORIOS_CHOICES = [
  "cargador",
  "mouse",
  "teclado",
  "funda",
  "cable_poder",
  "bateria",
] as const;
export type Accesorio = (typeof ACCESORIOS_CHOICES)[number];

export const ACCESORIOS_LABELS: Record<Accesorio, string> = {
  cargador: "Cargador",
  mouse: "Mouse",
  teclado: "Teclado",
  funda: "Funda",
  cable_poder: "Cable de poder",
  bateria: "Batería",
};

export type Diagnostic = {
  id: number;
  client_id: number;

  // Identificacion / estado
  status: DiagnosticStatus;
  created_at: string;
  fecha_entrega: string | null;

  // Equipo
  equipment_type: string | null;
  marca: string | null;
  modelo: string | null;
  numero_serie: string | null;
  accesorios_entregados: string[] | null;
  accesorios_otros: string | null;
  estado_fisico_ingreso: string | null;

  // Diagnostico
  reported_fault: string | null;
  diagnosis_notes: string | null;
  root_cause: string | null;
  fecha_diagnostico: string | null;

  // Intervencion
  solution_applied: string | null;
  tiempo_trabajo_horas: string | null;

  // Costos
  budget_quote: string | null;
  costo_mano_obra: string | null;
  costo_repuestos: string | null;
  abono: string | null;
  forma_pago: FormaPago | null;

  // Garantia
  dias_garantia: number | null;
  condiciones_garantia: string | null;

  // Trazabilidad
  tecnico_responsable: string | null;
  notas_internas: string | null;
  conforme_ingreso: boolean;
  conforme_retiro: boolean;
  notificado_cliente: boolean;
};

export type DiagnosticWithClient = Diagnostic & {
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  client_address: string | null;
  client_rut: string | null;
};

export type DiagnosticPart = {
  id: number;
  diagnostic_id: number;
  nombre: string;
  cantidad: number;
  costo_unitario: string;
};

export type DiagnosticPhoto = {
  id: number;
  diagnostic_id: number;
  url: string;
  uploaded_at: string;
};

export type StatusHistoryEntry = {
  id: number;
  diagnostic_id: number;
  status: DiagnosticStatus;
  changed_at: string;
};

export function calcCostoTotal(d: Pick<Diagnostic, "costo_mano_obra" | "costo_repuestos">) {
  return Number(d.costo_mano_obra || 0) + Number(d.costo_repuestos || 0);
}

export function calcSaldoPendiente(
  d: Pick<Diagnostic, "costo_mano_obra" | "costo_repuestos" | "abono">
) {
  return calcCostoTotal(d) - Number(d.abono || 0);
}
