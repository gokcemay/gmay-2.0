import type { FrequencyUnit, LengthUnit, TimeUnit } from "./slidingDistance.types";

export const lengthUnits: LengthUnit[] = ["mm", "cm", "m"];
export const timeUnits: TimeUnit[] = ["s", "min", "h"];
export const frequencyUnits: FrequencyUnit[] = ["Hz", "cycles/min"];
export const rpmUnits = ["rpm"] as const;

const lengthFactor: Record<LengthUnit, number> = { mm: 1e-3, cm: 1e-2, m: 1 };
const timeFactor: Record<TimeUnit, number> = { s: 1, min: 60, h: 3600 };
const frequencyFactor: Record<FrequencyUnit, number> = { Hz: 1, "cycles/min": 1 / 60 };

/** length -> m */
export const toMeter = (v: number, u: LengthUnit) => v * lengthFactor[u];
/** time -> s */
export const toSecond = (v: number, u: TimeUnit) => v * timeFactor[u];
/** frequency -> complete cycles per second */
export const toHertz = (v: number, u: FrequencyUnit) => v * frequencyFactor[u];

/** Round to n significant figures, removing floating-point artifacts. */
export function sig(value: number, digits = 4): number {
  if (!Number.isFinite(value) || value === 0) return 0;
  return Number(value.toPrecision(digits));
}

/** Format a plain number: integers stay integers, otherwise 4 significant figures. */
export function formatNumber(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = sig(value, digits);
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded);
}

/** Total distance in m, switched to km when large. */
export function formatDistance(meters: number): { value: string; unit: "m" | "km" } {
  if (Math.abs(meters) >= 1000) return { value: formatNumber(meters / 1000), unit: "km" };
  return { value: formatNumber(meters), unit: "m" };
}

/** Per-revolution / per-cycle distance in mm, cm or m depending on magnitude. */
export function formatShortLength(meters: number): { value: string; unit: LengthUnit } {
  const abs = Math.abs(meters);
  if (abs >= 1) return { value: formatNumber(meters), unit: "m" };
  return { value: formatNumber(meters * 1000), unit: "mm" };
}

/** Speed in m/s, switched to mm/s when very small. */
export function formatSpeed(mps: number): { value: string; unit: "m/s" | "mm/s" } {
  if (Math.abs(mps) < 0.001) return { value: formatNumber(mps * 1000), unit: "mm/s" };
  return { value: formatNumber(mps), unit: "m/s" };
}

/** Counts: integer when mathematically integral, otherwise 4 significant figures. */
export function formatCount(count: number): string {
  if (!Number.isFinite(count)) return "—";
  const rounded = sig(count, 10);
  if (Number.isInteger(rounded)) return String(rounded);
  return formatNumber(count);
}
