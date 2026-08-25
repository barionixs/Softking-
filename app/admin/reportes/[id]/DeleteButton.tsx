"use client";

import { deleteDiagnostic } from "@/lib/actions/diagnostics";

export function DeleteButton({ diagnosticId }: { diagnosticId: number }) {
  return (
    <form
      action={deleteDiagnostic.bind(null, diagnosticId)}
      onSubmit={(e) => {
        if (!confirm("¿Eliminar este reporte? Esta acción no se puede deshacer.")) {
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
