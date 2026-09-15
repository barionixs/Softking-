"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { sql } from "@/lib/db";
import { verifySession } from "@/lib/dal";

export type Client = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  rut: string | null;
  created_at: string;
};

const ClientSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio."),
  phone: z.string().trim().optional(),
  email: z.string().trim().optional(),
  address: z.string().trim().optional(),
  rut: z.string().trim().optional(),
});

export type ClientFormState = { error?: string } | undefined;

export async function getClients(): Promise<Client[]> {
  await verifySession();
  return sql<Client[]>`SELECT * FROM clients ORDER BY created_at DESC`;
}

export async function getClientById(id: number): Promise<Client | null> {
  await verifySession();
  const rows = await sql<Client[]>`SELECT * FROM clients WHERE id = ${id}`;
  return rows[0] ?? null;
}

export async function createClient(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  await verifySession();

  const validated = ClientSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    rut: formData.get("rut"),
  });

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { name, phone, email, address, rut } = validated.data;

  const rows = await sql<
    { id: number }[]
  >`INSERT INTO clients (name, phone, email, address, rut)
    VALUES (${name}, ${phone || null}, ${email || null}, ${address || null}, ${rut || null})
    RETURNING id`;

  revalidatePath("/admin");
  redirect(`/admin/clients/${rows[0].id}`);
}

export async function deleteClient(clientId: number) {
  await verifySession();

  const [client] = await sql<
    { id: number }[]
  >`SELECT id FROM clients WHERE id = ${clientId}`;
  if (!client) {
    redirect("/admin");
  }

  const photos = await sql<{ url: string }[]>`
    SELECT p.url FROM diagnostic_photos p
    JOIN diagnostics d ON d.id = p.diagnostic_id
    WHERE d.client_id = ${clientId}`;
  if (photos.length > 0) {
    try {
      await del(photos.map((p) => p.url));
    } catch {
      // best-effort cleanup; don't block deleting the record if Blob fails
    }
  }

  // diagnostics (and their parts/photos/history) cascade via ON DELETE CASCADE
  await sql`DELETE FROM clients WHERE id = ${clientId}`;

  revalidatePath("/admin");
  revalidatePath("/admin/reportes");
  redirect("/admin");
}
