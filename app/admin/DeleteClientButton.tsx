"use client";

import { deleteClient } from "@/lib/actions/clients";

export function DeleteClientButton({
  clientId,
  clientName,
}: {
  clientId: number;
  clientName: string;
}) {
  return (
    <form
      action={deleteClient.bind(null, clientId)}
      onSubmit={(e) => {
        if (
          !confirm(
            `¿Eliminar a ${clientName}? Se borrarán también todos sus reportes. Esta acción no se puede deshacer.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="btn btn--ghost admin-report__delete-btn">
        Eliminar
      </button>
    </form>
  );
}
