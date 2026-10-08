export type ProblemInputMode =
  | "text"
  | "image";

export type ProblemImage = {
  file: File;
  previewUrl: string;
};

export type ExtractProblemResponse = {
  extractedText: string;
};