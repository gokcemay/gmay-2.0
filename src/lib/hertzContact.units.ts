import type { ForceUnit, LengthUnit, ModulusUnit } from "./hertzContact.types";

export const forceUnits: ForceUnit[] = ["N", "kN"];
export const lengthUnits: LengthUnit[] = ["mm", "µm", "m"];
export const modulusUnits: ModulusUnit[] = ["GPa", "MPa"];

const forceFactor: Record<ForceUnit, number> = { N: 1, kN: 1000 };
const lengthFactor: Record<LengthUnit, number> = { m: 1, mm: 1e-3, "µm": 1e-6 };
const modulusFactor: Record<ModulusUnit, number> = { GPa: 1e9, MPa: 1e6 };

export const toNewton = (value: number, unit: ForceUnit) => value * forceFactor[unit];
export const toMeter = (value: number, unit: LengthUnit) => value * lengthFactor[unit];
export const toPascal = (value: number, unit: ModulusUnit) => value * modulusFactor[unit];

/** Format with 4 significant figures, without exponent noise for normal ranges. */
export function sig(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1e6 || abs < 1e-4) return value.toExponential(digits - 1);
  const rounded = Number(value.toPrecision(digits));
  return String(rounded);
}

/** Length in m -> readable mm or µm. */
export function formatLength(meters: number): { value: string; unit: string } {
  const mm = meters * 1e3;
  if (Math.abs(mm) < 1) return { value: sig(meters * 1e6), unit: "µm" };
  return { value: sig(mm), unit: "mm" };
}

/** Length in m -> µm preferred (elastic approach). */
export function formatMicron(meters: number): { value: string; unit: string } {
  const um = meters * 1e6;
  if (Math.abs(um) >= 1000) return { value: sig(meters * 1e3), unit: "mm" };
  return { value: sig(um), unit: "µm" };
}

/** Area in m² -> mm². */
export function formatArea(m2: number): { value: string; unit: string } {
  return { value: sig(m2 * 1e6), unit: "mm²" };
}

/** Pressure in Pa -> MPa or GPa. */
export function formatPressure(pa: number): { value: string; unit: string } {
  const mpa = pa / 1e6;
  if (Math.abs(mpa) >= 1000) return { value: sig(mpa / 1000), unit: "GPa" };
  return { value: sig(mpa), unit: "MPa" };
}

/** Modulus in Pa -> GPa. */
export function formatModulus(pa: number): { value: string; unit: string } {
  return { value: sig(pa / 1e9), unit: "GPa" };
}
