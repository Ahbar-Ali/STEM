import { useEffect, useState } from "react";
import "../styles/ProblemSection.css";

function ProblemSection() {
  const [problemInput, setProblemInput] = useState("");

  const [currentProblem, setCurrentProblem] = useState(() => {
    return localStorage.getItem("stemlens-current-problem") || "";
  });

  const [isEditing, setIsEditing] = useState(() => {
    const savedProblem = localStorage.getItem("stemlens-current-problem");
    return !savedProblem;
  });

  useEffect(() => {
    localStorage.setItem(
      "stemlens-current-problem",
      currentProblem
    );
  }, [currentProblem]);

  const handleLoadProblem = () => {
    if (!problemInput.trim()) return;

    setCurrentProblem(problemInput.trim());
    setProblemInput("");
    setIsEditing(false);
  };

  const handleEditProblem = () => {
    setProblemInput(currentProblem);
    setIsEditing(true);
  };

  return (
    <section className="problem-section">
      {isEditing ? (
        <>
          <div className="problem-header-row">
            <div>
              <p className="label">Problem</p>
              <h2>Enter the problem you want to solve</h2>
            </div>
          </div>

          <div className="problem-input-area">
            <textarea
              value={problemInput}
              onChange={(event) =>
                setProblemInput(event.target.value)
              }
              placeholder="Type or paste a STEM problem..."
              className="problem-input"
            />

            <div className="problem-actions">
              {currentProblem && (
                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={() => {
                    setProblemInput("");
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                className="load-problem-btn"
                onClick={handleLoadProblem}
              >
                Start Solving
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="compact-problem">
          <div className="compact-problem-content">
            <p className="label">Current Problem</p>

            <h2>{currentProblem}</h2>
          </div>

          <button
            type="button"
            className="edit-problem-btn"
            onClick={handleEditProblem}
          >
            Edit Problem
          </button>
        </div>
      )}
    </section>
  );
}

export default ProblemSection;