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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleCheckWork = async () => {
    if (!problem.trim() || !work.trim()) {
        return;
    }

    setLoading(true);
    setError("");
    setFeedback("");

    try {
        const response = await fetch(
        "http://127.0.0.1:8000/check-work",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            problem,
            work,
            }),
        }
        );

        if (!response.ok) {
        throw new Error("Failed to check work.");
        }

        const data = await response.json();

        setFeedback(
        data.feedback?.message ||
            "Your work was checked successfully."
        );

        setMode("check");
    } catch (err) {
        console.error("Check work error:", err);

        setError(
        "Could not connect to the STEMLens backend."
        );
    } finally {
        setLoading(false);
    }
    };

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
         {error && (
            <p>{error}</p>
            )}
            
          <button onClick={() => setMode("hint")}>
            Give Hint
          </button>

          <button
            onClick={handleCheckWork}
            disabled={!problem.trim() || !work.trim() || loading}
            >
            {loading ? "Checking..." : "Check My Work"}
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

            <p>Your current work:</p>
            <p>{work}</p>

            <p>
            <strong>Backend feedback:</strong>
            </p>

            <p>{feedback}</p>

            <button
            onClick={handleCheckWork}
            disabled={loading}
            >
            {loading ? "Checking..." : "Check Again"}
            </button>

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