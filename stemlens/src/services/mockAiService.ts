import type {
  CheckWorkRequest,
  CheckWorkResponse,
  HintRequest,
  HintResponse,
  SolutionRequest,
  SolutionResponse,
  TeachRequest,
  TeachResponse,
} from "../types/ai.Tutor";

const wait = (milliseconds: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export async function mockCheckWork(
  request: CheckWorkRequest
): Promise<CheckWorkResponse> {
  await wait(900);

  return {
    status: "success",

    pages: request.pages.map((page, pageIndex) => {
      const lines = page.work
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const displayedLines =
        lines.length > 0
          ? lines
          : ["No typed work found."];

      return {
        pageId: page.pageId,
        pageName: page.pageName,

        firstError:
          pageIndex === 0 && displayedLines.length >= 2
            ? 2
            : null,

        steps: displayedLines.map((line, index) => {
          const stepNumber = index + 1;

          const shouldMockError =
            pageIndex === 0 &&
            stepNumber === 2;

          return {
            stepNumber,
            text: line,

            correct: !shouldMockError,

            mistakeType: shouldMockError
              ? "algebra"
              : null,

            explanation: shouldMockError
              ? "This step changes the expression incorrectly. Check the operation applied to both sides."
              : "This step is consistent with the previous work.",

            hint: shouldMockError
              ? "Ask yourself which operation should be applied to both sides before continuing."
              : null,
          };
        }),
      };
    }),
  };
}

export async function mockGetHint(
  request: HintRequest
): Promise<HintResponse> {
  await wait(700);

  const hasWork = request.pages.some(
    (page) => page.work.trim().length > 0
  );

  return {
    title: hasWork
      ? "Think about your next step"
      : "Start with the structure of the problem",

    hint: hasWork
      ? "Look at your most recent step and identify what quantity you are trying to isolate or simplify. Try one valid transformation at a time."
      : "Identify what the problem gives you, what it asks you to find, and which relationship connects those quantities.",

    nextQuestion:
      "What operation or principle would move you one step closer without solving the whole problem at once?",
  };
}

export async function mockTeach(
  _request: TeachRequest
): Promise<TeachResponse> {
  await wait(850);

  return {
    concept: "Equation Manipulation",

    summary:
      "When manipulating an equation, every transformation must preserve equality. Whatever operation is applied to one side must also be valid for the other side.",

    lessons: [
      {
        title: "Preserve equality",
        explanation:
          "An equation states that two expressions are equal. Valid algebraic operations must preserve that relationship.",
      },
      {
        title: "Work one step at a time",
        explanation:
          "Breaking a solution into small transformations makes mistakes easier to detect and explain.",
      },
      {
        title: "Check the result",
        explanation:
          "Substitute your result back into the original expression when possible to verify that it satisfies the problem.",
      },
    ],

    formula: "If a = b, then a ÷ c = b ÷ c for c ≠ 0",
  };
}

export async function mockGetSolution(
  _request: SolutionRequest
): Promise<SolutionResponse> {
  await wait(950);

  return {
    summary:
      "Here is a complete example solution. In the real product this will be generated from the actual problem.",

    steps: [
      {
        stepNumber: 1,
        explanation:
          "Identify the equation and the variable that needs to be isolated.",
        expression: "2x = 8",
      },
      {
        stepNumber: 2,
        explanation:
          "Divide both sides by the coefficient of x.",
        expression: "x = 8 / 2",
      },
      {
        stepNumber: 3,
        explanation:
          "Simplify the expression.",
        expression: "x = 4",
      },
    ],

    finalAnswer: "x = 4",
  };
}