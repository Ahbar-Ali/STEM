export type TutorMode =
  | "idle"
  | "hint"
  | "check"
  | "teach"
  | "solution";

export type WorkspacePageData = {
  id: string;
  name: string;
  work: string;
};

export type SelectedWorkPage = {
  pageId: string;
  pageName: string;
  work: string;
};

export type CheckedStep = {
  stepNumber: number;
  text: string;
  correct: boolean;
  mistakeType: string | null;
  explanation: string;
  hint: string | null;
};

export type PageCheckResult = {
  pageId: string;
  pageName: string;
  firstError: number | null;
  steps: CheckedStep[];
};

export type CheckWorkRequest = {
  problem: string;
  pages: SelectedWorkPage[];
};

export type CheckWorkResponse = {
  status: "success";
  pages: PageCheckResult[];
};

export type HintRequest = {
  problem: string;
  pages: SelectedWorkPage[];
};

export type HintResponse = {
  title: string;
  hint: string;
  nextQuestion: string;
};

export type TeachRequest = {
  problem: string;
  pages: SelectedWorkPage[];
};

export type LessonSection = {
  title: string;
  explanation: string;
};

export type TeachResponse = {
  concept: string;
  summary: string;
  lessons: LessonSection[];
  formula?: string;
};

export type SolutionRequest = {
  problem: string;
  pages: SelectedWorkPage[];
};

export type SolutionStep = {
  stepNumber: number;
  explanation: string;
  expression: string;
};

export type SolutionResponse = {
  summary: string;
  steps: SolutionStep[];
  finalAnswer: string;
};