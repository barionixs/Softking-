import { notFound } from "next/navigation";
import { getDiagnosticById } from "@/lib/actions/diagnostics";
import { DiagnosticForm } from "@/app/admin/DiagnosticForm";

export default async function EditarReportePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diagnosticId = Number(id);
  if (!Number.isInteger(diagnosticId)) {
    notFound();
  }

  const result = await getDiagnosticById(diagnosticId);
  if (!result) {
    notFound();
  }

  return (
    <>
      <h1 className="admin-shell__title">Editar reporte N° {diagnosticId}</h1>
      <section className="admin-panel admin-panel--form">
        <DiagnosticForm
          clientId={result.diagnostic.client_id}
          diagnosticId={diagnosticId}
          diagnostic={result.diagnostic}
          parts={result.parts}
        />
      </section>
    </>
  );
}
