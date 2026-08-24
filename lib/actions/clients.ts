"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
