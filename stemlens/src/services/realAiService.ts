
import type {
  CheckWorkRequest,
  CheckWorkResponse,
  HintRequest,
  HintResponse,
  TeachRequest,
  TeachResponse,
  SolutionRequest,
  SolutionResponse,
} from "../types/ai.Tutor";

const API_BASE_URL = "http://127.0.0.1:8000";

// Real AI - Check Student Work
export async function realCheckWork(
  request: CheckWorkRequest
): Promise<CheckWorkResponse> {
  const response = await fetch(`${API_BASE_URL}/check-work`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Check work failed: ${response.status}`);
  }

  return (await response.json()) as CheckWorkResponse;
}

// Real AI - Give Hint
export async function realGetHint(
  request: HintRequest
): Promise<HintResponse> {
  const response = await fetch(`${API_BASE_URL}/hint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Hint request failed: ${response.status}`);
  }

  return (await response.json()) as HintResponse;
}

// Real AI - Teach Concept
export async function realTeach(
  request: TeachRequest
): Promise<TeachResponse> {
  const response = await fetch(`${API_BASE_URL}/teach`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Teach request failed: ${response.status}`);
  }

  return (await response.json()) as TeachResponse;
}

export async function realGetSolution(
  request: SolutionRequest
): Promise<SolutionResponse> {
  const response = await fetch(`${API_BASE_URL}/solution`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Solution request failed: ${response.status}`);
  }

  return (await response.json()) as SolutionResponse;
}
