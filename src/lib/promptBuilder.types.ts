export type DetailLevel = "Kısa" | "Standart" | "Ayrıntılı";

export type PromptFormState = {
  field: string;
  task: string;
  outputFormat: string;
  context: string;
  constraints: string;
  detail: DetailLevel;
  styles: string[];
};

export type ReadinessLevel = "Temel" | "İyi" | "Ayrıntılı";
