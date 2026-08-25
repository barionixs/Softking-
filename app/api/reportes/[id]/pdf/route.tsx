import { renderToBuffer } from "@react-pdf/renderer";
import { getDiagnosticById } from "@/lib/actions/diagnostics";
import { ReportDocument } from "./ReportDocument";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const diagnosticId = Number(id);
  if (!Number.isInteger(diagnosticId)) {
    return new Response("No encontrado", { status: 404 });
  }

  const result = await getDiagnosticById(diagnosticId);
  if (!result) {
    return new Response("No encontrado", { status: 404 });
  }

  const logoSrc = new URL("/img/logo-softking-dark.png", request.url).toString();

  const buffer = await renderToBuffer(
    <ReportDocument
      diagnostic={result.diagnostic}
      parts={result.parts}
      photos={result.photos}
      logoSrc={logoSrc}
    />
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="reporte-${diagnosticId}.pdf"`,
    },
  });
}
