import type { HealingReport } from "@/lib/healing_report";

export const HEALING_REPORT_STORAGE_KEY = "healing-report-v1";

export type ReportSessionMode = "explore" | "question";

export type StoredHealingReportPayload = {
  version: 1;
  report: HealingReport;
  generatedAt: string;
  mode: ReportSessionMode;
  scenarioTitle: string | null;
};

export function persistHealingReportForSession(
  payload: Omit<StoredHealingReportPayload, "version">,
): void {
  if (typeof window === "undefined") {
    return;
  }
  const full: StoredHealingReportPayload = { version: 1, ...payload };
  sessionStorage.setItem(HEALING_REPORT_STORAGE_KEY, JSON.stringify(full));
}

export function readStoredHealingReport(): StoredHealingReportPayload | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = sessionStorage.getItem(HEALING_REPORT_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as StoredHealingReportPayload;
    if (parsed?.version !== 1 || !parsed.report) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
