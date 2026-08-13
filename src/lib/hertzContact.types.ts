export type ForceUnit = "N" | "kN";
export type LengthUnit = "mm" | "µm" | "m";
export type ModulusUnit = "GPa" | "MPa";

export type HertzFormState = {
  force: string;
  forceUnit: ForceUnit;
  diameter: string;
  diameterUnit: LengthUnit;
  e1: string;
  e1Unit: ModulusUnit;
  nu1: string;
  e2: string;
  e2Unit: ModulusUnit;
  nu2: string;
};

/** All values in SI base units: N, m, Pa. */
export type HertzSIInputs = {
  F: number;
  R: number;
  E1: number;
  nu1: number;
  E2: number;
  nu2: number;
};

/** All values in SI base units. */
export type HertzResults = {
  EStar: number;
  a: number;
  contactDiameter: number;
  area: number;
  p0: number;
  pMean: number;
  delta: number;
};

export type HertzFieldKey =
  | "force"
  | "diameter"
  | "e1"
  | "nu1"
  | "e2"
  | "nu2";

export type HertzErrors = Partial<Record<HertzFieldKey, string>>;
