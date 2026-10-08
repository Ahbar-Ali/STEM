import type {
  ExtractProblemResponse,
} from "../types/problemInput";

const wait = (milliseconds: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export async function mockExtractProblem(
  image: File
): Promise<ExtractProblemResponse> {
  await wait(1200);

  console.log(
    "Mock extracting problem from:",
    image.name
  );

  return {
    extractedText:
      "Solve for x: 2x + 4 = 12",
  };
}