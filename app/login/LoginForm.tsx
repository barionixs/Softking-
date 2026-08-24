"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="admin-form">
      <div className="admin-form__field">
        <label htmlFor="username">Usuario</label>
        <input id="username" name="username" type="text" autoComplete="username" required />
      </div>
      <div className="admin-form__field">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state?.error && <p className="admin-form__error">{state.error}</p>}
      <button className="btn btn--whatsapp" type="submit" disabled={pending}>
        {pending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
