import { useState } from "react";

type TutorMode =
  | "idle"
  | "hint"
  | "check"
  | "teach"
  | "solution";

type AITutorProps = {
  problem: string;
  work: string;
};

function AITutor({ problem, work }: AITutorProps) {
  const [mode, setMode] = useState<TutorMode>("idle");

  return (
    <aside className="ai-panel">
      <p className="label">AI Tutor</p>

      <div className="concept-card">
        <span>Detected concept</span>
        <strong>
          {problem ? "Problem detected" : "No problem yet"}
        </strong>
      </div>

      {mode === "idle" && (
        <>
          <button onClick={() => setMode("hint")}>
            Give Hint
          </button>

          <button onClick={() => setMode("check")}>
            Check My Work
          </button>

          <button onClick={() => setMode("teach")}>
            Teach Me
          </button>

          <button onClick={() => setMode("solution")}>
            Show Solution
          </button>
        </>
      )}

      {mode === "hint" && (
        <div>
          <h3>Hint</h3>

          <p>
            {problem
              ? `Think carefully about how to approach: ${problem}`
              : "Enter a problem first."}
          </p>

          <button onClick={() => setMode("idle")}>
            Back
          </button>
        </div>
      )}

      {mode === "check" && (
        <div>
          <h3>Check Result</h3>

          {work ? (
            <>
              <p>Your current work:</p>
              <p>{work}</p>
            </>
          ) : (
            <p>You haven't entered any work yet.</p>
          )}

          <button onClick={() => setMode("idle")}>
            Back
          </button>
        </div>
      )}

      {mode === "teach" && (
        <div>
          <h3>Concept Explanation</h3>

          <p>
            {problem
              ? "The AI tutor will eventually detect the topic and explain the relevant concepts here."
              : "Enter a problem first so the tutor can identify the concept."}
          </p>

          <button onClick={() => setMode("idle")}>
            Back
          </button>
        </div>
      )}

      {mode === "solution" && (
        <div>
          <h3>Full Solution</h3>

          <p>
            {problem
              ? "The generated step-by-step solution will appear here."
              : "Enter a problem first."}
          </p>

          <button onClick={() => setMode("idle")}>
            Back
          </button>
        </div>
      )}
    </aside>
  );
}

export default AITutor;