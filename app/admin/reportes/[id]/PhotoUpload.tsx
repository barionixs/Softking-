"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { addDiagnosticPhoto, deleteDiagnosticPhoto } from "@/lib/actions/diagnostics";
import type { DiagnosticPhoto } from "@/lib/diagnostics";

export function PhotoUpload({
  diagnosticId,
  photos,
}: {
  diagnosticId: number;
  photos: DiagnosticPhoto[];
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        await addDiagnosticPhoto(diagnosticId, blob.url);
      }
    } catch {
      setError("No se pudo subir la foto. Intenta de nuevo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="admin-photos">
      <div className="admin-photos__grid">
        {photos.map((photo) => (
          <div className="admin-photos__item" key={photo.id}>
            <Image src={photo.url} alt="Foto del equipo" width={160} height={160} unoptimized />
            <button
              type="button"
              className="admin-photos__remove"
              onClick={() => deleteDiagnosticPhoto(photo.id, diagnosticId)}
              aria-label="Eliminar foto"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
      />
      {uploading && <p className="admin-form__hint">Subiendo...</p>}
      {error && <p className="admin-form__error">{error}</p>}
    </div>
  );
}
