export type WearMode = "volume" | "mass";

export type VolumeUnit = "mm³" | "µm³" | "cm³";
export type MassUnit = "mg" | "g";
export type DensityUnit = "g/cm³" | "kg/m³";
export type WearForceUnit = "N" | "kN";
export type DistanceUnit = "m" | "km" | "mm";

export type WearFormState = {
  mode: WearMode;
  volume: string;
  volumeUnit: VolumeUnit;
  mass: string;
  massUnit: MassUnit;
  density: string;
  densityUnit: DensityUnit;
  force: string;
  forceUnit: WearForceUnit;
  distance: string;
  distanceUnit: DistanceUnit;
};

/** All values in SI base units: m³, kg, kg/m³, N, m. */
export type WearSIInputs = {
  V: number;
  F: number;
  s: number;
  dm?: number;
  rho?: number;
};

/** All values in SI base units: V [m³], qv [m³/m], ks [m³/(N·m)], qm [kg/m]. */
export type WearResults = {
  V: number;
  qv: number;
  ks: number;
  qm?: number;
};

export type WearFieldKey = "volume" | "mass" | "density" | "force" | "distance";

export type WearErrors = Partial<Record<WearFieldKey, string>>;
