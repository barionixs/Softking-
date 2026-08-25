"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { sql } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import {
  DIAGNOSTIC_STATUSES,
  type DiagnosticStatus,
  type DiagnosticWithClient,
  type DiagnosticPart,
  type DiagnosticPhoto,
  type StatusHistoryEntry,
} from "@/lib/diagnostics";

const optionalText = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null));

const optionalNumeric = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || !Number.isNaN(Number(v)), {
      message: "Debe ser un número.",
    })
    .transform((v) => (v === null ? null : Number(v)));

const optionalInt = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || Number.isInteger(Number(v)), {
      message: "Debe ser un número entero.",
    })
    .transform((v) => (v === null ? null : parseInt(v, 10)));

const optionalDate = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? new Date(v) : null));

const DiagnosticSchema = z.object({
  client_id: z.coerce.number().int().positive({ message: "Selecciona un cliente." }),
  status: z.enum(DIAGNOSTIC_STATUSES),
  fecha_entrega: optionalDate(),
  equipment_type: optionalText(),
  marca: optionalText(),
  modelo: optionalText(),
  numero_serie: optionalText(),
  accesorios_entregados: z.array(z.string()).default([]),
  accesorios_otros: optionalText(),
  estado_fisico_ingreso: optionalText(),
  reported_fault: optionalText(),
  diagnosis_notes: optionalText(),
  root_cause: optionalText(),
  fecha_diagnostico: optionalDate(),
  solution_applied: optionalText(),
  tiempo_trabajo_horas: optionalNumeric(),
  budget_quote: optionalNumeric(),
  costo_mano_obra: optionalNumeric(),
  costo_repuestos: optionalNumeric(),
  abono: optionalNumeric(),
  forma_pago: optionalText(),
  dias_garantia: optionalInt(),
  condiciones_garantia: optionalText(),
  tecnico_responsable: optionalText(),
  notas_internas: optionalText(),
  conforme_ingreso: z.boolean(),
  conforme_retiro: z.boolean(),
  notificado_cliente: z.boolean(),
});

const DIAGNOSTIC_COLUMNS = [
  "client_id",
  "status",
  "fecha_entrega",
  "equipment_type",
  "marca",
  "modelo",
  "numero_serie",
  "accesorios_entregados",
  "accesorios_otros",
  "estado_fisico_ingreso",
  "reported_fault",
  "diagnosis_notes",
  "root_cause",
  "fecha_diagnostico",
  "solution_applied",
  "tiempo_trabajo_horas",
  "budget_quote",
  "costo_mano_obra",
  "costo_repuestos",
  "abono",
  "forma_pago",
  "dias_garantia",
  "condiciones_garantia",
  "tecnico_responsable",
  "notas_internas",
  "conforme_ingreso",
  "conforme_retiro",
  "notificado_cliente",
] as const;

const PartSchema = z.object({
  nombre: z.string().trim().min(1),
  cantidad: z.coerce.number().int().positive(),
  costo_unitario: z.coerce.number().nonnegative(),
});

function parseParts(formData: FormData) {
  const nombres = formData.getAll("parts_nombre") as string[];
  const cantidades = formData.getAll("parts_cantidad") as string[];
  const costos = formData.getAll("parts_costo") as string[];

  const parts = nombres
    .map((nombre, i) => ({
      nombre: (nombre ?? "").trim(),
      cantidad: cantidades[i] || "1",
      costo_unitario: costos[i] || "0",
    }))
    .filter((p) => p.nombre.length > 0);

  return z.array(PartSchema).safeParse(parts);
}

async function replaceParts(
  diagnosticId: number,
  parts: { nombre: string; cantidad: number; costo_unitario: number }[]
) {
  await sql`DELETE FROM diagnostic_parts WHERE diagnostic_id = ${diagnosticId}`;
  if (parts.length === 0) return;
  await sql`
    INSERT INTO diagnostic_parts ${sql(
      parts.map((p) => ({ diagnostic_id: diagnosticId, ...p })),
      "diagnostic_id",
      "nombre",
      "cantidad",
      "costo_unitario"
    )}
  `;
}

function readDiagnosticFormData(formData: FormData) {
  return {
    client_id: formData.get("client_id"),
    status: formData.get("status"),
    fecha_entrega: formData.get("fecha_entrega"),
    equipment_type: formData.get("equipment_type"),
    marca: formData.get("marca"),
    modelo: formData.get("modelo"),
    numero_serie: formData.get("numero_serie"),
    accesorios_entregados: formData.getAll("accesorios_entregados"),
    accesorios_otros: formData.get("accesorios_otros"),
    estado_fisico_ingreso: formData.get("estado_fisico_ingreso"),
    reported_fault: formData.get("reported_fault"),
    diagnosis_notes: formData.get("diagnosis_notes"),
    root_cause: formData.get("root_cause"),
    fecha_diagnostico: formData.get("fecha_diagnostico"),
    solution_applied: formData.get("solution_applied"),
    tiempo_trabajo_horas: formData.get("tiempo_trabajo_horas"),
    budget_quote: formData.get("budget_quote"),
    costo_mano_obra: formData.get("costo_mano_obra"),
    costo_repuestos: formData.get("costo_repuestos"),
    abono: formData.get("abono"),
    forma_pago: formData.get("forma_pago"),
    dias_garantia: formData.get("dias_garantia"),
    condiciones_garantia: formData.get("condiciones_garantia"),
    tecnico_responsable: formData.get("tecnico_responsable"),
    notas_internas: formData.get("notas_internas"),
    conforme_ingreso: formData.get("conforme_ingreso") === "on",
    conforme_retiro: formData.get("conforme_retiro") === "on",
    notificado_cliente: formData.get("notificado_cliente") === "on",
  };
}

