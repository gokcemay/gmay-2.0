export type MotionMode = "rotary" | "reciprocating";

export type LengthUnit = "mm" | "cm" | "m";
export type TimeUnit = "s" | "min" | "h";
export type FrequencyUnit = "Hz" | "cycles/min";
export type SpeedUnit = "rpm";

export type SlidingFormState = {
  mode: MotionMode;
  /** rotary */
  radius: string;
  radiusUnit: LengthUnit;
  rpm: string;
  /** reciprocating */
  stroke: string;
  strokeUnit: LengthUnit;
  frequency: string;
  frequencyUnit: FrequencyUnit;
  /** common */
  duration: string;
  durationUnit: TimeUnit;
};

export type SlidingFieldKey = "radius" | "rpm" | "stroke" | "frequency" | "duration";

export type SlidingErrors = Partial<Record<SlidingFieldKey, string>>;

/** SI inputs: r [m], n [rpm], t [s] */
export type RotarySIInputs = { r: number; n: number; t: number };
/** SI inputs: L [m], f [cycles/s], t [s] */
export type ReciprocatingSIInputs = { L: number; f: number; t: number };

/**
 * N = count (revolutions or cycles)
 * perUnit = distance per revolution / per cycle [m]
 * s = total sliding distance [m]
 * v = sliding speed [m/s] (circumferential for rotary, path-average for reciprocating)
 */
export type SlidingResults = {
  N: number;
  perUnit: number;
  s: number;
  v: number;
};
