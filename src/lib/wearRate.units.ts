import type {
  DensityUnit,
  DistanceUnit,
  MassUnit,
  VolumeUnit,
  WearForceUnit,
} from "./wearRate.types";

export const volumeUnits: VolumeUnit[] = ["mm³", "µm³", "cm³"];
export const massUnits: MassUnit[] = ["mg", "g"];
export const densityUnits: DensityUnit[] = ["g/cm³", "kg/m³"];
export const wearForceUnits: WearForceUnit[] = ["N", "kN"];
export const distanceUnits: DistanceUnit[] = ["m", "km", "mm"];

const volumeFactor: Record<VolumeUnit, number> = {
  "mm³": 1e-9,
  "µm³": 1e-18,
  "cm³": 1e-6,
};
const massFactor: Record<MassUnit, number> = { mg: 1e-6, g: 1e-3 };
const densityFactor: Record<DensityUnit, number> = { "g/cm³": 1000, "kg/m³": 1 };
const forceFactor: Record<WearForceUnit, number> = { N: 1, kN: 1000 };
const distanceFactor: Record<DistanceUnit, number> = { m: 1, km: 1000, mm: 1e-3 };

/** volume -> m³ */
export const toCubicMeter = (v: number, u: VolumeUnit) => v * volumeFactor[u];
/** mass -> kg */
export const toKilogram = (v: number, u: MassUnit) => v * massFactor[u];
/** density -> kg/m³ */
export const toKgPerCubicMeter = (v: number, u: DensityUnit) => v * densityFactor[u];
/** force -> N */
export const toNewtonW = (v: number, u: WearForceUnit) => v * forceFactor[u];
/** distance -> m */
export const toMeterW = (v: number, u: DistanceUnit) => v * distanceFactor[u];

const superscripts: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "-": "⁻",
  "+": "",
};

function toSuperscript(exp: string): string {
  return exp
    .split("")
    .map((c) => superscripts[c] ?? c)
    .join("");
}

/** Readable value with 4 significant figures; scientific notation for small/large magnitudes. */
export function formatSci(value: number, threshold = 1e-3, digits = 4): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs < threshold || abs >= 1e6) {
    const [mantissa, exponent] = value.toExponential(digits - 1).split("e");
    return `${Number(mantissa)} × 10${toSuperscript(exponent ?? "0")}`;
  }
  return String(Number(value.toPrecision(digits)));
}

/** Plain-text (clipboard) form of a number. */
export function formatPlain(value: number, threshold = 1e-3, digits = 4): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs < threshold || abs >= 1e6) {
    const [mantissa, exponent] = value.toExponential(digits - 1).split("e");
    return `${Number(mantissa)}e${Number(exponent)}`;
  }
  return String(Number(value.toPrecision(digits)));
}

/** m³ -> mm³ (µm³ if extremely small). */
export function formatVolume(m3: number): { value: number; unit: VolumeUnit } {
  const mm3 = m3 * 1e9;
  if (Math.abs(mm3) < 1e-6) return { value: m3 * 1e18, unit: "µm³" };
  return { value: mm3, unit: "mm³" };
}

/** m³/m -> mm³/m */
export const toMm3PerM = (v: number) => v * 1e9;
/** m³/(N·m) -> mm³/(N·m) */
export const toMm3PerNm = (v: number) => v * 1e9;
/** kg/m -> mg/m */
export const toMgPerM = (v: number) => v * 1e6;