export type DiagnosticFormState = { error?: string } | undefined;

export async function getDiagnosticsByClient(clientId: number) {
  await verifySession();
  return sql<
    DiagnosticWithClient[]
  >`SELECT * FROM diagnostics WHERE client_id = ${clientId} ORDER BY created_at DESC`;
}

export async function getAllDiagnostics(): Promise<DiagnosticWithClient[]> {
  await verifySession();
  return sql<DiagnosticWithClient[]>`
    SELECT d.*, c.name AS client_name, c.phone AS client_phone,
           c.email AS client_email, c.address AS client_address, c.rut AS client_rut
    FROM diagnostics d
    JOIN clients c ON c.id = d.client_id
    ORDER BY d.created_at DESC
  `;
}

export async function getDiagnosticById(id: number): Promise<{
  diagnostic: DiagnosticWithClient;
  parts: DiagnosticPart[];
  photos: DiagnosticPhoto[];
  history: StatusHistoryEntry[];
} | null> {
  await verifySession();

  const [diagnosticRows, parts, photos, history] = await Promise.all([
    sql<DiagnosticWithClient[]>`
      SELECT d.*, c.name AS client_name, c.phone AS client_phone,
             c.email AS client_email, c.address AS client_address, c.rut AS client_rut
      FROM diagnostics d
      JOIN clients c ON c.id = d.client_id
      WHERE d.id = ${id}
    `,
    sql<DiagnosticPart[]>`SELECT * FROM diagnostic_parts WHERE diagnostic_id = ${id} ORDER BY id`,
    sql<DiagnosticPhoto[]>`SELECT * FROM diagnostic_photos WHERE diagnostic_id = ${id} ORDER BY uploaded_at DESC`,
    sql<StatusHistoryEntry[]>`SELECT * FROM diagnostic_status_history WHERE diagnostic_id = ${id} ORDER BY changed_at ASC`,
  ]);

  const diagnostic = diagnosticRows[0];
  if (!diagnostic) return null;

  return { diagnostic, parts, photos, history };
}

export async function createDiagnostic(
  _prevState: DiagnosticFormState,
  formData: FormData
): Promise<DiagnosticFormState> {
  await verifySession();

  const validated = DiagnosticSchema.safeParse(readDiagnosticFormData(formData));
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const partsResult = parseParts(formData);
  if (!partsResult.success) {
    return { error: "Revisa los repuestos: nombre, cantidad y costo deben ser válidos." };
  }

  const data = validated.data;

  const [row] = await sql<{ id: number }[]>`
    INSERT INTO diagnostics ${sql(data, ...DIAGNOSTIC_COLUMNS)}
    RETURNING id
  `;

  await replaceParts(row.id, partsResult.data);
  await sql`INSERT INTO diagnostic_status_history (diagnostic_id, status) VALUES (${row.id}, ${data.status})`;

  revalidatePath(`/admin/clients/${data.client_id}`);
  revalidatePath("/admin/reportes");
  redirect(`/admin/reportes/${row.id}`);
}

export async function updateDiagnostic(
  diagnosticId: number,
  _prevState: DiagnosticFormState,
  formData: FormData
): Promise<DiagnosticFormState> {
  await verifySession();

  const validated = DiagnosticSchema.safeParse(readDiagnosticFormData(formData));
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const partsResult = parseParts(formData);
  if (!partsResult.success) {
    return { error: "Revisa los repuestos: nombre, cantidad y costo deben ser válidos." };
  }

  const data = validated.data;

  const [previous] = await sql<
    { status: DiagnosticStatus }[]
  >`SELECT status FROM diagnostics WHERE id = ${diagnosticId}`;
  if (!previous) {
    return { error: "Reporte no encontrado." };
  }

  await sql`UPDATE diagnostics SET ${sql(data, ...DIAGNOSTIC_COLUMNS)} WHERE id = ${diagnosticId}`;
  await replaceParts(diagnosticId, partsResult.data);

  if (previous.status !== data.status) {
    await sql`INSERT INTO diagnostic_status_history (diagnostic_id, status) VALUES (${diagnosticId}, ${data.status})`;
  }

  revalidatePath(`/admin/clients/${data.client_id}`);
  revalidatePath("/admin/reportes");
  revalidatePath(`/admin/reportes/${diagnosticId}`);
  redirect(`/admin/reportes/${diagnosticId}`);
}

export async function addDiagnosticPhoto(diagnosticId: number, url: string) {
  await verifySession();
  await sql`INSERT INTO diagnostic_photos (diagnostic_id, url) VALUES (${diagnosticId}, ${url})`;
  revalidatePath(`/admin/reportes/${diagnosticId}`);
}

export async function deleteDiagnosticPhoto(photoId: number, diagnosticId: number) {
  await verifySession();
  await sql`DELETE FROM diagnostic_photos WHERE id = ${photoId}`;
  revalidatePath(`/admin/reportes/${diagnosticId}`);
}

export async function deleteDiagnostic(diagnosticId: number) {
  await verifySession();

  const [diagnostic] = await sql<
    { client_id: number }[]
  >`SELECT client_id FROM diagnostics WHERE id = ${diagnosticId}`;
  if (!diagnostic) {
    redirect("/admin/reportes");
  }

  const photos = await sql<
    { url: string }[]
  >`SELECT url FROM diagnostic_photos WHERE diagnostic_id = ${diagnosticId}`;
  if (photos.length > 0) {
    try {
      await del(photos.map((p) => p.url));
    } catch {
      // best-effort cleanup; don't block deleting the record if Blob fails
    }
  }

  await sql`DELETE FROM diagnostics WHERE id = ${diagnosticId}`;

  revalidatePath(`/admin/clients/${diagnostic.client_id}`);
  revalidatePath("/admin/reportes");
  redirect("/admin/reportes");
}
