"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

const LoginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export type LoginState = { error?: string } | undefined;

const INVALID_CREDENTIALS = "Usuario o contraseña incorrectos.";

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const validated = LoginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { error: INVALID_CREDENTIALS };
  }

  const { username, password } = validated.data;

  const rows = await sql<
    { id: number; username: string; password_hash: string }[]
  >`SELECT id, username, password_hash FROM users WHERE username = ${username}`;
  const user = rows[0];

  if (!user) {
    return { error: INVALID_CREDENTIALS };
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return { error: INVALID_CREDENTIALS };
  }

  await createSession(user.id, user.username);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
