"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      className="btn btn--whatsapp admin-report__print-btn"
      onClick={() => window.print()}
    >
      Descargar PDF
    </button>
  );
}
