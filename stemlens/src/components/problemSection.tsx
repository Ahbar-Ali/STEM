import { useState } from "react";
import "../styles/problemSection.css";

function ProblemSection() {
  const [problemInput, setProblemInput] = useState("");
  const [currentProblem, setCurrentProblem] = useState("");

  const handleLoadProblem = () => {
    if (!problemInput.trim()) return;

    setCurrentProblem(problemInput.trim());
    setProblemInput("");
  };

  return (
    <section className="problem-section">
      <p className="label">Problem</p>

      <div className="problem-input-area">
        <textarea
          value={problemInput}
          onChange={(e) => setProblemInput(e.target.value)}
          placeholder="Type or paste a STEM problem..."
          className="problem-input"
        />

        <button
          type="button"
          onClick={handleLoadProblem}
          className="load-problem-btn"
        >
          Load Problem
        </button>
      </div>

      {currentProblem ? (
        <div className="current-problem">
          <p className="label">Current Problem</p>
          <h2>{currentProblem}</h2>
        </div>
      ) : (
        <div className="current-problem">
          <p className="empty-problem">
            Enter a problem above to begin.
          </p>
        </div>
      )}
    </section>
  );
}

export default ProblemSection;