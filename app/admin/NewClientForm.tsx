"use client";

import { useActionState } from "react";
import { createClient } from "@/lib/actions/clients";

export function NewClientForm() {
  const [state, action, pending] = useActionState(createClient, undefined);

  return (
    <form action={action} className="admin-form">
      <div className="admin-form__field">
        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" type="text" required />
      </div>
      <div className="admin-form__field">
        <label htmlFor="phone">Teléfono / WhatsApp</label>
        <input id="phone" name="phone" type="text" />
      </div>
      <div className="admin-form__field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
      </div>
      <div className="admin-form__field">
        <label htmlFor="address">Dirección</label>
        <input id="address" name="address" type="text" />
      </div>
      <div className="admin-form__field">
        <label htmlFor="rut">RUT</label>
        <input id="rut" name="rut" type="text" placeholder="Opcional" />
      </div>
      {state?.error && <p className="admin-form__error">{state.error}</p>}
      <button className="btn btn--whatsapp" type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Agregar cliente"}
      </button>
    </form>
  );
}
