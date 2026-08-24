export const DIAGNOSTIC_STATUSES = ["pending", "in_progress", "done"] as const;
export type DiagnosticStatus = (typeof DIAGNOSTIC_STATUSES)[number];

export const STATUS_LABELS: Record<DiagnosticStatus, string> = {
  pending: "Pendiente",
  in_progress: "En proceso",
  done: "Listo",
};

export type Diagnostic = {
  id: number;
  client_id: number;
  equipment_type: string | null;
  brand_model: string | null;
  reported_fault: string | null;
  diagnosis_notes: string | null;
  root_cause: string | null;
  solution_applied: string | null;
  status: DiagnosticStatus;
  budget_quote: string | null;
  final_cost: string | null;
  paid: boolean;
  created_at: string;
};

export type DiagnosticWithClient = Diagnostic & {
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  client_address: string | null;
};
