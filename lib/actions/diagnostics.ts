"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import {
  DIAGNOSTIC_STATUSES,
  type Diagnostic,
  type DiagnosticWithClient,
} from "@/lib/diagnostics";

const numericField = z
  .string()
  .trim()
  .optional()
  .transform((val) => (val ? val : undefined))
  .refine((val) => val === undefined || !Number.isNaN(Number(val)), {
    message: "Debe ser un número.",
  });

const DiagnosticSchema = z.object({
  client_id: z.coerce.number().int().positive({ message: "Selecciona un cliente." }),
  equipment_type: z.string().trim().optional(),
  brand_model: z.string().trim().optional(),
  reported_fault: z.string().trim().optional(),
  diagnosis_notes: z.string().trim().optional(),
  root_cause: z.string().trim().optional(),
  solution_applied: z.string().trim().optional(),
  status: z.enum(DIAGNOSTIC_STATUSES),
  budget_quote: numericField,
  final_cost: numericField,
  paid: z.boolean(),
});

export type DiagnosticFormState = { error?: string } | undefined;

export async function getDiagnosticsByClient(
  clientId: number
): Promise<Diagnostic[]> {
  await verifySession();
  return sql<
    Diagnostic[]
  >`SELECT * FROM diagnostics WHERE client_id = ${clientId} ORDER BY created_at DESC`;
}

export async function getAllDiagnostics(): Promise<DiagnosticWithClient[]> {
  await verifySession();
  return sql<DiagnosticWithClient[]>`
    SELECT d.*, c.name AS client_name, c.phone AS client_phone,
           c.email AS client_email, c.address AS client_address
    FROM diagnostics d
    JOIN clients c ON c.id = d.client_id
    ORDER BY d.created_at DESC
  `;
}

export async function getDiagnosticById(
  id: number
): Promise<DiagnosticWithClient | null> {
  await verifySession();
  const rows = await sql<DiagnosticWithClient[]>`
    SELECT d.*, c.name AS client_name, c.phone AS client_phone,
           c.email AS client_email, c.address AS client_address
    FROM diagnostics d
    JOIN clients c ON c.id = d.client_id
    WHERE d.id = ${id}
  `;
  return rows[0] ?? null;
}

export async function createDiagnostic(
  _prevState: DiagnosticFormState,
  formData: FormData
): Promise<DiagnosticFormState> {
  await verifySession();

  const validated = DiagnosticSchema.safeParse({
    client_id: formData.get("client_id"),
    equipment_type: formData.get("equipment_type"),
    brand_model: formData.get("brand_model"),
    reported_fault: formData.get("reported_fault"),
    diagnosis_notes: formData.get("diagnosis_notes"),
    root_cause: formData.get("root_cause"),
    solution_applied: formData.get("solution_applied"),
    status: formData.get("status"),
    budget_quote: formData.get("budget_quote"),
    final_cost: formData.get("final_cost"),
    paid: formData.get("paid") === "on",
  });

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const {
    client_id,
    equipment_type,
    brand_model,
    reported_fault,
    diagnosis_notes,
    root_cause,
    solution_applied,
    status,
    budget_quote,
    final_cost,
    paid,
  } = validated.data;

  await sql`INSERT INTO diagnostics (
      client_id, equipment_type, brand_model, reported_fault,
      diagnosis_notes, root_cause, solution_applied, status,
      budget_quote, final_cost, paid
    ) VALUES (
      ${client_id}, ${equipment_type || null}, ${brand_model || null}, ${reported_fault || null},
      ${diagnosis_notes || null}, ${root_cause || null}, ${solution_applied || null}, ${status},
      ${budget_quote ?? null}, ${final_cost ?? null}, ${paid}
    )`;

  revalidatePath(`/admin/clients/${client_id}`);
  revalidatePath("/admin/reportes");
}
