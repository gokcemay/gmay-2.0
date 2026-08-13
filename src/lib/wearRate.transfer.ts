import type { DistanceUnit } from "./wearRate.types";

export type SlidingTransfer = {
  /** Sliding distance in meters. */
  distanceMeters: number;
  unit: DistanceUnit;
  source: string;
};

const knownUnits: Record<string, number> = { m: 1, km: 1000, mm: 1e-3 };

/**
 * Safely parse a sliding-distance transfer from URL search params.
 * Kept separate from calculateWearRate() so calculation logic stays routing-free.
 */
export function parseSlidingTransfer(search: unknown): SlidingTransfer | null {
  if (!search || typeof search !== "object") return null;
  const raw = search as Record<string, unknown>;

  const distanceRaw = raw["distance"];
  if (typeof distanceRaw !== "string" && typeof distanceRaw !== "number") return null;
  const value = Number(String(distanceRaw).trim());
  if (!Number.isFinite(value) || value <= 0) return null;

  const unitRaw = typeof raw["distanceUnit"] === "string" ? String(raw["distanceUnit"]) : "m";
  const factor = knownUnits[unitRaw];
  if (typeof factor !== "number") return null;

  const distanceMeters = value * factor;
  if (!Number.isFinite(distanceMeters) || distanceMeters <= 0) return null;

  const sourceRaw = typeof raw["source"] === "string" ? String(raw["source"]) : "";
  const source = sourceRaw === "sliding-distance" ? sourceRaw : "";
  if (!source) return null;

  return { distanceMeters, unit: unitRaw as DistanceUnit, source };
}

/** Format a transferred distance for the input field (max 6 significant figures). */
export function formatTransferredDistance(meters: number): string {
  return String(Number(meters.toPrecision(6)));
}
